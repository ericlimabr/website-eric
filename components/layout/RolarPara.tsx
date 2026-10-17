"use client"

import { rolarPara } from "./SmoothScrollProvider"

/**
 * Botão que leva a uma seção da própria página com rolagem suave.
 * Substitui o link de âncora para que o endereço não ganhe `#secao`.
 */
export default function RolarPara({
  alvo,
  className,
  children,
}: {
  alvo: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" className={className} onClick={() => rolarPara(alvo)}>
      {children}
    </button>
  )
}
