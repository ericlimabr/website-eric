import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"
import ContactForm from "@/components/feature/ContactForm"


export const metadata: Metadata = {
  title: "Sites para empresas de Brasília | Eric Lima",
  description:
    "Site sob medida para empresa do Distrito Federal. Projeto, texto, fotos e publicação. Você recebe o site no ar, não um arquivo.",
  alternates: { canonical: "https://ericlima.com.br/sites" },
  openGraph: {
    title: "Sites para empresas de Brasília",
    description: "Site sob medida, feito à mão, rápido no celular e publicado no seu domínio.",
    url: "https://ericlima.com.br/sites",
    siteName: "Eric Lima",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://ericlima.com.br/og-sites.jpg", width: 1200, height: 630, alt: "Sites para empresas de Brasília" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sites para empresas de Brasília",
    description: "Site sob medida, feito à mão, rápido no celular e publicado no seu domínio.",
    images: ["https://ericlima.com.br/og-sites.jpg"],
  },
}

const ENTREGA = [
  {
    n: "01",
    titulo: "Site próprio, no seu domínio",
    texto:
      "Não é perfil de rede social nem página dentro do site de outra empresa. É o endereço da sua empresa, que você controla e ninguém desliga.",
  },
  {
    n: "02",
    titulo: "Feito à mão, não é tema pronto",
    texto:
      "Cada seção é desenhada para o que a sua empresa faz. Nada de modelo comprado com o nome trocado, que o seu concorrente também usa.",
  },
  {
    n: "03",
    titulo: "Rápido no celular",
    texto:
      "É no telefone que o seu cliente abre o link. A página é medida nessa tela, com peso controlado, para abrir no 4G sem travar.",
  },
  {
    n: "04",
    titulo: "Texto e fotos resolvidos",
    texto:
      "Escrevo o conteúdo junto com você e trato as imagens. Você não precisa entregar texto pronto nem contratar fotógrafo para começar.",
  },
]

const TRABALHOS = [
  {
    src: "/images/sites/vector.webp",
    nome: "Vector Leads",
    tipo: "No ar",
    texto: "Produto próprio. Qualificação de lead por conversa, com página de preços, resultados e blog.",
    href: "https://vectorleads.com.br" as string | null,
  },
  {
    src: "/images/sites/irb.webp",
    nome: "Igreja Reformada de Brasília",
    tipo: "No ar",
    texto: "Site institucional: quem é a igreja, o que ela crê, galeria e como chegar até lá.",
    href: "https://irbrasilia.org" as string | null,
  },
  {
    src: "/images/sites/isaias.webp",
    nome: "Rev. Dr. Isaías Lobão",
    tipo: "No ar",
    texto: "Site pessoal com livros, artigos, sermões e agenda de palestras.",
    href: "https://isaiaslobao.com.br" as string | null,
  },
  {
    src: "/images/sites/pathway.webp",
    nome: "Pathway",
    tipo: "Entregue",
    texto:
      "Consultoria de operações. Método, engajamento e um agendamento que funciona como conversa, uma pergunta por tela.",
    href: null as string | null,
  },
  {
    src: "/images/sites/aresta.webp",
    nome: "Aresta",
    tipo: "Projeto autoral",
    texto: "Lançamento imobiliário. Rolagem em capítulos, com a fachada abrindo em recorte.",
    href: null as string | null,
  },
]

const PASSOS = [
  { n: "01", titulo: "Conversa", texto: "Vinte minutos para eu entender o que a empresa faz e quem precisa achar você." },
  { n: "02", titulo: "Proposta", texto: "Escopo, prazo e preço por escrito, antes de qualquer pagamento." },
  { n: "03", titulo: "Construção", texto: "Você acompanha em um endereço de teste e aprova seção por seção." },
  { n: "04", titulo: "No ar", texto: "Publicação no seu domínio, com e-mail do domínio funcionando e o site indexado." },
]

