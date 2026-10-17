import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { env } from "@/functions/lib/env"
import { sendUnsubscribeAlert, type PedidoDeSaida } from "@/functions/lib/notifications"
import { decifrarEndereco } from "@/functions/lib/descadastro"

const redis = new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })

/* O código que viaja no link. Ele é opaco de propósito: não carrega e-mail,
   nome nem nada que identifique quem recebeu. O cruzamento entre código e
   destinatário fica na máquina de casa, nunca aqui. */
const FORMATO = /^[A-Za-z0-9_-]{8,64}$/

/* Quando o link chega sem código, a pessoa digita o próprio endereço e a saída
   acontece do mesmo jeito. Não dá para exigir que ela escreva um e-mail pedindo
   para sair: a saída é obrigação minha, não tarefa dela. */
const ENDERECO = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/

async function pedidoDaRequisicao(url: string, corpo: unknown): Promise<PedidoDeSaida | null> {
  const query = new URL(url).searchParams
  const campo = (nome: string): string => {
    const daQuery = query.get(nome)?.trim()
    if (daQuery) return daQuery
    if (corpo && typeof corpo === "object" && nome in corpo) {
      const v = (corpo as Record<string, unknown>)[nome]
      if (typeof v === "string") return v.trim()
    }
    return ""
  }

  const codigo = campo("c") || campo("codigo")
  if (FORMATO.test(codigo)) return { codigo }

  // O endereço cifrado do link. Só abre com a chave do servidor, e link
  // adulterado é recusado pelo próprio selo da cifra.
  const token = campo("t") || campo("token")
  if (token) {
    const doLink = await decifrarEndereco(token)
    if (doLink) return { email: doLink }
  }

  const email = campo("email").toLowerCase()
  if (email.length <= 254 && ENDERECO.test(email)) return { email }

  return null
}

/* Aceita o botão da página (JSON), o endereço digitado e o "cancelar inscrição"
   do próprio Gmail, que manda um formulário com List-Unsubscribe=One-Click e
   nenhum corpo útil. Nos três casos o que importa vem na URL ou no corpo. */
export async function POST(req: Request) {
  let corpo: unknown = null
  if (req.headers.get("content-type")?.includes("application/json")) {
    corpo = await req.json().catch(() => null)
  }

  const pedido = await pedidoDaRequisicao(req.url, corpo)
  if (!pedido) {
    return NextResponse.json({ erro: "Confira o endereço de e-mail e tente de novo." }, { status: 400 })
  }

  // Tenta gravar, mas banco fora do ar não pode impedir alguém de sair da
  // lista: se a gravação falhar, os avisos passam a ser o registro.
  const chave = pedido.codigo ? `descadastro:${pedido.codigo}` : `descadastro:email:${pedido.email}`
  const lista = pedido.codigo ? "descadastro:lista" : "descadastro:enderecos"
  let gravado = true
  try {
    await redis.set(chave, { ...pedido, pedidoEm: new Date().toISOString() })
    await redis.lpush(lista, pedido.codigo || pedido.email)
  } catch (e) {
    gravado = false
    console.error(`Descadastro ${chave} NÃO foi gravado no banco:`, e)
  }

  const avisos = await sendUnsubscribeAlert(pedido, { gravado })

  // Gravado no banco, os avisos são dispensáveis. Sem banco e sem nenhum dos
  // três avisos, o pedido se perderia em silêncio, e aí é melhor dizer que não
  // deu e pedir outro clique, em vez de mandar a pessoa escrever um e-mail.
  if (!gravado && avisos === 0) {
    return NextResponse.json(
      { erro: "Deu problema aqui do meu lado e o pedido não ficou registrado. Clique de novo, por favor." },
      { status: 503 },
    )
  }

  return NextResponse.json({ ok: true })
}
