"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home, Terminal } from "lucide-react"

export default function ErrorPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [glitchText, setGlitchText] = useState("SYSTEM_FAILURE")
  const [logLines, setLogLines] = useState<string[]>([])

  const errorLogs = [
    "[ERR] process.exit(1) — unhandled exception",
    "[WARN] stack overflow in render pipeline",
    "[ERR] memory allocation failed at 0x7FF3A",
    "[FATAL] segmentation fault: core dumped",
    "[ERR] cannot read property 'undefined' of null",
    "[WARN] maximum call stack size exceeded",
    "[ERR] ECONNREFUSED — connection refused",
    "[FATAL] kernel panic — not syncing",
  ]

  // Glitch text effect
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    const original = "SYSTEM_FAILURE"
    let interval: ReturnType<typeof setInterval>

    const glitch = () => {
      let iterations = 0
      interval = setInterval(() => {
        setGlitchText(
          original
            .split("")
            .map((char, i) => {
              if (i < iterations) return original[i]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        )
        iterations += 1 / 2
        if (iterations >= original.length) {
          clearInterval(interval)
          setGlitchText(original)
        }
      }, 40)
    }

    glitch()
    const loopInterval = setInterval(glitch, 4000)
    return () => {
      clearInterval(interval)
      clearInterval(loopInterval)
    }
  }, [])

  // Terminal log feed
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setLogLines((prev) => {
        const next = [...prev, errorLogs[i % errorLogs.length]]
        return next.slice(-6)
      })
      i++
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsl(var(--foreground) / 0.1) 2px,
            hsl(var(--foreground) / 0.1) 4px
          )`,
        }}
      />

      {/* Red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, hsl(var(--destructive) / 0.06) 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
        {/* Error code */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-destructive/30 bg-destructive/5 mb-6">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="font-mono text-xs text-destructive tracking-wider uppercase">critical error</span>
          </div>

          <h1 className="font-mono text-7xl sm:text-8xl font-bold text-foreground tracking-tighter mb-4">
            <span className="text-destructive">5</span>00
          </h1>

          <p
            className="font-mono text-lg sm:text-xl text-destructive/80 tracking-widest uppercase"
            aria-label="System Failure"
          >
            {glitchText}
          </p>
        </div>

        {/* Terminal log */}
        <div className="border border-border bg-card/60 backdrop-blur-sm p-4 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">error.log — live feed</span>
          </div>
          <div className="space-y-1 min-h-36">
            {logLines.map((line, i) => (
              <p
                key={`${i}-${line}`}
                className={`font-mono text-xs transition-opacity duration-300 ${
                  line.includes("[FATAL]")
                    ? "text-destructive"
                    : line.includes("[ERR]")
                      ? "text-destructive/70"
                      : "text-muted-foreground"
                }`}
              >
                <span className="text-muted-foreground/50 mr-2">{String(i + 1).padStart(2, "0")}</span>
                {line}
              </p>
            ))}
            <span className="inline-block w-2 h-4 bg-destructive/70 animate-blink" />
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Something unexpected happened. The system encountered a critical error. Try reloading or return to the
          beginning.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 font-mono text-sm text-foreground"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            reload()
          </button>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-5 py-2.5 border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all duration-300 font-mono text-sm text-primary"
          >
            <Home className="w-4 h-4" />
            home()
          </Link>
        </div>

        {/* Error ref */}
        <p className="font-mono text-xs text-muted-foreground/40 mt-12">
          ref: ERR_{Math.random().toString(36).substring(2, 10).toUpperCase()} — {new Date().toISOString()}
        </p>
      </div>
    </div>
  )
}
