"use client"

import { useState } from "react"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"

/* Com código ou com o endereço no link, é um botão só. Sem nenhum dos dois, a
   pessoa digita o endereço dela e a saída é a mesma. Em nenhum dos casos ela
   precisa pedir nada a mim por escrito. */
export default function UnsubscribeForm({ codigo, token }: { codigo?: string; token?: string }) {
  const [estado, setEstado] = useState<"parado" | "enviando" | "feito">("parado")
  const [falha, setFalha] = useState<string | null>(null)
  const [digitado, setDigitado] = useState("")

  const porEmail = !codigo && !token

  const sair = async () => {
    if (porEmail && !digitado.includes("@")) {
      setFalha("Escreva o endereço de e-mail onde você recebeu a minha mensagem.")
      return
    }

    setFalha(null)
    setEstado("enviando")
    try {
      const corpo = codigo ? { codigo } : token ? { token } : { email: digitado }
      const resposta = await fetch("/api/descadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      })
      if (!resposta.ok) {
        const retorno = await resposta.json().catch(() => ({}))
        setFalha(retorno.erro || "Não consegui registrar agora. Tente de novo em instantes.")
        setEstado("parado")
        return
      }
      setEstado("feito")
    } catch {
      setFalha("Não consegui registrar agora. Confira a conexão e tente de novo.")
      setEstado("parado")
    }
  }

  if (estado === "feito") {
    return (
      <div className="rounded border border-primary/40 bg-[hsl(var(--surface))] p-8">
        <p className="font-mono text-sm text-primary">// pronto</p>
        <h2 className="mt-3 text-2xl font-bold">Você saiu da lista.</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Registrado agora. Não vou mais escrever para esse endereço, e ele fica numa lista de bloqueio só
          para garantir isso.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void sair()
      }}
    >
      {porEmail && (
        <label className="block max-w-md">
          <span className="font-mono text-sm text-primary">// seu endereço de e-mail</span>
          <input
            type="email"
            name="email"
            value={digitado}
            onChange={(e) => setDigitado(e.target.value)}
            required
            autoComplete="email"
            placeholder="contato@suaempresa.com.br"
            className="mt-3 w-full rounded border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className={`rounded bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 ${porEmail ? "mt-6" : ""}`}
      >
        {estado === "enviando" ? "Registrando..." : "Confirmar e sair da lista"}
      </button>

      {falha && (
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-destructive">
          {falha}{" "}
          <a href={CONTACT_MAILTO} className="underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </p>
      )}
    </form>
  )
}
