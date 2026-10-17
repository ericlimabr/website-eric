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

/* O mesmo aviso no WhatsApp, pelo CallMeBot. Ele leva só o registro: o nome, o
   e-mail e a mensagem de quem escreveu ficam no Telegram e no e-mail, que são
   os canais do conteúdo. */
export async function sendWhatsAppAlert(lead: ContactLead): Promise<"enviado" | "sem-configuracao"> {
  const { WHATSAPP_ALERT_PHONE, WHATSAPP_ALERT_APIKEY } = env
  if (!WHATSAPP_ALERT_PHONE || !WHATSAPP_ALERT_APIKEY) return "sem-configuracao"

  const texto = `Novo contato pelo site. Os dados estão no Telegram e no e-mail. Registro ${lead.id}`
  const url = new URL("https://api.callmebot.com/whatsapp.php")
  url.searchParams.set("phone", WHATSAPP_ALERT_PHONE)
  url.searchParams.set("apikey", WHATSAPP_ALERT_APIKEY)
  url.searchParams.set("text", texto)

  const resposta = await fetch(url, { method: "GET" })
  if (!resposta.ok) throw new Error(`CallMeBot respondeu ${resposta.status}`)
  return "enviado"
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

/* O aviso de descadastro. Ele leva só o código opaco que veio no link: quem é
   aquele código não está no servidor, o cruzamento com o destinatário mora na
   máquina de casa. Sem parse_mode de propósito, porque código com _ ou - quebra
   a formatação do Telegram e o aviso não pode falhar por causa de um caractere. */
export async function sendUnsubscribeAlert(codigo: string, estado?: { gravado: boolean }): Promise<void> {
  const linhas = [
    "🚫 Pedido de descadastro",
    ...(estado && !estado.gravado ? ["ATENÇÃO: não ficou gravado no banco. Este aviso é o único registro."] : []),
    "",
    `Código: ${codigo}`,
    `Pedido em: ${new Date().toISOString()}`,
    "",
    "Tirar da lista antes do próximo disparo.",
  ]

  const resposta = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: linhas.join("\n") }),
  })

  if (!resposta.ok) throw new Error(`Telegram respondeu ${resposta.status}`)
}
