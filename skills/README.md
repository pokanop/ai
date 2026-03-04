# Agent Skills

A collection of structured, project-aware agent skills for software development workflows. Each skill follows the [Agent Skills specification](https://agentskills.io/specification) and can be installed via the [skills.sh](https://skills.sh) registry.

---

## Available Skills

| Skill | Purpose | Use When |
|-------|---------|-----------|
| [`create-a-prd`](create-a-prd/) | Write a Product Requirements Document | Starting a new feature or initiative |
| [`prd-to-tasks`](prd-to-tasks/) | Break a PRD into an actionable task list | Planning implementation from a completed PRD |
| [`tasks-to-code`](tasks-to-code/) | Implement tasks one at a time | Executing an approved task list |
| [`code-review`](code-review/) | Structured review of code changes | Reviewing a PR, diff, or set of changed files |
| [`debug-and-fix`](debug-and-fix/) | Diagnose bugs and add regression tests | Something is broken and needs root-cause analysis |
| [`ui-design-audit`](ui-design-audit/) | Sweep UI for design system inconsistencies | Auditing components before a design cleanup |
| [`release-checklist`](release-checklist/) | Go/no-go assessment before shipping | Preparing to deploy a completed plan |
| [`plan-retrospective`](plan-retrospective/) | Close out a plan with metrics and lessons | Wrapping up a completed feature |

---

## Recommended Order of Operations

These skills are designed to chain together into a complete software development lifecycle. There are two primary workflows:

### Planning Trilogy (Feature Development)

```
create-a-prd  →  prd-to-tasks  →  tasks-to-code
  (what)           (how)            (build)
```

The planning trilogy covers a feature from idea to shipped code:

1. **`create-a-prd`** — Turns a product idea into a structured PRD at `plans/<name>/prd.md`. Includes codebase discovery, user story writing, requirement labeling (`FR-N`, `US-N`, `NFR-N`, `QG-N`), phased implementation planning, and testing strategy.

2. **`prd-to-tasks`** — Reads the PRD and generates a comprehensive, traceable task list at `plans/<name>/tasks.md`. Every task traces back to a specific PRD requirement. Tasks are sized (S/M/L/XL), prioritized (P0/P1/P2), and have explicit acceptance criteria.

3. **`tasks-to-code`** — Implements tasks one at a time, following the project's existing patterns. Updates `tasks.md` with progress markers and records implementation decisions in `plans/<name>/decisions.md`. Waits for user confirmation between tasks.

### After the Trilogy

```
tasks-to-code  →  release-checklist  →  plan-retrospective
   (build)            (ship)               (close)
```

4. **`release-checklist`** — Once implementation is complete, runs all quality gates, verifies P0 task completion, checks PRD success criteria, produces a deployment checklist, and generates a `CHANGELOG.md` entry. Issues a Go/No-Go verdict.

5. **`plan-retrospective`** — Formally closes the plan. Computes completion metrics and scope drift, captures lessons learned, produces `plans/<name>/retro.md`, and archives the entire plan folder to `plans/archive/<name>/`.

### Design-Driven Workflow

For UI-focused work, `ui-design-audit` plugs in before the planning trilogy:

```
ui-design-audit  →  create-a-prd  →  prd-to-tasks  →  tasks-to-code
   (findings)        (requirements)    (task list)       (build)
```

`ui-design-audit` outputs its findings directly in PRD format at `plans/ui-audit-<date>/prd.md`, making it immediately consumable by `prd-to-tasks`.

### Standalone Skills

These skills work independently and don't require a plan:

- **`code-review`** — Use any time you need a structured review of a diff, branch, or changed file set. Optionally reads `plans/<name>/tasks.md` to validate acceptance criteria if the change comes from a task.
- **`debug-and-fix`** — Use when something is broken. Works entirely from a bug report (symptom, steps to reproduce, expected vs. actual). Has no plan dependency.

---

## Skill Details

### `create-a-prd`

**Trigger phrases:** "write a PRD", "create requirements", "plan a feature", "scope a feature"

**What it produces:** `plans/<name>/prd.md` — a 10-section PRD with labeled requirements, user stories, phased implementation plan, testing strategy, and risk assessment.

**Key behaviors:**
- Runs codebase discovery before writing to align the PRD with existing tech stack and conventions
- Uses `FR-N`, `NFR-N`, `US-N`, `QG-N` labels on all requirements for traceability
- Self-validates completeness before presenting the draft
- Asks 2–4 focused clarifying questions; documents unresolved items as Open Questions

**References inside the skill:**
- `references/prd-schema.md` — full 10-section PRD structure
- `references/codebase-discovery.md` — shared codebase discovery checklist
- `references/quality-standards.md` — writing standards and completeness checklist

---

### `prd-to-tasks`

**Trigger phrases:** "break down a PRD", "generate a task list", "create tasks from requirements"

**What it produces:** `plans/<name>/tasks.md` — a hierarchical task list with dependency mapping, effort estimates, and progress tracking.

**Key behaviors:**
- Will not generate tasks from a PRD missing Goals, labeled requirements, acceptance criteria, implementation phases, or testing strategy — it asks you to fix the PRD first
- Traces every task back to a specific `FR-N`/`US-N`/`NFR-N` requirement
- Validates coverage before presenting: every PRD requirement must appear in at least one task
- Task count heuristic: 3–8 tasks per PRD phase, 1–2 tasks per functional requirement

**Status markers in `tasks.md`:**
| Marker | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[!]` | Blocked |
| `[-]` | Skipped |

---

### `tasks-to-code`

**Trigger phrases:** "implement the next task", "work on task N.M", "start coding", "pick up the next item"

**What it produces:** Code changes + updated `tasks.md` + `plans/<name>/decisions.md`

**Key behaviors:**
- Reads both `tasks.md` and `prd.md` before touching code — PRD is authoritative, task list is derivative
- Marks task `[~]` before starting, `[x]` only after all acceptance criteria pass and all quality gates pass
- Never chains tasks automatically — asks for confirmation after each one
- Records every non-obvious implementation decision in `decisions.md`
- Only implements what acceptance criteria require; notes future improvements in `decisions.md` instead

**References inside the skill:**
- `references/implementation-guide.md` — pattern-first implementation principles
- `references/decision-log.md` — decision recording format
- `references/verification-guide.md` — acceptance criteria and quality gate checklist

---

### `code-review`

**Trigger phrases:** "review this code", "review my changes", "do a code review", "check this PR"

**Accepts:** A diff, changed file list, branch description, or task reference

**What it produces:** Structured review with severity-tiered findings; optional `plans/<name>/review.md` for multi-round tracking

**Severity levels:**
| Marker | Meaning |
|--------|---------|
| 🔴 Blocking | Must fix before merge (correctness bugs, security, unmet acceptance criteria) |
| 🟡 Suggestion | Should fix but won't block merge |
| ⚪ Nit | Minor style/polish |
| ✅ Praise | Something done notably well |

**Key behaviors:**
- Understands the *why* (PRD task, bug fix, refactor?) before reading code
- Reviews against the project's own patterns, not generic preferences
- Supports re-reviews — checks blocking and suggestion items against updated code

---

### `debug-and-fix`

**Trigger phrases:** "there's a bug", "this is broken", "I'm getting an error", "this isn't working"

**Requires:** Symptom + steps to reproduce + expected vs. actual behavior

**What it produces:** Root-cause identified + minimal fix implemented + regression test added

**Workflow phases:**
1. Understand the bug (reproduce, characterize, read the error)
2. Isolate root cause using hypothesis-driven debugging (form hypotheses → elimination tests → document path)
3. Implement a minimal fix (no refactors, no new dependencies)
4. Verify (run quality gates, regression check, edge cases)
5. Add a regression test that fails on unfixed code
6. Report with structured bug fix summary

**Key rule:** A bug without a regression test is not fixed — the test is mandatory.

---

### `ui-design-audit`

**Trigger phrases:** "audit the UI", "check for design inconsistencies", "find loading state issues", "review component consistency"

**What it produces:** `plans/ui-audit-<date>/prd.md` — findings in PRD format, ready for `prd-to-tasks`

**Six audit dimensions** (work through in order, or scope to specific dimensions):
1. **Loading States** — spinners, skeletons, placeholders, empty states
2. **Spacing and Sizing** — padding, margin, gap, width, height
3. **Typography** — font families, sizes, weights, line heights
4. **Color and Theming** — brand colors, semantic colors, dark mode
5. **Interactive States** — hover, focus, active, disabled
6. **Animation and Motion** — transitions, entrance/exit animations

**Key behaviors:**
- Establishes the project's own design system as the baseline — audits against what the project has established, not external standards
- Groups systemic issues (e.g., "12 components all use `Loader2` directly instead of `Spinner`") as one finding, not 12
- Each finding maps to a severity: Critical → P0, Major → P1, Minor → P2

---

### `release-checklist`

**Trigger phrases:** "prepare a release", "we're ready to ship", "generate a changelog", "check if we're ready to deploy"

**Requires:** `plans/<name>/tasks.md` and `plans/<name>/prd.md`

**What it produces:** Go/No-Go verdict + deployment checklist + `CHANGELOG.md` entry

**Hard blocks (release cannot proceed):**
- Any P0 task not `[x]` complete
- Any failing quality gate (lint, typecheck, test, build — all must pass)
- Any unmet or unverified PRD success criterion

**Checklist covers:** pre-release gate results, deployment prerequisites, smoke test steps, rollback plan, post-release verification.

**After Go:** Prompts to invoke `plan-retrospective` to close out the plan.

---

### `plan-retrospective`

**Trigger phrases:** "close out a plan", "do a retro", "archive a plan", "wrap up a feature"

**Requires:** `plans/<name>/prd.md`, `plans/<name>/tasks.md`, optionally `plans/<name>/decisions.md`

**What it produces:** `plans/<name>/retro.md` → plan moved to `plans/archive/<name>/`

**Computes:**
- Completion rate (completed / (total − skipped))
- Requirement coverage (FR-N/US-N traced to completed tasks)
- Scope drift (tasks added without PRD backing; PRD requirements never tasked)

**Retro sections:** Summary, Metrics, What Was Built, Scope Drift, Key Decisions, What Worked Well, What to Improve, Open Items, Future Opportunities

**Key rule:** Does not archive without explicit user confirmation. Archiving is irreversible without a manual `mv`.

---

## Shared References

Several skills share reference documents to avoid duplication:

| Reference | Shared By |
|-----------|-----------|
| `create-a-prd/references/codebase-discovery.md` | `create-a-prd`, `prd-to-tasks`, `tasks-to-code`, `code-review`, `debug-and-fix` |
| `create-a-prd/references/prd-schema.md` | `create-a-prd`, `ui-design-audit` |
| `tasks-to-code/references/implementation-guide.md` | `tasks-to-code`, `debug-and-fix` |

---

## `plans/` Directory Convention

All planning artifacts live under a `plans/` directory at the project root:

```
plans/
├── active-feature/           # Active work
│   ├── prd.md
│   ├── tasks.md
│   ├── decisions.md
│   └── retro.md              # Added at close-out
└── archive/
    └── completed-feature/    # Archived after plan-retrospective
        ├── prd.md
        ├── tasks.md
        ├── decisions.md
        └── retro.md
```

Only active plans live in `plans/`. Completed plans move to `plans/archive/` — preserving the full history while keeping the working directory clean.
