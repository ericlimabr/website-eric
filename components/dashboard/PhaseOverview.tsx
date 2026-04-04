import type { Snapshot } from "@/website-dashboard/types"

const STATUS: Record<string, { label: string; text: string; bg: string; bar: string }> = {
  complete:    { label: "Complete",    text: "text-emerald-400", bg: "bg-emerald-400/10", bar: "bg-emerald-500"        },
  in_progress: { label: "In Progress", text: "text-amber-400",  bg: "bg-amber-400/10",   bar: "bg-amber-400"         },
  not_started: { label: "Not Started", text: "text-muted-foreground", bg: "bg-muted",    bar: "bg-muted-foreground/20" },
}

const PHASES = ["phase1", "phase2", "phase3", "phase4"] as const

export default function PhaseOverview({ snapshot }: { snapshot: Snapshot }) {
  return (
    <section>
      <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">// phase overview</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PHASES.map((key, idx) => {
          const phase = snapshot.phases?.[key]
          const s = STATUS[phase?.status ?? "not_started"]
          const completedSteps = phase?.steps?.filter((s) => s.status === "complete").length ?? 0
          const totalSteps = phase?.steps?.length ?? 0

          return (
            <div key={key} className="bg-secondary border border-border rounded-sm p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <span className={`font-mono text-xs px-2 py-1 rounded-sm ${s.text} ${s.bg}`}>
                  {s.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">Phase {idx + 1}</span>
              </div>

              <div>
                <p className={`text-5xl font-bold leading-none ${s.text}`}>
                  {phase?.percentComplete ?? 0}<span className="text-2xl">%</span>
                </p>
                {(phase?.weekDelta ?? 0) > 0 && (
                  <p className={`font-mono text-sm mt-1 ${s.text}`}>
                    +{phase!.weekDelta}% this week
                  </p>
                )}
              </div>

              <div>
                <p className="text-base font-semibold text-foreground mb-1 leading-snug">
                  {phase?.name ?? `Phase ${idx + 1}`}
                </p>
                <p className="font-mono text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {phase?.description ?? "Pending"}
                </p>
              </div>

              <div className="mt-auto space-y-2">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.bar}`}
                    style={{ width: `${phase?.percentComplete ?? 0}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-sm text-muted-foreground">
                  <span>{completedSteps}/{totalSteps} steps</span>
                  {phase?.estimatedWeeks && <span>~{phase.estimatedWeeks}w</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
