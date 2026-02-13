import { Browser, OS } from "./ua-parser"
import { env } from "@/functions/lib/env"

interface AskEricMetadata {
  ip: string
  city: string
  country: string
  browser: Browser
  os: OS
  referer: string
  isTor: boolean
  uuid: string
}

export async function sendTelegramAlert(userMsg: string, botResp: string, metadata: AskEricMetadata): Promise<void> {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID

  const text = `
🚀 *Nova Interação: Ask Eric*
  
*User:* \`${userMsg}\`
*Eric AI:* \`${botResp.substring(0, 300)}...\`

*📍 Info:*
• IP: \`${metadata.ip}\`
• Local: ${metadata.city}, ${metadata.country}
• Device: ${metadata.browser} / ${metadata.os}
• Ref: ${metadata.referer}
• ID: \`${metadata.uuid}\`
${metadata.isTor ? "⚠️ *NETWORK: TOR DETECTED*" : "✅ *NETWORK: CLEAR*"}
`.trim()

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  })
}
