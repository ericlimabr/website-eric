import type { Snapshot } from "@/website-dashboard/types"

const SVC_STATUS: Record<string, { label: string; text: string; bg: string; dot: string }> = {
  complete:    { label: "Complete",    text: "text-emerald-400",       bg: "bg-emerald-400/10",       dot: "bg-emerald-500"        },
  partial:     { label: "Partial",     text: "text-amber-400",         bg: "bg-amber-400/10",         dot: "bg-amber-400"          },
  scaffolded:  { label: "Scaffolded",  text: "text-blue-400",          bg: "bg-blue-400/10",          dot: "bg-blue-400"           },
  not_started: { label: "Not Started", text: "text-muted-foreground",  bg: "bg-muted",                dot: "bg-muted-foreground/30" },
  planned:     { label: "Planned",     text: "text-muted-foreground",  bg: "bg-muted",                dot: "bg-muted-foreground/30" },
}

export default function ArchitectureStatus({ snapshot }: { snapshot: Snapshot }) {
  const { architecture, infrastructure } = snapshot

  return (
    <section>
      <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5">// architecture & infrastructure</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Services */}
        <div className="lg:col-span-2 bg-secondary border border-border rounded-sm p-5">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
            Services ({architecture.services.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {architecture.services.map((svc) => {
              const s = SVC_STATUS[svc.status] ?? SVC_STATUS.not_started
              return (
                <div key={svc.name} className="flex items-center justify-between bg-muted border border-border/50 rounded-sm px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    <div>
                      <p className="font-mono text-base text-foreground">{svc.name}</p>
                      <p className="font-mono text-sm text-muted-foreground mt-0.5">{svc.language}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {svc.healthCheck && (
                      <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm">
                        health ✓
                      </span>
                    )}
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ${s.text} ${s.bg}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Database */}
          <div className="bg-secondary border border-border rounded-sm p-5">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Database</p>
            <p className="text-base font-semibold text-foreground mb-4">{architecture.database.engine}</p>
            <div className="space-y-2">
              {[
                { label: "Tables",     value: architecture.database.tables },
                { label: "Migrations", value: architecture.database.migrations },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="font-mono text-sm text-muted-foreground">{r.label}</span>
                  <span className="font-mono text-sm text-foreground">{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">Row Level Security</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-sm
                  ${architecture.database.rowLevelSecurity ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground bg-muted"}`}>
                  {architecture.database.rowLevelSecurity ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">Multi-tenant</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-sm
                  ${architecture.database.multiTenancy ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground bg-muted"}`}>
                  {architecture.database.multiTenancy ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-secondary border border-border rounded-sm p-5">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">API Endpoints</p>
            <div className="space-y-2">
              {[
                { label: "Defined",      value: architecture.apiEndpoints.defined,       accent: false },
                { label: "Implemented",  value: architecture.apiEndpoints.implemented,   accent: architecture.apiEndpoints.implemented > 0 },
                { label: "With auth",    value: architecture.apiEndpoints.withAuth,      accent: architecture.apiEndpoints.withAuth > 0 },
                { label: "Rate limited", value: architecture.apiEndpoints.withRateLimit, accent: architecture.apiEndpoints.withRateLimit > 0 },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="font-mono text-sm text-muted-foreground">{r.label}</span>
                  <span className={`font-mono text-2xl font-semibold ${r.accent ? "text-primary" : "text-foreground"}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-secondary border border-border rounded-sm p-5">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Infrastructure</p>
            <div className="space-y-2">
              {[
                { label: "Docker services",  value: infrastructure.dockerServices },
                { label: "Makefile targets", value: `${infrastructure.makefileTargets}+` },
                { label: "Environments",     value: infrastructure.environments.length },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="font-mono text-sm text-muted-foreground">{r.label}</span>
                  <span className="font-mono text-sm text-foreground">{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">CI/CD</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-sm
                  ${infrastructure.ciConfigured ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground bg-muted"}`}>
                  {infrastructure.ciConfigured ? "Configured" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-muted-foreground">Logging</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-sm
                  ${infrastructure.observability.loggingConfigured ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground bg-muted"}`}>
                  {infrastructure.observability.loggingConfigured ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture patterns */}
      <div className="mt-4 bg-secondary border border-border rounded-sm p-5">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">Architecture Patterns</p>
        <div className="flex flex-wrap gap-2">
          {architecture.patterns.map((p) => (
            <span key={p} className="font-mono text-sm text-muted-foreground bg-muted border border-border/50 px-3 py-1.5 rounded-sm">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
