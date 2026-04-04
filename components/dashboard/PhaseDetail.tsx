"use client"

import { useState } from "react"
import type { Phase, Step } from "@/website-dashboard/types"

const STATUS: Record<string, { label: string; text: string; bg: string; icon: string; bar: string }> = {
  complete:    { label: "Complete",    text: "text-emerald-400", bg: "bg-emerald-400/10", icon: "✓", bar: "bg-emerald-500" },
  in_progress: { label: "In Progress", text: "text-amber-400",  bg: "bg-amber-400/10",   icon: "⟳", bar: "bg-amber-400"  },
  not_started: { label: "Not Started", text: "text-muted-foreground", bg: "bg-muted",    icon: "–", bar: "bg-muted-foreground/20" },
  blocked:     { label: "Blocked",     text: "text-red-400",    bg: "bg-red-400/10",      icon: "✕", bar: "bg-red-500"    },
}

function StepRow({ step }: { step: Step }) {
  const [open, setOpen] = useState(false)
  const s = STATUS[step.status] ?? STATUS.not_started
  const doneTasks = step.subTasks?.filter((t) => t.done).length ?? 0
  const totalTasks = step.subTasks?.length ?? 0

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => totalTasks > 0 && setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-muted/50 transition-colors"
      >
        <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${s.text} ${s.bg}`}>
          {s.icon}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-base font-semibold text-foreground">{step.name}</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ${s.text} ${s.bg}`}>{s.label}</span>
            {step.weekDelta > 0 && (
              <span className="font-mono text-xs text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-sm">
                +{step.weekDelta}% this week
              </span>
            )}
          </div>
          {step.description && (
            <p className="font-mono text-sm text-muted-foreground leading-relaxed line-clamp-2">{step.description}</p>
          )}
        </div>

        <div className="shrink-0 text-right space-y-1">
          <p className={`text-3xl font-bold ${s.text}`}>
            {step.percentComplete}<span className="text-base">%</span>
          </p>
          {totalTasks > 0 && (
            <p className="font-mono text-sm text-muted-foreground">{doneTasks}/{totalTasks} tasks</p>
          )}
          {totalTasks > 0 && (
            <span className="font-mono text-sm text-muted-foreground">{open ? "▲" : "▼"}</span>
          )}
        </div>
      </button>

      <div className="h-px bg-border/50">
        <div className={`h-full ${s.bar}`} style={{ width: `${step.percentComplete}%` }} />
      </div>

      {open && totalTasks > 0 && (
        <div className="bg-muted/50 px-5 py-4 space-y-3">
          {step.subTasks.map((task, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`shrink-0 w-5 h-5 rounded-sm flex items-center justify-center text-xs mt-0.5 font-bold
                ${task.done ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground bg-muted"}`}>
                {task.done ? "✓" : "○"}
              </span>
              <div>
                <p className={`text-base ${task.done ? "text-foreground/80" : "text-muted-foreground"}`}>{task.name}</p>
                {task.notes && (
                  <p className="font-mono text-sm text-muted-foreground/60 mt-0.5 italic">↳ {task.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PhaseSection({ phase }: { phase: Phase }) {
  const [expanded, setExpanded] = useState(phase.status === "in_progress")
  const s = STATUS[phase.status] ?? STATUS.not_started

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 bg-secondary hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-5">
          <p className={`text-5xl font-bold leading-none ${s.text}`}>
            {phase.percentComplete}<span className="text-2xl">%</span>
          </p>
          <div>
            <p className="text-xl font-semibold text-foreground">{phase.name}</p>
            <p className="font-mono text-sm text-muted-foreground mt-1">
              {phase.steps?.filter((s) => s.status === "complete").length ?? 0}/
              {phase.steps?.length ?? 0} steps
              {phase.estimatedWeeks && ` · ~${phase.estimatedWeeks}w estimated`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono text-xs px-2.5 py-1 rounded-sm ${s.text} ${s.bg}`}>{s.label}</span>
          <span className="font-mono text-xs text-muted-foreground">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="bg-muted/30 p-4 space-y-3 border-t border-border">
          {phase.steps?.map((step) => <StepRow key={step.id} step={step} />)}
        </div>
      )}
    </div>
  )
}

export default function PhaseDetail({ phases }: { phases: Record<string, Phase> }) {
  return (
    <section>
      <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">// phase detail</p>
      <div className="space-y-4">
        {(["phase1", "phase2", "phase3", "phase4"] as const).map((key) =>
          phases[key] ? <PhaseSection key={key} phase={phases[key]} /> : null
        )}
      </div>
    </section>
  )
}
