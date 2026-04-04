import type { GitData } from "@/website-dashboard/types"

const TYPE_COLOR: Record<string, string> = {
  feat:     "bg-primary",
  fix:      "bg-amber-400",
  test:     "bg-blue-400",
  chore:    "bg-muted-foreground/40",
  docs:     "bg-purple-400",
  refactor: "bg-cyan-400",
  merge:    "bg-muted-foreground/20",
}

const TYPE_TEXT: Record<string, string> = {
  feat:     "text-primary",
  fix:      "text-amber-400",
  test:     "text-blue-400",
  chore:    "text-muted-foreground",
  docs:     "text-purple-400",
  refactor: "text-cyan-400",
  merge:    "text-muted-foreground/50",
}

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-")
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`
}

export default function GitActivityCard({ git }: { git: GitData }) {
  const byDate: Record<string, number> = {}
  const byDateTypes: Record<string, Record<string, number>> = {}

  for (const c of git.commitLog ?? []) {
    byDate[c.date] = (byDate[c.date] || 0) + 1
    if (!byDateTypes[c.date]) byDateTypes[c.date] = {}
    byDateTypes[c.date][c.type] = (byDateTypes[c.date][c.type] || 0) + 1
  }

  const dates = Object.keys(byDate).sort()
  const maxCount = dates.length > 0 ? Math.max(...Object.values(byDate)) : 1
  const CHART_H = 64
  const netLines = git.linesAdded - git.linesRemoved

  return (
    <div className="bg-secondary border border-border rounded-sm p-6 flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Git Activity</p>
        <p className="text-3xl font-bold text-foreground">
          {git.weekCommits}{" "}
          <span className="text-lg font-normal text-muted-foreground">commits this week</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "PRs merged",    value: git.pullRequests.merged, accent: true  },
          { label: "Files changed", value: git.filesChanged,        accent: false },
          { label: "Total commits", value: git.totalCommits,        accent: false },
        ].map((s) => (
          <div key={s.label} className="bg-muted border border-border/50 rounded-sm p-3 text-center">
            <p className={`text-3xl font-bold ${s.accent ? "text-primary" : "text-foreground"}`}>{s.value}</p>
            <p className="font-mono text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">Lines</span>
        <span className="font-mono text-base font-semibold text-emerald-400">+{git.linesAdded.toLocaleString()}</span>
        <span className="font-mono text-base font-semibold text-red-400">-{git.linesRemoved.toLocaleString()}</span>
        <span className="font-mono text-sm text-muted-foreground">(net +{netLines.toLocaleString()})</span>
      </div>

      {/* Commit frequency chart */}
      {dates.length > 0 && (
        <div>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Commits per day</p>
          <div className="flex items-end gap-2" style={{ height: `${CHART_H + 36}px` }}>
            {dates.map((date) => {
              const count = byDate[date]
              const barH = Math.max(4, (count / maxCount) * CHART_H)
              const types = byDateTypes[date]
              const mainType = Object.entries(types).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "chore"
              return (
                <div key={date} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <span className="font-mono text-sm text-muted-foreground">{count}</span>
                  <div
                    className={`w-full rounded-t-sm ${TYPE_COLOR[mainType] ?? "bg-muted-foreground/40"}`}
                    style={{ height: `${barH}px` }}
                  />
                  <span className="font-mono text-xs text-muted-foreground text-center w-full truncate">
                    {fmtDate(date)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.entries(TYPE_COLOR).filter(([t]) => t !== "merge").map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-sm ${color}`} />
                <span className="font-mono text-xs text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent commits */}
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Recent commits</p>
        <div className="space-y-2">
          {(git.commitLog ?? []).filter((c) => !c.isMerge).slice(-5).reverse().map((c) => (
            <div key={c.hash} className="flex items-start gap-2">
              <span className={`font-mono text-xs px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5 bg-muted ${TYPE_TEXT[c.type] ?? "text-muted-foreground"}`}>
                {c.type}
              </span>
              <span className="font-mono text-sm text-foreground/70 leading-relaxed line-clamp-1 flex-1">
                {c.message.replace(/^(feat|fix|chore|docs|refactor|test|ci)(\([^)]+\))?:\s*/i, "")}
              </span>
              <span className="font-mono text-sm text-muted-foreground shrink-0 ml-auto">{c.hash.slice(0, 7)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
