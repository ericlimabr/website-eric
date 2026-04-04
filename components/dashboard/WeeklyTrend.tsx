import type { Snapshot } from "@/website-dashboard/types"

function fmtShort(iso: string) {
  const [, m, d] = iso.split("-")
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`
}

interface TrendChartProps {
  label: string
  unit: string
  barColor: string
  textColor: string
  data: Array<{ week: number; value: number }>
}

function TrendChart({ label, unit, barColor, textColor, data }: TrendChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const CHART_H = 56

  return (
    <div className="bg-muted/50 border border-border/50 rounded-sm p-4">
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold mb-4 ${textColor}`}>
        {data[data.length - 1]?.value?.toLocaleString() ?? "—"}
        <span className="text-sm font-normal ml-1 text-muted-foreground">{unit}</span>
      </p>

      {data.length === 1 ? (
        <div>
          <div className="flex items-end gap-2" style={{ height: `${CHART_H + 24}px` }}>
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="font-mono text-xs text-muted-foreground">{data[0].value.toLocaleString()}</span>
              <div className="w-full max-w-[48px] mx-auto rounded-t-sm" style={{ height: `${CHART_H}px`, backgroundColor: barColor }} />
              <span className="font-mono text-xs text-muted-foreground">W{data[0].week}</span>
            </div>
          </div>
          <p className="font-mono text-xs text-muted-foreground/40 mt-2 italic text-center">Baseline — week {data[0].week}</p>
        </div>
      ) : (
        <div className="flex items-end gap-1" style={{ height: `${CHART_H + 24}px` }}>
          {data.map((d) => {
            const barH = Math.max(4, (d.value / maxVal) * CHART_H)
            return (
              <div key={d.week} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="font-mono text-xs text-muted-foreground">{d.value}</span>
                <div className="w-full rounded-t-sm" style={{ height: `${barH}px`, backgroundColor: barColor }} />
                <span className="font-mono text-xs text-muted-foreground truncate w-full text-center">W{d.week}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function WeeklyTrend({ snapshots }: { snapshots: Snapshot[] }) {
  const phase1Data  = snapshots.map((s) => ({ week: s.meta.week, value: s.overallProgress?.phase1PercentComplete ?? 0 }))
  const productData = snapshots.map((s) => ({ week: s.meta.week, value: s.overallProgress?.productPercentComplete ?? 0 }))
  const commitsData = snapshots.map((s) => ({ week: s.meta.week, value: s.git?.weekCommits ?? 0 }))
  const locData     = snapshots.map((s) => ({ week: s.meta.week, value: s.codeMetrics?.totalLinesOfCode ?? 0 }))

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <p className="font-mono text-xs text-primary uppercase tracking-widest">// weekly trend</p>
        <p className="font-mono text-sm text-muted-foreground">
          {snapshots.length} week{snapshots.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      <div className="bg-secondary border border-border rounded-sm p-5">
        {/* Timeline header */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
          {snapshots.map((s, i) => (
            <div key={s.meta.week} className="flex items-center gap-3 shrink-0">
              {i > 0 && <div className="w-8 h-px bg-border" />}
              <div className="border border-border rounded-sm px-4 py-3 text-center">
                <p className="font-mono text-xs text-primary">W{s.meta.week}</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">
                  {fmtShort(s.meta.period.start)}–{fmtShort(s.meta.period.end)}
                </p>
                <p className="text-2xl font-bold text-foreground leading-none mt-1.5">
                  {s.overallProgress.productPercentComplete}%
                </p>
              </div>
            </div>
          ))}
          {snapshots.length < 8 && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-px bg-border" />
              <div className="border border-dashed border-border/50 rounded-sm px-4 py-3 text-center opacity-40">
                <p className="font-mono text-xs text-muted-foreground">W{snapshots.length + 1}</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">soon</p>
                <p className="text-xl font-bold text-muted-foreground leading-none mt-1.5">—</p>
              </div>
            </div>
          )}
        </div>

        {/* Trend charts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <TrendChart label="Phase 1"      unit="%" barColor="hsl(168 80% 50%)" textColor="text-primary"      data={phase1Data}  />
          <TrendChart label="Product"      unit="%" barColor="#34d399"           textColor="text-emerald-400"  data={productData} />
          <TrendChart label="Commits/week" unit=""  barColor="#a78bfa"           textColor="text-violet-400"   data={commitsData} />
          <TrendChart label="Total LOC"    unit=""  barColor="#38bdf8"           textColor="text-sky-400"      data={locData}     />
        </div>
      </div>
    </section>
  )
}
