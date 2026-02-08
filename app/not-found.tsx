"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { SearchX, Terminal, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [glitchText, setGlitchText] = useState("PATH_UNDEFINED")
  const [logLines, setLogLines] = useState<string[]>([])

  const notFoundLogs = [
    "[WARN] GET /unknown-resource — 404 NOT FOUND",
    "[INFO] crawling directory... entry not found",
    "[DEBUG] stack.router: resolving path failed",
    "[INFO] metadata_fetch: resource_id is null",
    "[WARN] broken_link_detected: index invalid",
    "[DEBUG] internal_resolver: origin lost",
    "[INFO] system.check: route non-deterministic",
    "[WARN] methexis_link: resolution failed",
  ]

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    const original = "PATH_UNDEFINED"
    let interval: ReturnType<typeof setInterval>

    const glitch = () => {
      let iterations = 0
      interval = setInterval(() => {
        setGlitchText(
          original
            .split("")
            .map((_, i) => {
              if (i < iterations) return original[i]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )
        iterations += 1 / 3
        if (iterations >= original.length) clearInterval(interval)
      }, 30)
    }

    glitch()
    const loopInterval = setInterval(glitch, 5000)
    return () => {
      clearInterval(interval)
      clearInterval(loopInterval)
    }
  }, [])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setLogLines((prev) => {
        const next = [...prev, notFoundLogs[i % notFoundLogs.length]]
        return next.slice(-6)
      })
      i++
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center selection:bg-primary/30"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 mb-8 rounded-sm">
            <SearchX className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase">Route de-indexed</span>
          </div>

          <h1 className="font-mono text-8xl sm:text-9xl font-bold text-foreground tracking-tighter mb-4 opacity-90">
            4<span className="text-primary animate-pulse">0</span>4
          </h1>

          <p className="font-mono text-lg sm:text-xl text-primary/70 tracking-[0.3em] uppercase h-8">{glitchText}</p>
        </div>

        <div className="border border-border bg-card/40 backdrop-blur-md p-5 mb-10 text-left shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                router_logs.bin
              </span>
            </div>
          </div>

          <div className="space-y-1.5 min-h-35">
            {logLines.map((line, i) => (
              <p key={`${i}-${line}`} className="font-mono text-[11px] leading-relaxed">
                <span className="text-muted-foreground/30 mr-3 select-none">{String(i + 1).padStart(2, "0")}</span>
                <span className={line.includes("[WARN]") ? "text-primary/80" : "text-muted-foreground/70"}>{line}</span>
              </p>
            ))}
            <span className="inline-block w-2 h-4 bg-primary/50 animate-blink align-middle ml-1" />
          </div>
        </div>

        <p className="text-muted-foreground font-sans text-sm mb-10 max-w-xs mx-auto leading-relaxed">
          The requested pointer does not exist in the current architectural scope.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-border bg-transparent hover:border-primary/40 transition-all duration-300 font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            go_back()
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-mono text-xs uppercase tracking-widest font-bold"
          >
            <Home className="w-3.5 h-3.5" />
            return_home()
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-border/20">
          <p className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-[0.2em]">
            Node: BR-BSB-01 // Hash: {Math.random().toString(16).slice(2, 10)}
          </p>
        </div>
      </div>
    </div>
  )
}
