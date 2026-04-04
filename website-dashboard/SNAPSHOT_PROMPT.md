# Vector Leads — Weekly Dashboard Snapshot Prompt

> **Purpose:** Paste the entire contents of this file as your first message in any
> new Claude Code session opened in `/home/erbr/Project/fix/vanguard-ai`.
> Claude will scan the project, collect all metrics, and write a new
> `website-dashboard/snapshots/week-NN-YYYY.json` file.

---

## Instructions for Claude

You are a software engineering analyst working on the **Vector Leads** project
(`/home/erbr/Project/fix/vanguard-ai`). Your task is to produce a weekly
development dashboard snapshot by scanning the repository and assessing the
current state of every metric listed below.

**Do not guess. Read the actual files.** If a file doesn't exist yet, record the
appropriate zero/null value.

**Before writing anything**, read the previous snapshot file and the schema:
- `website-dashboard/schema/metrics-schema.json` — the authoritative schema every snapshot must satisfy
- `website-dashboard/snapshots/week-(N-1)-YYYY.json` — the previous snapshot for delta calculation and structural reference

---

## Step 1 — Calculate the Week Number

- **Project coding start date:** `2026-02-23` (Monday of the first productive sprint)
- **Formula:** `week = floor((today − 2026-02-23) / 7) + 1`
- **Week boundaries:** Monday → Sunday (ISO 8601)
- **Output file name:** `website-dashboard/snapshots/week-NN-YYYY.json`
  (zero-pad the week number to 2 digits, e.g. `week-03-2026.json`)

---

## Step 2 — Collect Git Metrics

Run the following and record the results:

```bash
# All commits with date, hash, message
git log --format="%H|%ad|%s" --date=short

# Total commit count
git rev-list --count HEAD

# Cumulative lines added/removed (all history)
git log --format="" --numstat | awk '{add+=$1; rem+=$2} END {print "added:", add, "removed:", rem}'

# Distinct files ever touched
git log --format="%H" | xargs -I{} git diff-tree --no-commit-id -r {} --name-only 2>/dev/null | sort -u | wc -l

# PRs merged this week (requires gh CLI)
gh pr list --state merged --json number,title,mergedAt --limit 50
```

Record:
- `git.totalCommits` — total commits on main since first commit
- `git.weekCommits` — commits since last Monday
- `git.pullRequests.merged` — PRs merged this week
- `git.pullRequests.open` — currently open PRs
- `git.linesAdded` — cumulative lines added (total project history)
- `git.linesRemoved` — cumulative lines removed (total project history)
- `git.filesChanged` — cumulative distinct files touched
- `git.commitLog` — full log array (each commit: hash, date, message, type, isMerge, pr)

For `type`, infer from the commit message prefix: feat, fix, chore, docs, refactor, test, ci, merge, other.

---

## Step 3 — Assess Phase Completion

Read the following files to understand what is implemented:
- `docs/vector-leads-fases-desenvolvimento.md` — canonical phase/step definitions
- `maestro/internal/domain/` — Go domain entities
- `maestro/internal/adapters/` — Go HTTP handlers and repositories
- `maestro/internal/infrastructure/` — Go server and DB
- `ai-worker/` — Python FastAPI service
- `frontend/src/` — Next.js components and pages

### Phase 1 — MVP e Validação de Fluxo

Score each step from 0–100% based on sub-tasks actually present in code.
**Do not count planned or documented items — only count working code.**

