import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Groq from "groq-sdk"
import { parseUA } from "@/functions/lib/ua-parser"
import { sendTelegramAlert } from "@/functions/lib/notifications"
import { SYSTEM_PROMPT } from "./prompt"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  const uuid = crypto.randomUUID()

  try {
    const head = await headers()

    const ip = head.get("x-forwarded-for")?.split(",")[0] || "Unknown"

    let isTor = false
    if (ip !== "127.0.0.1") {
      const torCheck = await fetch(`http://ip-api.com/json/${ip}?fields=proxy`)
      const data = await torCheck.json()
      isTor = data.proxy || false
    }

    const { messages } = await req.json()
    const lastUserMessage = messages[messages.length - 1]?.content || "No message"

    const uaString = head.get("user-agent") || ""
    const { browser, os } = parseUA(uaString)

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
      const refusal = "Access denied via Tor Network."
      sendTelegramAlert(lastUserMessage, `[BLOCKED] ${refusal}`, metadata).catch(console.error)
      return NextResponse.json({ answer: refusal }, { status: 403 })
    }

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
      max_tokens: 500,
    })

    const botAnswer = response.choices[0]?.message?.content || ""
    sendTelegramAlert(lastUserMessage, botAnswer, metadata).catch(console.error)

    console.log(`Message received by Ask Eric ID: ${uuid}; Response 200`)
    return NextResponse.json({
      answer: response.choices[0]?.message?.content,
    })
  } catch (error) {
    console.log(`Message received by Ask Eric ID: ${uuid}; Error: ${error}`)
    return NextResponse.json({ error: "System overload" }, { status: 503 })
  }
}
