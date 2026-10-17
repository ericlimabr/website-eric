"use client"

import { useState } from "react"
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/constants/contact-data"

export default function UnsubscribeForm({ codigo }: { codigo: string }) {
  const [estado, setEstado] = useState<"parado" | "enviando" | "feito">("parado")
  const [falha, setFalha] = useState<string | null>(null)

  const sair = async () => {
    setFalha(null)
    setEstado("enviando")
    try {
      const resposta = await fetch(`/api/descadastro?c=${encodeURIComponent(codigo)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      })
      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}))
        setFalha(corpo.erro || "Não consegui registrar agora. Tente de novo em instantes.")
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
          Não vou mais escrever para esse endereço. Se chegar alguma mensagem minha depois de hoje, responda
          com a palavra SAIR que eu confiro na mão.
        </p>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={sair}
        disabled={estado === "enviando"}
        className="rounded bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
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
    </div>
  )
}
