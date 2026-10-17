"use client"

import Lenis from "lenis"
import { useEffect } from "react"

let instancia: Lenis | null = null

/**
 * Rola até o alvo sem escrever hash na barra de endereço.
 * Usa o Lenis quando ele está de pé; cai no scroll nativo se não estiver,
 * e vai direto quando o sistema pede menos movimento.
 */
export function rolarPara(alvo: string) {
  const destino = document.querySelector(alvo)
  if (!destino) return

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const margem = parseFloat(getComputedStyle(destino).scrollMarginTop) || 0

  if (instancia && !semMovimento) {
    // Alvo em pixel, não o elemento: assim a margem de rolagem entra uma vez só.
    const ate = destino.getBoundingClientRect().top + window.scrollY - margem
    instancia.scrollTo(ate, {
      duration: 1.6,
      // Começa e termina devagar. A curva da rolagem de roda não serve aqui,
      // porque um salto de milhares de pixels com partida rápida parece tranco.
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    })
    return
  }

  destino.scrollIntoView({ behavior: semMovimento ? "auto" : "smooth", block: "start" })
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    instancia = lenis

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      instancia = null
    }
  }, [])

  return <>{children}</>
}
