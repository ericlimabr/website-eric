import type { CodeMetricsData } from "@/website-dashboard/types"

const SERVICE_COLORS = [
  "bg-primary", "bg-amber-400", "bg-blue-400", "bg-purple-400", "bg-cyan-400",
]
const SERVICE_TEXT = [
  "text-primary", "text-amber-400", "text-blue-400", "text-purple-400", "text-cyan-400",
]

export default function CodeMetricsCard({ metrics }: { metrics: CodeMetricsData }) {
  const services = Object.keys(metrics.byService)
  const maxLoc = Math.max(...services.map((s) => metrics.byService[s]?.loc ?? 0), 1)

  return (
    <div className="bg-secondary border border-border rounded-sm p-6 flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Code Metrics</p>
        <p className="text-3xl font-bold text-foreground">
          {metrics.totalLinesOfCode.toLocaleString()}{" "}
          <span className="text-lg font-normal text-muted-foreground">lines of code</span>
        </p>
      </div>

      {/* LOC by service */}
      <div className="space-y-4">
        {services.map((key, idx) => {
          const svc = metrics.byService[key]
          const pct = maxLoc > 0 ? (svc.loc / maxLoc) * 100 : 0
          const locPct = metrics.totalLinesOfCode > 0
            ? Math.round((svc.loc / metrics.totalLinesOfCode) * 100)
            : 0
          const color = SERVICE_COLORS[idx % SERVICE_COLORS.length]
          const textColor = SERVICE_TEXT[idx % SERVICE_TEXT.length]

          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-mono text-sm text-foreground/70">
                  {key} <span className="text-muted-foreground">({svc.language})</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">{svc.files} files</span>
                  <span className={`font-mono text-base font-semibold ${svc.loc > 0 ? textColor : "text-muted-foreground/30"}`}>
                    {svc.loc.toLocaleString()}
                  </span>
                  {svc.loc > 0 && (
                    <span className={`font-mono text-sm px-1.5 py-0.5 rounded-sm bg-muted ${textColor}`}>
                      {locPct}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${svc.loc > 0 ? color : "bg-muted"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Week delta */}
      <div className="border-t border-border/50 pt-4">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">This week's delta</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Added",   value: `+${metrics.weekDelta.linesAdded.toLocaleString()}`,   color: "text-emerald-400" },
            { label: "Removed", value: `-${metrics.weekDelta.linesRemoved.toLocaleString()}`,  color: "text-red-400"     },
            { label: "Net",     value: `+${metrics.weekDelta.netChange.toLocaleString()}`,     color: "text-foreground"  },
          ].map((d) => (
            <div key={d.label} className="bg-muted border border-border/50 rounded-sm p-3 text-center">
              <p className={`font-mono text-base font-semibold ${d.color}`}>{d.value}</p>
              <p className="font-mono text-sm text-muted-foreground mt-1">{d.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
