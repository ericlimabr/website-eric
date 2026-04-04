"use client"

import { useState } from "react"
import type { SecurityData, SecurityFinding } from "@/website-dashboard/types"

const SEV: Record<string, { label: string; text: string; bg: string }> = {
  critical: { label: "Critical", text: "text-red-400",    bg: "bg-red-400/10"    },
  high:     { label: "High",     text: "text-orange-400", bg: "bg-orange-400/10" },
  medium:   { label: "Medium",   text: "text-amber-400",  bg: "bg-amber-400/10"  },
  low:      { label: "Low",      text: "text-emerald-400",bg: "bg-emerald-400/10"},
}

function SeverityBadge({ sev }: { sev: SecurityFinding["severity"] }) {
  const s = SEV[sev]
  return (
    <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide whitespace-nowrap ${s.text} ${s.bg}`}>
      {s.label}
    </span>
  )
}

export default function SecurityReport({ security }: { security: SecurityData }) {
  const [showAll, setShowAll] = useState(false)
  const [showPositive, setShowPositive] = useState(false)

  const allFindings = security.audits.flatMap((a) => a.findings)
  const displayed   = showAll ? allFindings : allFindings.slice(0, 6)
  const allClear    = security.totalOpen === 0

  return (
    <section>
      <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">// security audit</p>

      <div className="bg-secondary border border-border rounded-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0
              ${allClear ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
              {allClear ? "✓" : "⚠"}
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground">
                <span className="text-emerald-400">{security.totalFixed}</span>
                <span className="text-muted-foreground/30 text-2xl mx-2">/</span>
                <span className="text-muted-foreground">{security.totalFound}</span>
                <span className="text-lg font-normal text-muted-foreground ml-2">fixed</span>
              </p>
              {allClear && security.totalFound > 0 && (
                <p className="font-mono text-sm text-emerald-400 mt-1">All vulnerabilities resolved.</p>
              )}
              {allClear && security.totalFound === 0 && (
                <p className="font-mono text-sm text-emerald-400 mt-1">No vulnerabilities found.</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-muted-foreground">Open</p>
            <p className={`text-5xl font-bold ${allClear ? "text-emerald-400" : "text-red-400"}`}>
              {security.totalOpen}
            </p>
          </div>
        </div>

        {/* Severity breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">
          {(["critical", "high", "medium", "low"] as const).map((sev) => {
            const counts = security.bySeverity[sev]
            const s = SEV[sev]
            return (
              <div key={sev} className="px-5 py-5">
                <div className="flex justify-between items-center mb-3">
                  <span className={`font-mono text-xs font-semibold uppercase tracking-wide ${s.text}`}>{s.label}</span>
                  <span className={`font-mono text-xs px-2 py-0.5 rounded-sm
                    ${counts.open > 0 ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10"}`}>
                    {counts.open === 0 ? "OK" : `${counts.open} open`}
                  </span>
                </div>
                <p className={`text-5xl font-bold ${s.text}`}>{counts.found}</p>
                <p className="font-mono text-sm text-muted-foreground mt-1">{counts.fixed} fixed</p>
              </div>
            )
          })}
        </div>

        {/* Audit scope */}
        {security.audits[0] && (
          <div className="px-6 py-3 border-t border-border/50 bg-muted/30">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-foreground/80">{security.audits[0].name}</span>
              {" · "}{security.audits[0].date}
              {" · "}<span className="italic">{security.audits[0].scope}</span>
            </p>
          </div>
        )}

        {/* Findings */}
        {allFindings.length > 0 && (
          <div className="px-6 py-5 border-t border-border/50">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Findings ({allFindings.length})
              </p>
              <button
                onClick={() => setShowAll(!showAll)}
                className="font-mono text-xs text-primary hover:text-primary/70 transition-colors"
              >
                {showAll ? "Show less ▲" : `Show all ${allFindings.length} ▼`}
              </button>
            </div>
            <div className="space-y-2">
              {displayed.map((f) => (
                <div key={f.id} className="flex items-start gap-3 py-2.5 px-3 rounded-sm bg-muted/50 border border-border/50">
                  <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5 w-8">{f.id}</span>
                  <SeverityBadge sev={f.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-foreground/80">{f.title}</p>
                    {f.file && <p className="font-mono text-sm text-muted-foreground mt-0.5 truncate">{f.file}</p>}
                  </div>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm shrink-0">
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positive findings */}
        {security.positiveFindings?.length > 0 && (
          <div className="border-t border-border/50">
            <button
              onClick={() => setShowPositive(!showPositive)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
            >
              <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
                Positive findings ({security.positiveFindings.length})
              </p>
              <span className="font-mono text-xs text-muted-foreground">{showPositive ? "▲" : "▼"}</span>
            </button>
            {showPositive && (
              <div className="px-6 pb-5 space-y-3">
                {security.positiveFindings.map((pf, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-emerald-400 text-sm shrink-0 mt-0.5">✓</span>
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">{pf}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
