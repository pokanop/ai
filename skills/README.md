# Agent Skills

A collection of structured, project-aware agent skills for software development workflows. Each skill follows the [Agent Skills specification](https://agentskills.io/specification) and can be installed via the [skills.sh](https://skills.sh) registry.

---

## Available Skills

| Skill | Purpose | Use When |
|-------|---------|-----------|
| [`next-step`](next-step/) | Report plan status and route to the right skill | Resuming work, checking status, or unsure which skill fits |
| [`idea-to-prd`](idea-to-prd/) | Write a Product Requirements Document | Starting a new feature or initiative |
| [`prd-to-design`](prd-to-design/) | Turn a PRD into a technical design + ADRs | Architecting a non-trivial feature before tasks |
| [`design-to-tasks`](design-to-tasks/) | Break a design (or PRD) into an actionable task list | Planning implementation from a design or PRD |
| [`tasks-to-code`](tasks-to-code/) | Implement tasks one at a time | Executing an approved task list |
| [`code-review`](code-review/) | Structured review of code changes | Reviewing a PR, diff, or set of changed files |
| [`debug-and-fix`](debug-and-fix/) | Diagnose bugs and add regression tests | Something is broken and needs root-cause analysis |
| [`refactor`](refactor/) | Restructure code without changing behavior | Cleaning up code or executing a deferred improvement |
| [`ui-design-audit`](ui-design-audit/) | Sweep UI for design system inconsistencies | Auditing components before a design cleanup |
| [`security-review`](security-review/) | Lightweight threat model + OWASP-style security sweep | Before launching auth/payments; a dedicated security pass |
| [`performance-review`](performance-review/) | Measurement-driven performance sweep | Before launch; when the app feels slow; when data volume grows |
| [`release-checklist`](release-checklist/) | Go/no-go assessment before shipping | Preparing to deploy a completed plan |
| [`plan-retrospective`](plan-retrospective/) | Close out a plan with metrics and lessons | Wrapping up a completed feature |

The lifecycle these skills form — and the routing table for classifying any incoming request — is defined once in [shared conventions](_shared/references/conventions.md#the-development-lifecycle).

> **Renamed (June 2026):** `create-a-prd` is now [`idea-to-prd`](idea-to-prd/) and `prd-to-tasks` is now [`design-to-tasks`](design-to-tasks/), so the build-pipeline skills read `input-to-output` and the new [`prd-to-design`](prd-to-design/) step slots in between. Existing installs of the old slugs keep working; new installs and links use the new names.

---

## Recommended Order of Operations

These skills are designed to chain together into a complete software development lifecycle — the canonical diagram and routing table live in [shared conventions](_shared/references/conventions.md#the-development-lifecycle), and the [`next-step`](next-step/) skill navigates it for you. The primary workflows:

### Build Pipeline (Feature Development)

The skill names encode the pipeline: each `X-to-Y` transform names its input and output, so the run order is self-evident.

```
idea-to-prd  →  prd-to-design  →  design-to-tasks  →  tasks-to-code
  (what/why)      (architecture)     (task list)         (build)
```

The build pipeline covers a feature from idea to shipped code:

1. **`idea-to-prd`** — Turns a product idea into a structured PRD at `plans/<name>/prd.md`. Includes codebase discovery, user story writing, requirement labeling (`FR-N`, `US-N`, `NFR-N`, `QG-N`), phased implementation planning, and testing strategy.

2. **`prd-to-design`** *(optional)* — Turns the PRD into a technical design at `plans/<name>/design.md` plus ADRs under `plans/<name>/adr/`: component boundaries, API/data contracts, sequence flows, and key decisions with rationale. Warranted for non-trivial features; **skip it for simple ones** and go straight to `design-to-tasks`.

3. **`design-to-tasks`** — Reads the design (or the PRD when no design exists) and generates a comprehensive, traceable task list at `plans/<name>/tasks.md`. Every task traces back to a specific PRD requirement. Tasks are sized (S/M/L/XL), prioritized (P0/P1/P2), and have explicit acceptance criteria.

4. **`tasks-to-code`** — Implements tasks one at a time, following the project's existing patterns and the design when present. Updates `tasks.md` with progress markers and records implementation decisions in `plans/<name>/decisions.md`. Waits for user confirmation between tasks.

### After the Pipeline

```
tasks-to-code  ⇄  code-review  →  release-checklist  →  plan-retrospective
   (build)         (quality)          (ship)               (close)
```

5. **`code-review`** — Run per task or per phase during implementation, and always before release. Reviews changes against the project's conventions, the task's acceptance criteria, and the plan's `design.md`/ADRs when they exist. Unresolved `🔴 Blocking` findings in `review.md` hard-block the release.

6. **`release-checklist`** — Once implementation is complete, runs all quality gates, verifies P0 task completion and review-finding resolution, checks PRD success criteria, produces a deployment checklist, and generates a `CHANGELOG.md` entry. Issues a Go/No-Go verdict.

7. **`plan-retrospective`** — Formally closes the plan. Computes completion metrics and scope drift (via the deterministic `_shared/scripts/` plan tooling), captures lessons learned and ADR outcomes, produces `plans/<name>/retro.md`, and archives the entire plan folder to `plans/archive/<name>/`.

### Worked Example

See one small feature — a persisted dark-mode toggle — carried through the entire pipeline as a set of golden artifacts (PRD → design + ADR → tasks → decisions → review → release → retro): **[examples/dark-mode-toggle](https://github.com/pokanop/ai/tree/main/examples/dark-mode-toggle)**.

### Audit Workflows

Three audit skills share one contract — standalone, whole-system, severity-tiered, and **PRD-emitting** — so their findings enter the build pipeline directly at `design-to-tasks`, with no separate `idea-to-prd` pass:

```
ui-design-audit / security-review / performance-review  →  design-to-tasks  →  tasks-to-code
              (findings as a PRD)                            (task list)         (build)
```

| Audit | Question it answers | Findings PRD |
|-------|--------------------|--------------|
| `ui-design-audit` | Is the UI consistent with the project's own design system? | `plans/ui-audit-<date>/prd.md` |
| `security-review` | Is the system's security posture sound? | `plans/security-review-<date>/prd.md` |
| `performance-review` | Where does the system spend the user's time? | `plans/performance-review-<date>/prd.md` |

Each complements the matching per-change dimension in `code-review` (which checks one diff) with a whole-system pass (which checks the posture).

### Standalone Skills

These skills work independently and don't require a plan:

- **`next-step`** — The suite's front door. Reads the `plans/` directory, reports where every plan sits in the lifecycle (using the deterministic `_shared/scripts/` plan tooling), and routes any request to the right skill via the canonical routing table.
- **`code-review`** — Use any time you need a structured review of a diff, branch, or changed file set. Optionally reads `plans/<name>/tasks.md` to validate acceptance criteria if the change comes from a task, and `design.md`/ADRs for architecture conformance.
- **`debug-and-fix`** — Use when something is broken. Works entirely from a bug report (symptom, steps to reproduce, expected vs. actual). Has no plan dependency.
- **`refactor`** — Use when code needs restructuring without any behavior change. Closes the loop on the suite's no-gold-plating discipline: it executes the structural improvements that `tasks-to-code`, `code-review`, and `plan-retrospective` defer into `decisions.md` / `retro.md` "Future Opportunities". Has no plan dependency.

---

## Skill Details

### `next-step`

**Trigger phrases:** "what's next", "where were we", "resume work", "status of the plan", "which skill should I use", "where do I start"

**What it produces:** A plan-status report (stage + computed progress per active plan) and a single routed recommendation: which skill, on which plan, and why

**Key behaviors:**
- Detects each plan's lifecycle stage from the artifacts on disk and the task markers — never from memory
- Runs `plan-metrics.py` / `plan-validate.py` for computed progress instead of estimates
- Routes ambiguous requests via the canonical routing table; splits compound requests ("fix the crash and add export") into separately-routed parts
- Blockers outrank progress: a `[!]` task, failing gate, or unresolved `🔴 Blocking` review finding is always the recommended next step
- Read-only — orients and hands off; never performs the routed skill's work itself

---

### `idea-to-prd`

**Trigger phrases:** "idea to prd", "write a PRD", "create requirements", "plan a feature", "scope a feature"

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

### `prd-to-design`

**Trigger phrases:** "prd to design", "design the architecture", "write an ADR", "technical design", "system design"

**What it produces:** `plans/<name>/design.md` — component boundaries, API/data contracts, sequence flows, and a key-decisions index — plus one `plans/<name>/adr/NNNN-*.md` per significant decision.

**Optional step.** Use it for non-trivial features where the architecture isn't obvious or is hard to reverse; skip it for simple ones and hand the PRD straight to `design-to-tasks`.

**Key behaviors:**
- Designs to the contract level (interfaces, boundaries, data ownership), not line-level code
- Captures each significant or hard-to-reverse decision as an ADR with its rejected alternatives
- Traces every component back to an `FR-N`; addresses every `NFR-N` with a structural choice
- Never modifies the PRD — surfaces requirement gaps back to `idea-to-prd` instead

**References inside the skill:**
- `references/design-schema.md` — full design-document structure
- `references/adr-template.md` — ADR template, numbering, and status lifecycle
- `references/tradeoff-rubric.md` — evaluating alternatives and when a choice warrants an ADR

---

### `design-to-tasks`

**Trigger phrases:** "design to tasks", "create tasks from a design", "break down a PRD", "generate a task list", "create tasks from requirements"

**What it produces:** `plans/<name>/tasks.md` — a hierarchical task list with dependency mapping, effort estimates, and progress tracking.

**Key behaviors:**
- Reads `design.md` as the primary input when present and **falls back to `prd.md`** when no design exists, so simple features still go PRD→tasks
- Will not generate tasks from a PRD missing Goals, labeled requirements, acceptance criteria, implementation phases, or testing strategy — it asks you to fix the PRD first
- Traces every task back to a specific `FR-N`/`US-N`/`NFR-N` requirement; the PRD stays authoritative for traceability
- Validates coverage before presenting: every PRD requirement must appear in at least one task
- Task count heuristic: 3–8 tasks per PRD phase, 1–2 tasks per functional requirement

**Status markers in `tasks.md`:** `[ ]` Not started, `[~]` In progress, `[x]` Completed, `[!]` Blocked, `[-]` Skipped — defined in [shared conventions](_shared/references/conventions.md#task-status-markers).

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

**Severity levels:** `🔴 Blocking`, `🟡 Suggestion`, `⚪ Nit` — the code-review disposition names for the single [severity↔priority scale](_shared/references/conventions.md#severity-and-priority) (Critical/Major/Minor → P0/P1/P2) — plus `✅ Praise`, a positive callout that is not a severity.

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

### `refactor`

**Trigger phrases:** "refactor this", "clean up this code", "reduce duplication", "extract a function", "simplify this", "pay down tech debt"

**Accepts:** A scope-boxed target + a structural goal — often a deferred entry from a `decisions.md` / `retro.md` **Future Opportunities** list

**What it produces:** Restructured code with identical behavior + a summary of the structural changes (no behavior change). No plan required; optionally records follow-ups in `decisions.md`.

**The contract:** *Tests stay green, behavior unchanged.* Same tests pass before and after, no test is modified to accommodate a change, the public surface is identical, and quality gates stay green throughout.

**Workflow phases:**
1. Scope the refactor (box it; triage refactor vs. feature vs. bug)
2. Establish the safety net (characterization tests **first** — pin current behavior)
3. Refactor in small, behavior-preserving steps (one named transformation at a time; tests green after each)
4. Verify behavior is unchanged (all quality gates; confirm no test was modified to pass)
5. Report the structural changes

**Key behaviors:**
- Behavior-preserving only — new behavior routes to `idea-to-prd`, bug fixes route to `debug-and-fix`
- Characterization-tests-first: never restructures behavior that isn't under test
- Scope-boxed recursively — improvements noticed mid-refactor become new Future Opportunities, not scope creep

**References inside the skill:**
- `references/intake-and-scope.md` — consuming Future Opportunities, triage, and scope-boxing
- `references/safety-net.md` — characterization-tests-first methodology and golden-master testing
- `references/refactoring-catalog.md` — named behavior-preserving transformations and mechanics
- `references/behavior-preservation.md` — verifying behavior is unchanged

---

### `ui-design-audit`

**Trigger phrases:** "audit the UI", "check for design inconsistencies", "find loading state issues", "review component consistency"

**What it produces:** `plans/ui-audit-<date>/prd.md` — findings in PRD format, ready for `design-to-tasks`

**Seven audit dimensions** (work through in order, or scope to specific dimensions):
1. **Loading States** — spinners, skeletons, placeholders, empty states
2. **Spacing and Sizing** — padding, margin, gap, width, height
3. **Typography** — font families, sizes, weights, line heights
4. **Color and Theming** — brand colors, semantic colors, dark mode
5. **Interactive States** — hover, focus, active, disabled
6. **Animation and Motion** — transitions, entrance/exit animations
7. **Accessibility** — WCAG 2.1 AA contrast, semantic HTML, ARIA, keyboard/focus, screen-reader labels, forms, reduced motion

**Key behaviors:**
- Establishes the project's own design system as the baseline — audits against what the project has established, not external standards
- Groups systemic issues (e.g., "12 components all use `Loader2` directly instead of `Spinner`") as one finding, not 12
- Each finding maps to a severity on the shared [severity↔priority scale](_shared/references/conventions.md#severity-and-priority): 🔴 Critical → P0, 🟡 Major → P1, ⚪ Minor → P2

---

### `security-review`

**Trigger phrases:** "do a security review", "threat model this", "run a security audit", "check for vulnerabilities", "review the auth flow", "is this safe to launch"

**What it produces:** A prioritized, severity-tiered findings report; optionally `plans/security-review-<date>/prd.md` in PRD format, ready for `design-to-tasks`

**Approach** — a lightweight threat model, not a pen test:
1. **Asset & trust-boundary inventory** — what is worth protecting, where untrusted input enters, and where the boundaries are
2. **Six-dimension sweep** — Authentication & Authorization, Input Validation & Injection, Secrets & Transport, Dependencies & Known CVEs, Security-Event Logging, Rate Limiting & Abuse Resistance

**Key behaviors:**
- **Complements `code-review` instead of duplicating it** — code-review checks the security of one diff; security-review assesses the whole system's posture (missing layers, unmodeled boundaries) and defers line-level diff issues back to code-review
- Severity is calibrated by exploitability × impact on the shared [severity↔priority scale](_shared/references/conventions.md#severity-and-priority): 🔴 Critical → P0, 🟡 Major → P1, ⚪ Minor → P2
- The security baseline (OWASP / the stack's guidance) holds even when a weakness is applied consistently — like accessibility in `ui-design-audit`
- Redacts secrets and never runs live exploits — it surfaces work, it does not attack the system

---

### `performance-review`

**Trigger phrases:** "performance review", "performance audit", "why is it slow", "find bottlenecks", "optimize performance", "is it fast enough to launch"

**What it produces:** A prioritized, severity-tiered findings report with baseline measurements; optionally `plans/performance-review-<date>/prd.md` in PRD format, ready for `design-to-tasks`

**Approach** — measurement-driven, never optimize on faith:
1. **Baseline** — define the user-visible metrics for the scope, measure with the stack's own tools, set budgets (plan NFRs → project history → platform defaults)
2. **Six-dimension sweep** — Data Access & Queries, Network & Payloads, Rendering & Responsiveness, Memory & Resources, Concurrency & Async, Scalability Posture

**Key behaviors:**
- **Complements `code-review` instead of duplicating it** — code-review checks the performance of one diff; performance-review assesses where the whole system spends the user's time
- Severity is calibrated by user impact × frequency on the shared [severity↔priority scale](_shared/references/conventions.md#severity-and-priority); every severity claim cites a measurement, trace, or growth argument
- Baseline measurements become PRD success criteria — remediation is verified by re-measuring
- Never trades correctness for speed; consistency trade-offs route to `prd-to-design` as ADRs

---

### `release-checklist`

**Trigger phrases:** "prepare a release", "we're ready to ship", "generate a changelog", "check if we're ready to deploy"

**Requires:** `plans/<name>/tasks.md` and `plans/<name>/prd.md`; reads `review.md` and `decisions.md` when present

**What it produces:** Go/No-Go verdict + deployment checklist + `CHANGELOG.md` entry

**Hard blocks (release cannot proceed):**
- Any P0 task not `[x]` complete
- Any failing quality gate (lint, typecheck, test, build — all must pass)
- Any unmet or unverified PRD success criterion
- Any unresolved `🔴 Blocking` finding in `review.md`

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
| `_shared/references/conventions.md` | **All skills** — the lifecycle and routing table, status markers, priority, severity↔priority, effort sizes, labels, and the `plans/` layout |
| `_shared/scripts/` (`plan-metrics.py`, `plan-validate.py`) | `design-to-tasks` (post-generation validation), `tasks-to-code` (statistics), `release-checklist` (completion assessment), `plan-retrospective` (metrics), `next-step` (status) |
| `idea-to-prd/references/codebase-discovery.md` | `idea-to-prd`, `prd-to-design`, `design-to-tasks`, `tasks-to-code`, `code-review`, `debug-and-fix`, `refactor`, `security-review`, `performance-review` |
| `idea-to-prd/references/prd-schema.md` | `idea-to-prd`, `ui-design-audit`, `security-review`, `performance-review` |
| `code-review/references/review-checklist.md` | `code-review`, `security-review` (defers line-level diff checks to it) |
| `tasks-to-code/references/implementation-guide.md` | `tasks-to-code`, `debug-and-fix`, `refactor` |

---

## `plans/` Directory Convention

All planning artifacts live in a per-initiative folder under `plans/`; completed plans move to `plans/archive/`, preserving full history while keeping the working directory clean. The canonical layout — which skill creates each file, and the active → archive lifecycle — is defined in [`_shared/references/conventions.md`](_shared/references/conventions.md#the-plans-directory).
