# Vector Leads — Development Dashboard Data

This folder drives a public-facing development dashboard that shows
weekly engineering progress for the Vector Leads platform.

---

## Folder Structure

```
website-dashboard/
├── README.md                    ← You are here
├── SNAPSHOT_PROMPT.md           ← Paste this into any new Claude session to generate a fresh snapshot
├── schema/
│   └── metrics-schema.json      ← JSON Schema (draft-07) that every snapshot must satisfy
└── snapshots/
    └── week-01-2026.json        ← Week 1 data (Feb 23 – Feb 28, 2026)
        week-02-2026.json        ← (generated next week)
        ...
```

---

## How to Generate a New Weekly Snapshot

1. Open a new Claude Code session in `/home/erbr/Project/fix/vanguard-ai`.
2. Open `website-dashboard/SNAPSHOT_PROMPT.md` and copy its **entire contents**.
3. Paste it as your first message in the new session.
4. Claude will scan the project, collect all metrics, and write the new
   snapshot file to `website-dashboard/snapshots/week-NN-YYYY.json`.
5. Commit the new file and push — your dashboard site will pick it up automatically.

---

## Dashboard Metrics Covered

| Category | Metrics |
|---|---|
| **Overall Progress** | % complete per phase, product-level %, week-over-week delta |
| **Phase Breakdown** | Each phase → steps → sub-tasks with % complete and status |
| **Git Activity** | Commits, PRs merged, lines added/removed, files changed |
| **Security** | Vulnerabilities found/fixed per severity (Critical/High/Medium/Low), open count |
| **Tests** | Unit / integration / E2E / manual counts, coverage %, week delta |
| **Code Metrics** | LOC per service/language, file counts, dependency counts |
| **Architecture** | Services live, DB tables, API endpoints defined vs implemented |
| **Infrastructure** | Docker services, CI/CD status, environments configured |
| **Milestones** | Feature flags per phase, what shipped this week |

---

## Week Numbering Convention

- **Project coding start:** 2026-02-23 (Monday of the first productive sprint)
- **Week N** = `floor((currentDate − 2026-02-23) / 7) + 1`
- Week boundaries run **Monday → Sunday** (ISO 8601).

---

## Dashboard Site Integration

The consumer website should:
1. Fetch all `snapshots/week-*.json` files (sorted by week number).
2. Render charts based on the fields described in `schema/metrics-schema.json`.
3. Show the latest snapshot as "current week" and all others as history.

Suggested chart types:
- **Line chart** — `overallProgress.phase1PercentComplete` over weeks
- **Stacked bar** — phase breakdown percentages by week
- **Area chart** — `codeMetrics.totalLinesOfCode` over weeks
- **Grouped bar** — `security.totalFound` vs `security.totalFixed`
- **Heatmap** — `git.weekCommits` per day
- **Progress rings** — per-phase completion
- **Table** — weekly vulnerability findings with severity badges