| Step ID | Name | Weight | How to assess |
|---------|------|--------|---------------|
| p1-s0 | Project Setup & Infrastructure | 7% | Check docker-compose.yml, Makefile, scripts/init-db.sql, .env.example |
| p1-s1 | Maestro — Domain Layer | 12% | Check internal/domain/*.go for entities, Validate(), error types, port interfaces |
| p1-s2 | Maestro — Infrastructure & Repository Layer | 11% | Check internal/infrastructure/ and internal/adapters/repository/ |
| p1-s3 | Maestro — HTTP Server & Security Middleware | 10% | Check internal/infrastructure/server/ and internal/adapters/http/middleware/ |
| p1-s4 | AI Worker — Core Engine | 12% | Check ai-worker/core/ and api/routes/chat.py |
| p1-s5 | AI Worker — Security & SOLID Refactor | 8% | Check api/dependencies/auth.py and domain/services/ |
| p1-s6 | Maestro — HTTP API Handlers (Leads & Conversations) | 12% | Look for handler files in internal/adapters/http/handlers/ |
| p1-s7 | Maestro — Authentication (Signup, Login, JWT) | 10% | Look for auth handler, JWT issuance code, bcrypt usage |
| p1-s8 | Maestro ↔ AI Worker Integration & WebSocket | 12% | Look for HTTP client, WebSocket upgrade, SSE forwarding |
| p1-s9 | RAG Document Pipeline | 9% | Check ai-worker/infrastructure/vector_db/, chunking, embedding code |
| p1-s10| Frontend — Chat UI & Dashboard | 7% | Count implemented components in frontend/src/ |

**Phase 1 total = Σ(step_weight × step_percent / 100) / 1.10**
(weights sum to 110, so divide by 1.10 to normalise to 100%)

### Phases 2–4

Carry the full phase structure from the previous snapshot unchanged (id, name,
description, estimatedWeeks, steps array with all step objects). Update only
`percentComplete` and `weekDelta` if any work has started; otherwise keep at 0.

### Overall product %

```
productPercentComplete = (phase1 × 0.40) + (phase2 × 0.30) + (phase3 × 0.20) + (phase4 × 0.10)
```

---

## Step 4 — Assess Security Status

Read every file in `claude/vuln/` directory:
- `claude/vuln/maestro-security-audit.md` — primary audit report (round 1)
- `claude/vuln/maestro-security-audit-2.md` — round 2 audit report
- `claude/vuln/open-vulnerabilities.md` — outstanding items
- `claude/vuln/unfixed-vulnerabilities.md` — findings not yet resolved
- `claude/vuln/maestro-vulnerabilities.md` — additional tracking

For each finding, record its ID, severity, title, file, and status.

**Schema constraints — read carefully before writing:**

| Rule | Detail |
|------|--------|
| `severity` enum | Only `"critical"`, `"high"`, `"medium"`, `"low"` are valid. **Never use `"info"`.** Informational / not-exploitable / duplicate findings must be omitted from the findings array entirely. |
| `status` enum | Only `"open"`, `"fixed"`, `"wont_fix"`, `"acknowledged"` are valid. |
| `fixedIn` field | Must be a **string** (e.g. `"PR #7 feat/frontend-auth"`). **Never set to `null`.** Omit the field entirely for open or wont_fix findings that have no PR. |
| `bySeverity` keys | Only `critical`, `high`, `medium`, `low`. **Never add an `info` key.** |
| `security.weekDelta` | Only two keys: `found` and `fixed`. **No `open` key.** |
| `openFindings` | **Not in schema.** Do not add this field. |
| `totalFound` | Must equal `totalFixed + totalOpen`. Wont_fix findings count toward `totalFixed` for the math to hold, or omit them from `totalFound`. Pick one approach and be consistent. |

---

## Step 5 — Count Tests

```bash
# Go tests
find maestro/ -name "*_test.go" | wc -l

# Python tests — exclude venv
find ai-worker/ -path "*/tests/*.py" ! -path "*/venv/*" | wc -l
find ai-worker/ -name "test_*.py" ! -path "*/venv/*" | wc -l

# Frontend tests
find frontend/ \( -name "*.test.tsx" -o -name "*.spec.tsx" -o -name "*.test.ts" \) | wc -l

# Postman collections and request count
ls postman/*.json | wc -l
```

Record:
- `tests.unitTests.total`, `tests.unitTests.passing`, `tests.unitTests.failing`
- `tests.unitTests.byService.maestro`, `.aiWorker`, `.frontend`
- `tests.integrationTests.total`, `.passing`, `.failing`
- `tests.e2eTests.total`, `.passing`, `.failing`
- `tests.manualTests.postmanCollections` — JSON file count under `postman/`
- `tests.manualTests.postmanRequests` — total request objects across all collections (count `"request"` keys recursively)
- `tests.coverage.maestro`, `.aiWorker`, `.frontend` — run coverage tools if possible; else `null`
- `tests.frameworks` — carry from previous snapshot (tools don't change week to week)
- `tests.weekDelta` — `{"added": N}` where N = new tests written this week

---

## Step 6 — Count Code Metrics

```bash
# Lines of Go code (maestro, no tests)
find maestro/ -name "*.go" ! -name "*_test.go" | xargs wc -l | tail -1

# Lines of Python code (ai-worker, excluding venv)
find ai-worker/ -name "*.py" ! -path "*/venv/*" ! -path "*/.venv/*" | xargs wc -l | tail -1

# Lines of TypeScript/TSX (frontend, excluding node_modules)
find frontend/src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1

# Lines of SQL (scripts/ only)
find scripts/ -name "*.sql" | xargs wc -l | tail -1
```

**Schema constraint:** The SQL service key in `codeMetrics.byService` must be
`"database"` (not `"sql"`). Example:
```json
"database": { "language": "SQL", "loc": 309, "files": 11 }
```

Record actual numbers — do not carry over previous week's values without re-measuring.

---

## Step 7 — Assess Architecture & Infrastructure

**`architecture.services` format** — each entry must match this shape exactly:
```json
{ "name": "maestro", "language": "Go 1.24", "status": "partial", "healthCheck": true }
```
- `language` must include the version string (e.g. `"Go 1.24"`, `"Python 3.13"`, `"Next.js 16"`, `"PostgreSQL 16"`)
- `healthCheck` is a boolean — check docker-compose.yml healthcheck blocks
- `status` enum: `"planned"` | `"scaffolded"` | `"partial"` | `"complete"`
- **No `notes` field** on service objects

**`architecture.database`** — always include all five fields:
```json
{ "engine": "PostgreSQL 16", "tables": N, "migrations": N, "rowLevelSecurity": true, "multiTenancy": true }
```

**`architecture.apiEndpoints`** — always include all four fields:
```json
{ "defined": N, "implemented": N, "withAuth": N, "withRateLimit": N }
```
- `withAuth` = routes behind JWT middleware
- `withRateLimit` = routes behind rate limiter

**`architecture.patterns`** — carry from previous snapshot, add any new patterns introduced this week.

Count DB tables:
```bash
grep -c "CREATE TABLE" scripts/init-db.sql
find maestro/internal/infrastructure/database/migrations/ -name "*.sql" | wc -l
```

Count API routes:
```bash
grep -h "\.GET\|\.POST\|\.PATCH\|\.DELETE\|\.PUT" maestro/internal/adapters/http/handlers/*.go | grep -v "//"
grep -r "@router\|@app\." ai-worker/api/ 2>/dev/null | grep -v venv
```

---

## Step 8 — Write the Snapshot File

Using **all collected data**, write a complete JSON file that satisfies the
schema at `website-dashboard/schema/metrics-schema.json`.

**Output file path:**
```
website-dashboard/snapshots/week-NN-YYYY.json
```
(Replace NN and YYYY with the calculated week number and current year.)

### Structure rules (carry from previous snapshot)

The following fields must be **copied verbatim** from the previous snapshot and
updated only where values have changed. Do not invent new top-level fields or
omit required ones.

| Field | Rule |
|-------|------|
| `phases.phase1.description` | Required. Copy from previous snapshot. |
| `phases.phase1.estimatedWeeks` | Required. Copy from previous snapshot. |
| `phases.phase2` through `phase4` | Copy the full object (description, estimatedWeeks, all steps) from the previous snapshot. Update percentComplete/weekDelta only if work started. |
| `tests.frameworks` | Copy from previous snapshot. Frameworks don't change week to week. |
| `architecture.patterns` | Copy from previous snapshot and append new patterns if any. |

### weekDelta rules

- For week 1: `weekDelta` = the current value (everything is net-new)
- For week N > 1: `weekDelta` = current value minus the value in `week-(N-1)-YYYY.json`
  - Read the previous snapshot to compute deltas
  - A negative delta is valid (e.g. if tests broke)
- For each **step**: `weekDelta = round((currentPercent - prevPercent) / 100 × weight)`

### weekHighlights rules

- `shipped`: features/components that reached `complete` or `partial` status this week
- `fixed`: vulnerabilities fixed and bugs resolved this week
- `started`: work items where status moved from `not_started` to `in_progress`
- `blockers`: anything preventing the next planned step
- `nextWeekPlanned`: the next 3–5 items in the phase roadmap not yet complete

---

## Step 9 — Validate and Confirm

After writing the file, run all of these checks:

```bash
# 1. Valid JSON
cat website-dashboard/snapshots/week-NN-YYYY.json | python3 -m json.tool > /dev/null && echo "Valid JSON"

# 2. Required top-level keys present
python3 -c "
import json
with open('website-dashboard/snapshots/week-NN-YYYY.json') as f:
    d = json.load(f)
required = ['meta','git','overallProgress','phases','security','tests','codeMetrics','architecture','infrastructure','weekHighlights']
missing = [k for k in required if k not in d]
print('Missing keys:', missing or 'none')

# Security math check
s = d['security']
assert s['totalFound'] == s['totalFixed'] + s['totalOpen'], f\"Security totals mismatch: {s['totalFound']} != {s['totalFixed']} + {s['totalOpen']}\"
print('Security totals: OK')

# Phase descriptions present
for p in ['phase1','phase2','phase3','phase4']:
    assert 'description' in d['phases'][p], f'Missing description on {p}'
print('Phase descriptions: OK')

# codeMetrics.byService has database key not sql
assert 'database' in d['codeMetrics']['byService'], 'codeMetrics.byService must use key database not sql'
print('codeMetrics.byService key: OK')

# No info severity in bySeverity
assert 'info' not in d['security'].get('bySeverity', {}), 'bySeverity must not contain info key'
print('bySeverity keys: OK')
"
```

Then output a brief summary table:

```
Week N Snapshot — Vector Leads
═══════════════════════════════════════════════════════
Phase 1 progress:    XX% (↑ +YY% from last week)
Overall product:     XX% (weighted across 4 phases)
Security:            XX found · XX fixed · XX open
Tests:               XX unit · XX integration · XX e2e
Lines of code:       X,XXX total (↑ +XXX this week)
File written:        website-dashboard/snapshots/week-NN-YYYY.json
═══════════════════════════════════════════════════════
```

---

## Phase Scoring Rubric (for consistent assessment across sessions)

### What counts as "done" for a sub-task?

| Criterion | Counts as done? |
|-----------|----------------|
| Code exists in committed files | ✅ Yes |
| Code is in a PR that hasn't merged yet | ❌ No (not on main) |
| Feature is documented but no code exists | ❌ No |
| Feature is partially implemented (e.g. no error handling) | Count as 50% |
| Feature compiles and runs but has no tests | ✅ Yes (tests are tracked separately) |
| Feature is behind a TODO comment | ❌ No |
| Infrastructure (Docker service, DB table) is configured | ✅ Yes |

### How to score a step's percentComplete?

```
step_percent = (done_subtasks × 100 + partial_subtasks × 50) / total_subtasks
```

Round to the nearest 5%.

### Phase 1 weight allocation reminder

All step weights in Phase 1 sum to 110 (not 100). Normalise:

```
phase1% = Σ(weight × step%) / 110
```

p1-s0(7) + p1-s1(12) + p1-s2(11) + p1-s3(10) + p1-s4(12) + p1-s5(8) +
p1-s6(12) + p1-s7(10) + p1-s8(12) + p1-s9(9) + p1-s10(7) = **110**

---

## Reference: Week 2 Baseline (Mar 2–8, 2026)

Use this to sanity-check your deltas for Week 3+.

| Metric | Week 2 Value |
|--------|-------------|
| Phase 1 % | 70% |
| Phase 2–4 % | 0% |
| Product % | 28% |
| Security found | 48 |
| Security fixed | 47 |
| Security open | 1 (F-18 medium) |
| Unit tests | 0 |
| Integration tests | 0 |
| E2E tests | 0 |
| Postman collections | 2 (18 requests) |
| Maestro LOC | 2,893 |
| AI Worker LOC | 664 |
| Frontend LOC | 1,699 |
| SQL LOC | 309 |
| Total LOC | 5,565 |
| Git commits | 15 |
| PRs merged (week) | 1 |
| Lines added (cumulative) | 30,427 |
| Docker services | 9 |
| Makefile targets | 70 |
| DB tables | 9 |
| Migrations | 9 |
| API endpoints defined | 10 |
| API endpoints implemented | 10 |
| withAuth | 9 |
| withRateLimit | 10 |

---

## Project Reference

| Key | Value |
|-----|-------|
| Project name | Vector Leads |
| Working dir | `/home/erbr/Project/fix/vanguard-ai` |
| Go module | `github.com/vector-leads/maestro` |
| Go version | 1.24.0 |
| Python version | 3.13+ |
| Frontend | Next.js 16 + React 19 + TypeScript strict |
| Primary LLM | Groq (llama-3.3-70b-versatile) |
| Vector DB | Qdrant |
| Cache | Redis 7 |
| Object storage | MinIO |
| Phases | 4 total (P1=MVP, P2=Dashboard, P3=CRM, P4=Enterprise) |
| Schema file | `website-dashboard/schema/metrics-schema.json` |
| Latest snapshot | `website-dashboard/snapshots/week-02-2026.json` |
