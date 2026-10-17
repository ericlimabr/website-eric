import type { Metadata } from "next"
import Link from "next/link"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"
import UnsubscribeForm from "@/components/feature/UnsubscribeForm"

/* Página pública, mas fora de busca: ela existe para quem recebeu o link, não
   para o Google. */
export const metadata: Metadata = {
  title: "Sair da lista de e-mails | Eric Lima",
  description: "Peça para não receber mais e-mails meus.",
  robots: { index: false, follow: false },
}

const FORMATO = /^[A-Za-z0-9_-]{8,64}$/

export default async function Descadastro({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  const { c } = await searchParams
  const codigo = typeof c === "string" ? c.trim() : ""
  const valido = FORMATO.test(codigo)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/sites" className="font-mono text-sm tracking-[0.2em] text-primary">
            ERIC LIMA
          </Link>
          <span className="font-mono text-xs text-muted-foreground">descadastro</span>
        </div>
      </header>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-sm text-primary">// sair da lista</p>
          <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
            Não quer mais receber e-mail meu?
          </h1>

          {valido ? (
            <>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Um clique no botão abaixo e o seu endereço sai da minha lista. Não precisa de senha, não precisa
                dizer o motivo e não vou pedir confirmação por e-mail.
              </p>

              <div className="mt-10">
                <UnsubscribeForm codigo={codigo} />
              </div>
            </>
          ) : (
            <>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                O link que você abriu está sem o código que identifica o envio, então eu não sei qual endereço
                tirar. Responda ao meu e-mail com a palavra SAIR, ou escreva para{" "}
                <a href={CONTACT_MAILTO} className="text-primary underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
                , e eu tiro na mão no mesmo dia.
              </p>
            </>
          )}

          <div className="mt-16 border-t border-border pt-10">
            <p className="font-mono text-sm text-primary">// de onde veio o seu endereço</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Eu escrevo para empresas do Distrito Federal a partir do <b>cadastro público de CNPJ da Receita
              Federal</b>, onde o endereço de e-mail que a própria empresa declarou é aberto a qualquer pessoa.
              Não comprei lista, não peguei de rede social e não uso robô para achar endereço.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A mensagem é uma oferta de serviço de uma empresa para outra, enviada uma vez, com no máximo um
              segundo contato depois. Quem pede para sair não recebe de novo, e o seu endereço fica numa lista de
              bloqueio só para garantir isso.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Para pedir cópia, correção ou apagamento dos seus dados, escreva para{" "}
              <a href={CONTACT_MAILTO} className="text-primary underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            Eric Lima · CNPJ 52.492.085/0001-76 · Brasília, DF
          </p>
          <Link href="/sites" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            ericlima.com.br/sites
          </Link>
        </div>
      </footer>
    </main>
  )
}
