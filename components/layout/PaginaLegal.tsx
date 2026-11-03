import Link from "next/link"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"

/**
 * O invólucro das duas páginas legais, /termos e /privacidade.
 *
 * Existe para que as duas sejam a MESMA página em tudo que não é o texto: o
 * mesmo cabeçalho, a mesma navegação entre uma e outra, o mesmo rodapé com a
 * identificação de quem responde pelos dados. É o arranjo das páginas legais da
 * Vector Leads, trazido para os tokens e a tipografia deste site em vez de
 * trazer a paleta de lá.
 *
 * Não pendura nada do layout do site (chat, voltar ao topo, banner): isso mora
 * no layout raiz e continua valendo aqui.
 */
export default function PaginaLegal({
  titulo,
  atualizacao,
  rotulo,
  children,
}: {
  titulo: string
  atualizacao: string
  rotulo: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/sites" className="font-mono text-sm tracking-[0.2em] text-primary">
            ERIC LIMA
          </Link>
          <nav className="flex gap-5 font-mono text-xs">
            <Link
              href="/privacidade"
              className={
                rotulo === "privacidade"
                  ? "text-foreground"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              privacidade
            </Link>
            <Link
              href="/termos"
              className={
                rotulo === "termos"
                  ? "text-foreground"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              termos
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">{titulo}</h1>
          <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.11em] text-muted-foreground">
            Última atualização: {atualizacao}
          </p>

          <div className="legal mt-12">{children}</div>

          <div className="mt-16 border-t border-border pt-10">
            <p className="font-mono text-sm text-primary">// contato</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Para qualquer coisa desta página, inclusive pedido de cópia, correção ou apagamento dos seus
              dados, escreva para{" "}
              <a href={CONTACT_MAILTO} className="text-primary underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              . Respondo em até 15 dias.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            Eric Lima · CNPJ 52.492.085/0001-76 · Brasília, DF
          </p>
          <Link
            href="/sites"
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ericlima.com.br
          </Link>
        </div>
      </footer>
    </main>
  )
}
