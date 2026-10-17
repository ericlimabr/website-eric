import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { env } from "@/functions/lib/env"
import { sendUnsubscribeAlert } from "@/functions/lib/notifications"

const redis = new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })

/* O código que viaja no link. Ele é opaco de propósito: não carrega e-mail,
   nome nem nada que identifique quem recebeu. O cruzamento entre código e
   destinatário fica na máquina de casa, nunca aqui. */
const FORMATO = /^[A-Za-z0-9_-]{8,64}$/

function codigoDoPedido(url: string, corpo: unknown): string {
  const daQuery = new URL(url).searchParams.get("c")?.trim()
  if (daQuery) return daQuery
  if (corpo && typeof corpo === "object" && "codigo" in corpo) {
    const c = (corpo as { codigo?: unknown }).codigo
    if (typeof c === "string") return c.trim()
  }
  return ""
}

/* Aceita o botão da página (JSON) e o "cancelar inscrição" do próprio Gmail,
   que manda um formulário com List-Unsubscribe=One-Click e nenhum corpo útil.
   Nos dois casos o que importa é o código, e ele vem na URL. */
export async function POST(req: Request) {
  let corpo: unknown = null
  if (req.headers.get("content-type")?.includes("application/json")) {
    corpo = await req.json().catch(() => null)
  }

  const codigo = codigoDoPedido(req.url, corpo)
  if (!FORMATO.test(codigo)) {
    return NextResponse.json({ erro: "Esse link não está completo." }, { status: 400 })
  }

  // Tenta gravar, mas banco fora do ar não pode impedir alguém de sair da
  // lista: se a gravação falhar, o aviso passa a ser o registro.
  let gravado = true
  try {
    await redis.set(`descadastro:${codigo}`, { codigo, pedidoEm: new Date().toISOString() })
    await redis.lpush("descadastro:lista", codigo)
  } catch (e) {
    gravado = false
    console.error(`Descadastro ${codigo} NÃO foi gravado no banco:`, e)
  }

  try {
    await sendUnsubscribeAlert(codigo, { gravado })
  } catch (e) {
    console.error(`Descadastro ${codigo}: aviso falhou.`, e)
    // Gravado no banco, o aviso é dispensável. Sem banco e sem aviso, o pedido
    // se perderia em silêncio, e aí é melhor dizer que não deu.
    if (!gravado) {
      return NextResponse.json(
        { erro: "Não consegui registrar agora. Responda ao e-mail com a palavra SAIR e eu tiro na mão." },
        { status: 503 },
      )
    }
  }

  return NextResponse.json({ ok: true })
}
