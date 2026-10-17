"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CONTACT_EMAIL } from "@/constants/contact-data"

const Schema = z.object({
  nome: z.string().trim().min(2, "Diga o seu nome"),
  empresa: z.string().trim().min(2, "Diga o nome da empresa"),
  email: z.string().trim().email("Esse e-mail não parece válido"),
  telefone: z.string().trim().optional(),
  temSite: z.enum(["nao-tem", "tem-ruim", "saiu-do-ar"], { message: "Escolha uma das três" }),
  mensagem: z.string().trim().min(10, "Escreva um pouco mais"),
  site: z.string().optional(),
})

type Campos = z.infer<typeof Schema>

const SITUACOES: { valor: Campos["temSite"]; rotulo: string }[] = [
  { valor: "nao-tem", rotulo: "Não tem site" },
  { valor: "tem-ruim", rotulo: "Tem, mas está ruim" },
  { valor: "saiu-do-ar", rotulo: "Tinha e saiu do ar" },
]

const campo =
  "w-full rounded border border-border bg-[hsl(var(--surface))] px-4 py-3 text-foreground " +
  "placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
const rotulo = "mb-2 block font-mono text-xs text-primary"
const erro = "mt-2 block text-sm text-destructive"

export default function ContactForm() {
  const [enviado, setEnviado] = useState(false)
  const [falha, setFalha] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Campos>({ resolver: zodResolver(Schema) })

  const enviar = async (dados: Campos) => {
    setFalha(null)
    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}))
        setFalha(corpo.erro || "Não consegui enviar agora. Tente de novo em instantes.")
        return
      }
      setEnviado(true)
    } catch {
      setFalha("Não consegui enviar agora. Confira a conexão e tente de novo.")
    }
  }

  if (enviado) {
    return (
      <div className="rounded border border-primary/40 bg-[hsl(var(--surface))] p-8">
        <p className="font-mono text-sm text-primary">// recebido</p>
        <h3 className="mt-3 text-2xl font-bold">Chegou aqui.</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Respondo em até um dia útil, a partir de {CONTACT_EMAIL}. Se não encontrar a resposta, olhe no lixo
          eletrônico, porque e-mail de endereço novo às vezes cai lá na primeira vez.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="max-w-2xl">
      {/* Campo armadilha: invisível para gente, preenchido por robô. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="site">Não preencha este campo</label>
        <input id="site" type="text" tabIndex={-1} autoComplete="off" {...register("site")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className={rotulo}>
            01 · Nome
          </label>
          <input id="nome" className={campo} placeholder="Como você se chama" {...register("nome")} />
          {errors.nome && <span className={erro}>{errors.nome.message}</span>}
        </div>

        <div>
          <label htmlFor="empresa" className={rotulo}>
            02 · Empresa
          </label>
          <input id="empresa" className={campo} placeholder="O nome do seu negócio" {...register("empresa")} />
          {errors.empresa && <span className={erro}>{errors.empresa.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className={rotulo}>
            03 · E-mail
          </label>
          <input id="email" type="email" className={campo} placeholder="onde eu respondo" {...register("email")} />
          {errors.email && <span className={erro}>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="telefone" className={rotulo}>
            04 · Telefone <span className="text-muted-foreground">(opcional)</span>
          </label>
          <input id="telefone" type="tel" className={campo} placeholder="se preferir conversar" {...register("telefone")} />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className={rotulo}>05 · A sua empresa tem site hoje?</legend>
        <div className="flex flex-col gap-3 sm:flex-row">
          {SITUACOES.map((s) => (
            <label
              key={s.valor}
              className="flex flex-1 cursor-pointer items-center gap-3 rounded border border-border bg-[hsl(var(--surface))] px-4 py-3 transition-colors hover:border-primary/60 has-checked:border-primary"
            >
              <input type="radio" value={s.valor} className="accent-primary" {...register("temSite")} />
              <span className="text-sm">{s.rotulo}</span>
            </label>
          ))}
        </div>
        {errors.temSite && <span className={erro}>{errors.temSite.message}</span>}
      </fieldset>

      <div className="mt-6">
        <label htmlFor="mensagem" className={rotulo}>
          06 · O que a sua empresa faz, e o que você precisa
        </label>
        <textarea
          id="mensagem"
          rows={5}
          className={campo}
          placeholder="Exemplo: somos uma construtora em Taguatinga, temos quatro obras entregues e hoje só o Instagram. Quero um site que mostre as obras e receba contato."
          {...register("mensagem")}
        />
        {errors.mensagem && <span className={erro}>{errors.mensagem.message}</span>}
      </div>

      {falha && (
        <p role="alert" className="mt-6 rounded border border-destructive/50 px-4 py-3 text-sm text-destructive">
          {falha}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 rounded bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar"}
      </button>

      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        O que você escrever aqui serve só para eu responder ao seu contato. Não vai para lista de disparo e não é
        repassado para ninguém.
      </p>
    </form>
  )
}
