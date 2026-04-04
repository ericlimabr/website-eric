import type { Snapshot } from "@/website-dashboard/types"

const COLUMNS = [
  { key: "shipped"  as const, label: "Shipped",  icon: "▲", text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  { key: "fixed"    as const, label: "Fixed",    icon: "✓", text: "text-amber-400",  bg: "bg-amber-400/10",   border: "border-amber-400/20"   },
  { key: "started"  as const, label: "Started",  icon: "▶", text: "text-blue-400",   bg: "bg-blue-400/10",    border: "border-blue-400/20"    },
  { key: "blockers" as const, label: "Blockers", icon: "⚠", text: "text-red-400",    bg: "bg-red-400/10",     border: "border-red-400/20"     },
] as const

export default function WeekHighlights({ snapshot }: { snapshot: Snapshot }) {
  const { weekHighlights } = snapshot

  return (
    <section>
      <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">// week highlights</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {COLUMNS.map((col) => {
          const items = weekHighlights[col.key]
          return (
            <div key={col.key} className={`bg-secondary border rounded-sm p-5 ${col.border}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-sm ${col.text}`}>{col.icon}</span>
                <p className={`font-mono text-xs font-semibold uppercase tracking-wider ${col.text}`}>
                  {col.label}
                </p>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ml-auto ${col.text} ${col.bg}`}>
                  {items.length}
                </span>
              </div>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className={`w-1 h-1 rounded-full shrink-0 mt-2 ${col.bg}`} />
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
                {items.length === 0 && (
                  <p className="font-mono text-xs text-muted-foreground/40 italic">None this week</p>
                )}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Next week planned */}
      <div className="bg-secondary border border-border rounded-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary text-sm">→</span>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Next Week
          </p>
          <span className="font-mono text-xs text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-sm ml-auto">
            {weekHighlights.nextWeekPlanned.length} items
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {weekHighlights.nextWeekPlanned.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-mono text-xs text-muted-foreground/60 shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
