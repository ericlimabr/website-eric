import { NextResponse } from "next/server"
import { waitUntil } from "@vercel/functions"
import { Redis } from "@upstash/redis"
import { z } from "zod"
import { env } from "@/functions/lib/env"
import { validateObject } from "@/functions/lib/validation"
import { sendContactAlert, sendContactEmail, sendWhatsAppAlert, type ContactLead } from "@/functions/lib/notifications"

const redis = new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })

const LIMITE_POR_HORA = 3
const GUARDA_POR_DIAS = 365

const ContatoSchema = z.object({
  nome: z.string().trim().min(2, "Diga o seu nome").max(120),
  empresa: z.string().trim().min(2, "Diga o nome da empresa").max(140),
  email: z.string().trim().email("Esse e-mail não parece válido").max(160),
  telefone: z.string().trim().max(40).optional().default(""),
  temSite: z.enum(["nao-tem", "tem-ruim", "saiu-do-ar"], { message: "Escolha uma das três" }),
  mensagem: z.string().trim().min(10, "Escreva um pouco mais").max(4000),
  // Campo armadilha: fica escondido, então só robô preenche. A validação aceita
  // o conteúdo de propósito, para a recusa acontecer depois e parecer sucesso.
  site: z.string().max(400).optional().default(""),
})

function ipDoPedido(req: Request): string {
  const encaminhado = req.headers.get("x-forwarded-for")
  return encaminhado?.split(",")[0].trim() || req.headers.get("x-real-ip") || "desconhecido"
}

export async function POST(req: Request) {
  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return NextResponse.json({ erro: "Pedido inválido." }, { status: 400 })
  }

  const { success, data, error } = validateObject(ContatoSchema, corpo)
  if (!success || !data) {
    return NextResponse.json({ erro: "Confira os campos.", campos: error }, { status: 400 })
  }

  // Robô recebe a mesma resposta de sucesso e vai embora achando que funcionou.
  if (data.site) return NextResponse.json({ ok: true })

  const ip = ipDoPedido(req)
  try {
    const chave = `contato:limite:${ip}`
    const envios = await redis.incr(chave)
    if (envios === 1) await redis.expire(chave, 3600)
    if (envios > LIMITE_POR_HORA) {
      return NextResponse.json(
        { erro: "Você já mandou algumas mensagens agora há pouco. Tente de novo mais tarde." },
        { status: 429 },
      )
    }
  } catch (e) {
    // Banco fora do ar não pode derrubar o envio: segue sem o limite.
    console.error("Limite por IP indisponível:", e)
  }

  const lead: ContactLead = {
    id: crypto.randomUUID(),
    nome: data.nome,
    empresa: data.empresa,
    email: data.email,
    telefone: data.telefone,
    temSite: data.temSite,
    mensagem: data.mensagem,
    recebidoEm: new Date().toISOString(),
  }

  // Tenta gravar primeiro, mas banco fora do ar não pode engolir um cliente:
  // se a gravação falhar, o aviso ainda leva a mensagem inteira.
  let gravado = true
  try {
    await redis.set(`contato:${lead.id}`, { ...lead, ip }, { ex: 60 * 60 * 24 * GUARDA_POR_DIAS })
    await redis.lpush("contato:lista", lead.id)
  } catch (e) {
    gravado = false
    console.error(`Contato ${lead.id} NÃO foi gravado no banco:`, e)
  }

  // O aviso é esperado quando nada foi gravado: aí ele é o único registro que
  // existe, e responder "enviado" sem ele seria mentira para quem escreveu.
  const avisar = sendContactAlert(lead, { gravado })
  if (!gravado) {
    try {
      await avisar
    } catch (e) {
      console.error(`Contato ${lead.id} perdido: banco e Telegram falharam.`, e)
      return NextResponse.json(
        { erro: "Não consegui registrar agora. Tente de novo em instantes." },
        { status: 503 },
      )
    }
  } else {
    waitUntil(avisar.catch((e) => console.error("Aviso por Telegram falhou:", e)))
  }

  waitUntil(
    sendContactEmail(lead)
      .then((r) => r === "sem-configuracao" && console.warn(`Contato ${lead.id} sem envio de e-mail: falta configuração.`))
      .catch((e) => console.error("Envio por e-mail falhou:", e)),
  )

  waitUntil(
    sendWhatsAppAlert(lead)
      .then((r) => r === "sem-configuracao" && console.warn(`Contato ${lead.id} sem aviso no WhatsApp: falta configuração.`))
      .catch((e) => console.error("Aviso por WhatsApp falhou:", e)),
  )

  return NextResponse.json({ ok: true })
}
