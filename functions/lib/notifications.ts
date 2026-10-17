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
  status: number
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
• Status: \`${metadata.status}\`
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

export interface ContactLead {
  id: string
  nome: string
  empresa: string
  email: string
  telefone: string
  temSite: "nao-tem" | "tem-ruim" | "saiu-do-ar"
  mensagem: string
  recebidoEm: string
}

const SITUACAO: Record<ContactLead["temSite"], string> = {
  "nao-tem": "Não tem site",
  "tem-ruim": "Tem site, mas está ruim",
  "saiu-do-ar": "Tinha site e saiu do ar",
}

/* O aviso que chega no telefone na hora. Não depende de caixa de e-mail,
   então funciona desde o primeiro envio. */
export async function sendContactAlert(lead: ContactLead, estado?: { gravado: boolean }): Promise<void> {
  const linhas = [
    "📬 *Novo contato pelo site*",
    ...(estado && !estado.gravado ? ["⚠️ *Não ficou gravado no banco. Este aviso é o único registro.*", ""] : []),
    "",
    `*Nome:* ${lead.nome}`,
    `*Empresa:* ${lead.empresa}`,
    `*E-mail:* ${lead.email}`,
    lead.telefone ? `*Telefone:* ${lead.telefone}` : "*Telefone:* não informou",
    `*Situação:* ${SITUACAO[lead.temSite]}`,
    "",
    lead.mensagem,
    "",
    `_${lead.id}_`,
  ]

  const resposta = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: linhas.join("\n"), parse_mode: "Markdown" }),
  })

  if (!resposta.ok) throw new Error(`Telegram respondeu ${resposta.status}`)
}

/* O mesmo contato por e-mail. Enquanto as três variáveis não existirem a
   função não tenta e diz que não tentou, em vez de falhar em silêncio. */
export async function sendContactEmail(lead: ContactLead): Promise<"enviado" | "sem-configuracao"> {
  const { RESEND_API_KEY, CONTACT_MAIL_FROM, CONTACT_MAIL_TO } = env
  if (!RESEND_API_KEY || !CONTACT_MAIL_FROM || !CONTACT_MAIL_TO) return "sem-configuracao"

  const corpo = [
    `Nome: ${lead.nome}`,
    `Empresa: ${lead.empresa}`,
    `E-mail: ${lead.email}`,
    `Telefone: ${lead.telefone || "não informou"}`,
    `Situação: ${SITUACAO[lead.temSite]}`,
    `Recebido em: ${lead.recebidoEm}`,
    "",
    lead.mensagem,
    "",
    `Registro: ${lead.id}`,
  ].join("\n")

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_MAIL_FROM,
      to: [CONTACT_MAIL_TO],
      reply_to: lead.email,
      subject: `Site: ${lead.empresa} (${lead.nome})`,
      text: corpo,
    }),
  })

  if (!resposta.ok) throw new Error(`Resend respondeu ${resposta.status}`)
  return "enviado"
}
