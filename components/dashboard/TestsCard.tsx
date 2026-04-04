import type { TestsData } from "@/website-dashboard/types"

export default function TestsCard({ tests }: { tests: TestsData }) {
  const suites = [
    { label: "Unit",        data: tests.unitTests        },
    { label: "Integration", data: tests.integrationTests },
    { label: "E2E",         data: tests.e2eTests         },
  ]

  const totalTests   = tests.unitTests.total + tests.integrationTests.total + tests.e2eTests.total
  const passingTests = tests.unitTests.passing + tests.integrationTests.passing + tests.e2eTests.passing

  return (
    <div className="bg-secondary border border-border rounded-sm p-6 flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">Test Suite</p>
        <p className="text-3xl font-bold text-foreground">
          {passingTests}{" "}
          <span className="text-lg font-normal text-muted-foreground">/ {totalTests} passing</span>
        </p>
        {tests.weekDelta.added > 0 && (
          <p className="font-mono text-sm text-primary mt-1">+{tests.weekDelta.added} tests this week</p>
        )}
      </div>

      <div className="space-y-3">
        {suites.map(({ label, data }) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-mono text-sm text-foreground/70">{label}</span>
              <div className="flex items-center gap-3">
                {data.failing > 0 && (
                  <span className="font-mono text-sm text-red-400">{data.failing} failing</span>
                )}
                <span className={`font-mono text-base font-semibold ${data.total > 0 ? "text-emerald-400" : "text-muted-foreground/30"}`}>
                  {data.passing}/{data.total}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${data.failing > 0 ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: data.total > 0 ? `${(data.passing / data.total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {tests.frameworks && (
        <div className="border-t border-border/50 pt-4">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Frameworks</p>
          <div className="space-y-1.5">
            {Object.entries(tests.frameworks).filter(([, v]) => v && v !== "n/a").map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-mono text-sm text-muted-foreground">{key}</span>
                <span className="font-mono text-sm text-foreground/70">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tests.manualTests && tests.manualTests.postmanRequests > 0 && (
        <div className="border-t border-border/50 pt-4">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Manual</p>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-bold text-foreground">{tests.manualTests.postmanCollections}</p>
              <p className="font-mono text-sm text-muted-foreground">collections</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{tests.manualTests.postmanRequests}</p>
              <p className="font-mono text-sm text-muted-foreground">requests</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