export default function Sites() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-mono text-sm tracking-[0.2em] text-primary">
            ERIC LIMA
          </Link>
          <Link href="/" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            portfólio técnico
          </Link>
        </div>
      </header>

      {/* Herói */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">~/sites · Brasília, DF</p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] md:text-6xl">
            O site que a sua empresa<br className="hidden md:block" /> ainda não tem.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Faço sites sob medida para empresas do Distrito Federal. Projeto, texto, fotos e publicação.
            No fim você recebe o site no ar, não um arquivo para alguém montar depois.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contato"
              className="rounded bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Falar comigo
            </a>
            <a
              href="#trabalhos"
              className="rounded border border-border px-7 py-4 font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Ver trabalhos
            </a>
          </div>
        </div>
      </section>

      {/* O mercado, medido */}
      <section className="border-y border-border bg-[hsl(var(--surface))] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">// o mercado daqui, medido</p>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold md:text-3xl">
            Quem procura a sua empresa hoje encontra o quê?
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <p className="font-mono text-5xl text-primary md:text-6xl">3.424</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                empresas do setor imobiliário do DF que eu levantei no cadastro público da Receita Federal e
                conferi uma a uma para saber quais realmente têm site no ar.
              </p>
            </div>
            <div>
              <p className="font-mono text-5xl text-primary md:text-6xl">163</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                delas têm um domínio registrado que não abre mais. O cliente digita o endereço do cartão,
                não acontece nada, e a empresa nem sabe disso.
              </p>
            </div>
          </div>
          <p className="mt-12 max-w-3xl leading-relaxed text-muted-foreground">
            Eu não cheguei aqui por achismo. Estudei o mercado do Distrito Federal antes de escrever uma linha de
            código, e é desse estudo que sai a decisão de cada seção do seu site.
          </p>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">// o que você recebe</p>
          <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {ENTREGA.map((item) => (
              <div key={item.n}>
                <p className="font-mono text-sm text-primary">{item.n}</p>
                <h3 className="mt-3 text-xl font-bold">{item.titulo}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trabalhos */}
      <section id="trabalhos" className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">// trabalhos</p>
          <h2 className="mt-4 text-2xl font-bold md:text-3xl">Como o resultado se parece</h2>
          <div className="mt-12 flex flex-col gap-16">
            {TRABALHOS.map((t) => (
              <figure key={t.nome}>
                <div className="overflow-hidden rounded border border-border">
                  <Image
                    src={t.src}
                    alt={`Primeira tela do site ${t.nome}`}
                    width={1920}
                    height={1200}
                    className="h-auto w-full"
                    sizes="(max-width: 768px) 100vw, 960px"
                    quality={88}
                  />
                </div>
                <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">{t.tipo}</span>
                  <span className="text-lg font-bold">{t.nome}</span>
                  {t.href && (
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
                    >
                      visitar
                    </a>
                  )}
                </figcaption>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">{t.texto}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-t border-border bg-[hsl(var(--surface))] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">// como funciona</p>
          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {PASSOS.map((p) => (
              <div key={p.n} className="border-t border-border pt-5">
                <p className="font-mono text-sm text-primary">{p.n}</p>
                <h3 className="mt-2 font-bold">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quem faz */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">// quem faz</p>
          <h2 className="mt-4 text-2xl font-bold md:text-3xl">Eric Lima</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
            Sou engenheiro de software e moro em Brasília. Trabalho com Go, Python e arquitetura de sistemas,
            e é essa mesma régua que eu aplico num site de empresa: medir antes de opinar, controlar o peso da
            página e entregar coisa que funciona no telefone de quem vai comprar de você.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            Quem quiser ver o lado técnico encontra no{" "}
            <Link href="/" className="text-primary underline underline-offset-4">
              portfólio
            </Link>
            : projetos, infraestrutura e o que eu uso no dia a dia.
          </p>
        </div>
      </section>

      {/* Chamada final */}
      <section id="contato" className="scroll-mt-10 border-t border-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-sm text-primary">// falar comigo</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
            Conte o que a sua empresa faz e eu digo o que o seu site precisa ter.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Sem compromisso e sem proposta na primeira conversa. Se não fizer sentido para a sua empresa agora, eu
            digo isso na resposta.
          </p>

          <div className="mt-12">
            <ContactForm />
          </div>

          <p className="mt-10 font-mono text-sm text-muted-foreground">
            Prefere escrever do seu jeito?{" "}
            <a href={CONTACT_MAILTO} className="text-primary underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">Eric Lima · Brasília, DF</p>
          <Link href="/" className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            ericlima.com.br
          </Link>
        </div>
      </footer>
    </main>
  )
}
