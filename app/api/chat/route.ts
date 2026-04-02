import { NextResponse } from "next/server"
import { waitUntil } from "@vercel/functions"
import { headers } from "next/headers"
import Groq from "groq-sdk"
import { parseUA } from "@/functions/lib/ua-parser"
import { sendTelegramAlert } from "@/functions/lib/notifications"
import { SYSTEM_PROMPT } from "./prompt"
import { IP_VALIDATION_TIMEOUT, MAX_CHARS_FOR_ASK_ERIC } from "@/constants/max-chars-input-chat"
import z from "zod"
import { validateObject } from "@/functions/lib/validation"
import { env } from "@/functions/lib/env"
import { Redis } from "@upstash/redis"

const groq = new Groq({ apiKey: env.GROQ_API_KEY })

const MINUTE_LIMIT = 5
const DAILY_LIMIT = 20

const ProxyCheckSchema = z
  .object({
    status: z.string(),
  })
  .catchall(
    z.union([
      z.string(),
      z.object({
        proxy: z.enum(["yes", "no"]),
        type: z.string().optional(),
        risk: z.number().default(0),
        country: z.string().optional(),
        provider: z.string().optional(),
        asn: z.string().optional(),
      }),
    ])
  )

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

export async function POST(req: Request) {
  const uuid = crypto.randomUUID()

  try {
    const head = await headers()

    const rawIp =
      head.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      head.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1"
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^[\da-f:]+$/i
    let ip: string
    if (rawIp && (ipv4Regex.test(rawIp) || ipv6Regex.test(rawIp))) {
      ip = rawIp
    } else {
      console.warn("Invalid or missing IP:", rawIp)
      return NextResponse.json({ answer: "Invalid request origin." }, { status: 400 })
    }

    const { messages } = await req.json()
    const lastUserMessage = messages[messages.length - 1]?.content || "No message"

    const uaString = head.get("user-agent") || ""
    const { browser, os } = parseUA(uaString)

    let isTor = false
    if (ip !== "127.0.0.1" && ip !== "::1") {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), IP_VALIDATION_TIMEOUT)

      try {
        const torCheck = await fetch(`https://proxycheck.io/v2/${ip}?vpn=1&asn=1&risk=1`, {
          signal: controller.signal,
        })

        const invalidatedData = await torCheck.json()
        const { success, data } = validateObject(ProxyCheckSchema, invalidatedData)

        const obj = !!data && data[ip]
        if (!success || !obj || typeof obj === "string") {
          throw new Error("Invalid security payload")
        }

        isTor = obj.proxy === "yes" || obj.risk >= 66
      } catch (err) {
        const refusal = "Security verification failed. Access denied for system safety."

        const metadata = {
          ip,
          city: head.get("x-vercel-ip-city") || "Unknown",
          country: head.get("x-vercel-ip-country") || "Unknown",
          browser,
          os,
          referer: head.get("referer") || "Direct",
          isTor,
          uuid,
          status: 403,
        }

        waitUntil(
          sendTelegramAlert(lastUserMessage, `[CRITICAL] IP verification to proxycheck failed: ${ip}`, metadata).catch(
            console.error
          )
        )

        return NextResponse.json({ answer: refusal }, { status: 403 })
      } finally {
        clearTimeout(timeoutId)
      }
    }

    const metadata = {
      ip,
      city: head.get("x-vercel-ip-city") || "Unknown",
      country: head.get("x-vercel-ip-country") || "Unknown",
      browser,
      os,
      referer: head.get("referer") || "Direct",
      isTor,
      uuid,
      status: 200,
    }

    if (isTor) {
      const refusal = "Access Denied: Tor exit node detected. Protocol violation."
      waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, { ...metadata, status: 403 }).catch(console.error))
      return NextResponse.json({ answer: refusal }, { status: 403 })
    }

    if (lastUserMessage.length > MAX_CHARS_FOR_ASK_ERIC) {
      const refusal = `Payload too large. Max ${MAX_CHARS_FOR_ASK_ERIC} characters allowed for signal clarity.`

      console.warn(refusal)

      waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, { ...metadata, status: 400 }).catch(console.error))

      return NextResponse.json(
        {
          error: "Input too long.",
          answer: `Please keep your message under ${MAX_CHARS_FOR_ASK_ERIC} characters to maintain high signal-to-noise ratio.`,
        },
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // --- Redis Rate Limit Logic ---
    const rawIP = ip || "0.0.0.0"
    const safeIP = rawIP.replace(/[^a-zA-Z0-9\.\:]/g, "_")

    const minKey = `limit:min:${safeIP}`
    const dayKey = `limit:day:${safeIP}`
    const alertKey = `limit:alert_sent:${safeIP}`

    let minCount: number
    let dayCount: number

    try {
      // Increments and sets expiration in a single trip (pipeline)
      const results = await redis
        .pipeline()
        .incr(minKey)
        .expire(minKey, 60, "NX")
        .incr(dayKey)
        .expire(dayKey, 86400, "NX")
        .exec()

      minCount = results?.[0] as number
      dayCount = results?.[2] as number

      if (typeof minCount !== "number" || typeof dayCount !== "number") {
        throw new Error("Redis pipeline returned invalid results")
      }
    } catch (error) {
      console.error("Redis rate limit error:", error)

      // Fail-closed: lock on failure
      return NextResponse.json({ answer: "Service temporarily unavailable. Please try again." }, { status: 503 })
    }

    if (minCount > MINUTE_LIMIT || dayCount > DAILY_LIMIT) {
      const isBurst = minCount > MINUTE_LIMIT
      const refusal = isBurst
        ? `Slow down. Burst limit reached (${MINUTE_LIMIT}/min).` // Burst Validation (5 msg / 1 min)
        : `Rate limit exceeded. Daily quota depleted (${DAILY_LIMIT}/${DAILY_LIMIT}). Try again tomorrow.` // Quota Validation (20 messages / 24 hours)

      //
      const shouldSendAlert = await redis.set(alertKey, "true", { ex: 300, nx: true })
      if (shouldSendAlert) {
        waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, { ...metadata, status: 429 }).catch(console.error))
      }

      return NextResponse.json({ answer: refusal }, { status: 429 })
    }
    // --- End of Rate Limit Logic ---

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.2,
      max_tokens: 300,
    })

    const botAnswer = response.choices[0]?.message?.content || ""
    waitUntil(sendTelegramAlert(lastUserMessage, botAnswer, metadata).catch(console.error))

    console.log(`Message received by Ask Eric ID: ${uuid}; Response 200`)
    return NextResponse.json({
      answer: response.choices[0]?.message?.content,
    })
  } catch (error) {
    console.error(`Ask Eric error [${uuid}]:`, error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Internal failure. Sovereign system state: UNSTABLE." }, { status: 503 })
  }
}
