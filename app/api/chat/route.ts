import { NextResponse } from "next/server"
import { waitUntil } from "@vercel/functions"
import { headers } from "next/headers"
import Groq from "groq-sdk"
import { parseUA } from "@/functions/lib/ua-parser"
import { sendTelegramAlert } from "@/functions/lib/notifications"
import { SYSTEM_PROMPT } from "./prompt"
import { MAX_CHARS_FOR_ASK_ERIC } from "@/constants/max-chars-input-chat"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MINUTE_LIMIT = 5
const DAILY_LIMIT = 20

const rateLimitMap = new Map<
  string,
  {
    minuteCount: number
    minuteReset: number
    dayCount: number
    dayReset: number
  }
>()

export async function POST(req: Request) {
  const uuid = crypto.randomUUID()

  try {
    const head = await headers()
    const ip = head.get("x-forwarded-for")?.split(",")[0] || "Unknown"

    const { messages } = await req.json()
    const lastUserMessage = messages[messages.length - 1]?.content || "No message"

    const uaString = head.get("user-agent") || ""
    const { browser, os } = parseUA(uaString)

    let isTor = false
    if (ip !== "127.0.0.1") {
      const torCheck = await fetch(`http://ip-api.com/json/${ip}?fields=proxy`)
      const data = await torCheck.json()
      isTor = data.proxy || false
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
    }

    if (isTor) {
      const refusal = "Access Denied: Tor exit node detected. Protocol violation."
      waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, metadata).catch(console.error))
      return NextResponse.json({ answer: refusal }, { status: 403 })
    }

    if (lastUserMessage.length > MAX_CHARS_FOR_ASK_ERIC) {
      const refusal = `Payload too large. Max ${MAX_CHARS_FOR_ASK_ERIC} characters allowed for signal clarity.`

      console.warn(refusal)

      waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, metadata).catch(console.error))

      return NextResponse.json(
        JSON.stringify({
          error: "Input too long.",
          answer: `Please keep your message under ${MAX_CHARS_FOR_ASK_ERIC} characters to maintain high signal-to-noise ratio.`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // --- Rate Limit Logic ---
    const now = Date.now()
    const ONE_MIN = 60 * 1000
    const ONE_DAY = 24 * 60 * 60 * 1000

    const limitData = rateLimitMap.get(ip) || {
      minuteCount: 0,
      minuteReset: now,
      dayCount: 0,
      dayReset: now,
    }

    // 1-minute reset
    if (now - limitData.minuteReset > ONE_MIN) {
      limitData.minuteCount = 0
      limitData.minuteReset = now
    }

    // 24-hour reset
    if (now - limitData.dayReset > ONE_DAY) {
      limitData.dayCount = 0
      limitData.dayReset = now
    }

    // Burst validation (5 msg / 1 min)
    if (limitData.minuteCount >= MINUTE_LIMIT) {
      const refusal = `Slow down. Burst limit reached (${MINUTE_LIMIT}/min).`
      waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, metadata).catch(console.error))
      return NextResponse.json({ answer: refusal }, { status: 429 })
    }

    // Quota Validation (20 messages / 24 hours)
    if (limitData.dayCount >= DAILY_LIMIT) {
      const refusal = `Rate limit exceeded. Daily quota depleted (${DAILY_LIMIT}/${DAILY_LIMIT}). Try again tomorrow.`
      waitUntil(sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, metadata).catch(console.error))
      return NextResponse.json({ answer: refusal }, { status: 429 })
    }

    // Increment counters
    limitData.minuteCount++
    limitData.dayCount++
    rateLimitMap.set(ip, limitData)
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
    console.log(`Message received by Ask Eric ID: ${uuid}; Error: ${error}`)
    return NextResponse.json({ error: "Internal failure. Sovereign system state: UNSTABLE." }, { status: 503 })
  }
}
