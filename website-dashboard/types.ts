export interface SnapshotMeta {
  project: string
  snapshotVersion: string
  week: number
  period: { start: string; end: string }
  generatedAt: string
  generatedBy: string
  previousSnapshotWeek: number | null
}

export interface CommitEntry {
  hash: string
  date: string
  message: string
  type: string
  isMerge: boolean
  pr: number | null
}

export interface GitData {
  branch: string
  totalCommits: number
  weekCommits: number
  pullRequests: { merged: number; open: number }
  linesAdded: number
  linesRemoved: number
  filesChanged: number
  commitLog: CommitEntry[]
}

export interface OverallProgress {
  phase1PercentComplete: number
  phase2PercentComplete: number
  phase3PercentComplete: number
  phase4PercentComplete: number
  productPercentComplete: number
  weekDelta: {
    phase1: number
    phase2: number
    phase3: number
    phase4: number
    product: number
  }
}

export interface SubTask {
  name: string
  done: boolean
  notes?: string
}

export interface Step {
  id: string
  name: string
  description: string
  weight: number
  percentComplete: number
  status: "complete" | "in_progress" | "not_started" | "blocked"
  weekDelta: number
  subTasks: SubTask[]
}

export interface Phase {
  id: string
  name: string
  description: string
  status: "complete" | "in_progress" | "not_started"
  percentComplete: number
  weekDelta: number
  estimatedWeeks?: string
  steps: Step[]
}

export interface SecuritySeverityCount {
  found: number
  fixed: number
  open: number
}

export interface SecurityFinding {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  file: string
  status: string
  fixedIn: string
}

export interface SecurityAudit {
  name: string
  date: string
  scope: string
  summary: { critical: number; high: number; medium: number; low: number; total: number }
  fixed: { critical: number; high: number; medium: number; low: number; total: number }
  openVulnerabilities: number
  findings: SecurityFinding[]
}

export interface SecurityData {
  totalFound: number
  totalFixed: number
  totalOpen: number
  bySeverity: {
    critical: SecuritySeverityCount
    high: SecuritySeverityCount
    medium: SecuritySeverityCount
    low: SecuritySeverityCount
  }
  weekDelta: { found: number; fixed: number }
  positiveFindings: string[]
  audits: SecurityAudit[]
}

export interface ServiceCodeMetrics {
  language: string
  loc: number
  files: number
  dependencies?: number
}

export interface CodeMetricsData {
  totalLinesOfCode: number
  byService: Record<string, ServiceCodeMetrics>
  weekDelta: { linesAdded: number; linesRemoved: number; netChange: number }
}

export interface ArchitectureService {
  name: string
  language: string
  status: "complete" | "partial" | "scaffolded" | "not_started" | "planned"
  healthCheck: boolean
}

export interface TestSuite {
  total: number
  passing: number
  failing: number
}

export interface TestsData {
  unitTests: TestSuite & { byService?: Record<string, number> }
  integrationTests: TestSuite
  e2eTests: TestSuite
  manualTests?: { postmanCollections: number; postmanRequests: number }
  coverage?: Record<string, number | null>
  frameworks?: Record<string, string>
  weekDelta: { added: number }
}

export interface Snapshot {
  meta: SnapshotMeta
  git: GitData
  overallProgress: OverallProgress
  phases: {
    phase1: Phase
    phase2: Phase
    phase3: Phase
    phase4: Phase
  }
  security: SecurityData
  tests?: TestsData
  codeMetrics: CodeMetricsData
  architecture: {
    services: ArchitectureService[]
    database: {
      engine: string
      tables: number
      migrations: number
      rowLevelSecurity: boolean
      multiTenancy: boolean
    }
    apiEndpoints: {
      defined: number
      implemented: number
      withAuth: number
      withRateLimit: number
    }
    patterns: string[]
  }
  infrastructure: {
    dockerServices: number
    makefileTargets: number
    environments: string[]
    ciConfigured: boolean
    cdConfigured: boolean
    monitoringStack: string[]
    observability: {
      loggingConfigured: boolean
      metricsConfigured: boolean
      tracingConfigured: boolean
    }
  }
  weekHighlights: {
    shipped: string[]
    fixed: string[]
    started: string[]
    blockers: string[]
    nextWeekPlanned: string[]
  }
}
