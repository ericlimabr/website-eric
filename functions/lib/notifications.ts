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
  const corpo = await resposta.text()
  if (/ERROR/i.test(corpo)) throw new Error(`CallMeBot recusou: ${corpo.slice(0, 120)}`)
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

/* O pedido de saída da lista. Ele chega de duas formas: o código opaco que viaja
   no link do e-mail, ou o endereço que a própria pessoa digitou na página quando
   o link perdeu o código. O código não identifica ninguém aqui dentro, o
   cruzamento com o destinatário mora na máquina de casa. */
export type PedidoDeSaida = { codigo?: string; email?: string }

function linhasDoPedido(pedido: PedidoDeSaida, gravado: boolean): string[] {
  return [
    "🚫 Pedido de descadastro",
    ...(gravado ? [] : ["ATENÇÃO: não ficou gravado no banco. Este aviso é o único registro."]),
    "",
    ...(pedido.codigo ? [`Código: ${pedido.codigo}`] : []),
    ...(pedido.email ? [`Endereço digitado: ${pedido.email}`] : []),
    `Pedido em: ${new Date().toISOString()}`,
    "",
    "Tirar da lista antes do próximo disparo.",
  ]
}

/* Sem parse_mode de propósito, porque código com _ ou - quebra a formatação do
   Telegram e o aviso não pode falhar por causa de um caractere. */
async function avisoNoTelegram(linhas: string[]): Promise<void> {
  const resposta = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: linhas.join("\n") }),
  })
  if (!resposta.ok) throw new Error(`Telegram respondeu ${resposta.status}`)
}

async function avisoNoWhatsApp(pedido: PedidoDeSaida): Promise<void> {
  const { WHATSAPP_ALERT_PHONE, WHATSAPP_ALERT_APIKEY } = env
  if (!WHATSAPP_ALERT_PHONE || !WHATSAPP_ALERT_APIKEY) throw new Error("WhatsApp sem configuração")

  const url = new URL("https://api.callmebot.com/whatsapp.php")
  url.searchParams.set("phone", WHATSAPP_ALERT_PHONE)
  url.searchParams.set("apikey", WHATSAPP_ALERT_APIKEY)
  url.searchParams.set("text", `Pedido de descadastro: ${pedido.codigo || pedido.email}. Tirar da lista.`)

  const resposta = await fetch(url, { method: "GET" })
  if (!resposta.ok) throw new Error(`CallMeBot respondeu ${resposta.status}`)
  // O CallMeBot responde 201 com a palavra ERROR no corpo quando não entrega.
  // Sem ler o corpo, um canal quebrado se passaria por canal entregue.
  const corpo = await resposta.text()
  if (/ERROR/i.test(corpo)) throw new Error(`CallMeBot recusou: ${corpo.slice(0, 120)}`)
}

async function avisoPorEmail(linhas: string[]): Promise<void> {
  const { RESEND_API_KEY, CONTACT_MAIL_FROM, CONTACT_MAIL_TO } = env
  if (!RESEND_API_KEY || !CONTACT_MAIL_FROM || !CONTACT_MAIL_TO) throw new Error("E-mail sem configuração")

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_MAIL_FROM,
      to: [CONTACT_MAIL_TO],
      subject: "Pedido de descadastro",
      text: linhas.join("\n"),
    }),
  })
  if (!resposta.ok) throw new Error(`Resend respondeu ${resposta.status}`)
}

/* Os três avisos saem juntos e o resultado é quantos chegaram. Um canal fora do
   ar não pode fazer alguém continuar recebendo e-mail meu, então o pedido só é
   recusado quando o banco E os três avisos falham no mesmo instante. */
export async function sendUnsubscribeAlert(
  pedido: PedidoDeSaida,
  estado?: { gravado: boolean },
): Promise<number> {
  const gravado = estado?.gravado !== false
  const linhas = linhasDoPedido(pedido, gravado)

  const resultados = await Promise.allSettled([
    avisoNoTelegram(linhas),
    avisoNoWhatsApp(pedido),
    avisoPorEmail(linhas),
  ])

  resultados.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Descadastro: aviso ${["Telegram", "WhatsApp", "e-mail"][i]} falhou.`, r.reason)
    }
  })

  return resultados.filter((r) => r.status === "fulfilled").length
}
