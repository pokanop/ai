---
name: performance-review
description: Perform a measurement-driven performance review of an application and produce a prioritized, severity-tiered findings report. Use when the user asks for a "performance review", "performance audit", says "why is it slow", "the app feels slow", "find bottlenecks", "optimize performance", "is it fast enough to launch", or wants a dedicated performance pass before shipping or after users report sluggishness. Establishes a baseline with real measurements, then sweeps six dimensions (data access and queries, network and payloads, rendering and responsiveness, memory and resources, concurrency and async, scalability posture). Complements code-review's per-change performance check with a standalone whole-system pass, and can emit a PRD-compatible report that feeds design-to-tasks.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Performance Review

## Purpose

`code-review` checks the performance of a *single change* as one dimension among several. That catches the N+1 query in the diff in front of you — but it never steps back to ask where the system actually spends its time, what the user actually waits on, or whether the architecture holds at 10× the data. Slowness that users feel is almost always systemic: an accumulation of individually-reasonable choices that no single diff review would flag.

This skill performs a **measurement-driven performance review**: it establishes what "slow" concretely means with a baseline measurement, then sweeps six dimensions of the system's performance posture — not line by line, but layer by layer. The output is a prioritized, severity-tiered findings report. Because it can be written in PRD format, the findings feed directly into **design-to-tasks** for remediation — the same handoff **ui-design-audit** and **security-review** use.

It is one of the suite's three audit skills, and shares their contract: standalone, whole-system, PRD-emitting. What `ui-design-audit` is to consistency and `security-review` is to posture, this skill is to speed.

## When to use this vs. `code-review`

| | `code-review` (performance dimension) | `performance-review` (this skill) |
|---|---|---|
| **Unit of work** | One diff / PR / changed file set | The whole application or a subsystem |
| **Question** | "Does *this change* introduce a performance problem?" | "Where does the *system* spend the user's time?" |
| **Trigger** | Every PR | Before launch; after "it feels slow" reports; when data volume grows; on request |
| **Finds** | An unbounded loop *in this diff* | The absence of pagination as a pattern; a request waterfall spanning three components |
| **Output** | Inline review feedback / `review.md` | A standalone findings report, optionally a PRD |

When a finding is line-level and tied to a specific recent change, it belongs to code-review. This skill owns the **systemic** view: hot paths, missing layers (caching, pagination, pooling), and architectural assumptions that stop holding as usage grows.

## Inputs

The skill works from whatever scope the user gives:

- **A whole application** — "performance review the API", "why does the app feel slow?"
- **A subsystem or flow** — "audit the search flow", "the dashboard takes forever to load"
- **A launch gate** — "is the new sync feature fast enough to ship?"

If the scope is open-ended, propose a boundary around what users feel most — usually startup/first load, the highest-traffic flow, or the reported-slow path — and confirm before sweeping. If the user reports a *specific* slow interaction, treat it as the primary trace target: profile that path first, then widen.

## Workflow

### Phase 1: Baseline — measure before you look

A performance review without measurements is a list of superstitions. Before reading code, establish the baseline using [references/measurement-guide.md](references/measurement-guide.md):

1. **Define the user-visible metrics for this scope** — what does the user wait on? Page load / route change (web), app launch / screen transition (mobile), request latency p50/p95 (API), job throughput (pipeline).
2. **Measure what is measurable now** — run the stack's own tools: timing a request with the test suite or a local run, build-output bundle analysis, `EXPLAIN` on suspect queries, existing APM/profiler data if the project has it. Record numbers, not impressions.
3. **Set or adopt budgets** — if the PRD or `design.md` for the area defines performance NFRs (`NFR-N`), those are the budgets. Otherwise adopt the platform's standard budgets (see [references/measurement-guide.md](references/measurement-guide.md)) and say so.
4. **If nothing can be measured** — no way to run the app, no profiling data — the review can still proceed on static analysis, but every finding must be labeled *unmeasured* and severity capped at Major. Say this limitation up front.

### Phase 2: Codebase and Stack Discovery

Performance mechanics are stack-specific. Run targeted discovery (see [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md)) to learn:

- The stack and platform — a Swift/iOS app, a Kotlin/Android app, and a Node/Go/Rust backend have different hot paths (main thread vs. event loop vs. goroutines) and different tools.
- The data layer — ORM or raw queries, existing indexes, migration history (indexes are where schemas rot).
- The delivery path — bundler and build output (web), app size and launch profile (mobile), serialization format and payload shapes (API).
- What already exists — caching layers, pagination helpers, connection pools, lazy-loading patterns. Findings should extend what exists, not invent parallel machinery.

### Phase 3: Performance Sweep

Work through the six dimensions in [references/performance-checklist.md](references/performance-checklist.md), evaluating each against the baseline from Phase 1. The dimensions are posture-level, not line-level:

1. **Data Access & Queries** — N+1 patterns, missing indexes on filtered/joined columns, over-fetching, unbounded result sets, missing pagination.
2. **Network & Payloads** — request waterfalls, chatty APIs, uncompressed or oversized payloads, missing cache headers, bundle size and code splitting, unoptimized images/assets.
3. **Rendering & Responsiveness** — main-thread blocking, unnecessary re-renders, layout thrash, missing list virtualization, startup/launch time, perceived performance (does something appear within the budget?).
4. **Memory & Resources** — leaks and retention cycles, unbounded caches and queues, resource handles never released, battery and background work on mobile.
5. **Concurrency & Async** — serial awaits that could be parallel, blocking I/O on hot paths, lock contention, missing timeouts letting slow dependencies stall everything.
6. **Scalability Posture** — will it hold at 10× the data and users? Caching strategy, connection pooling, queue backpressure, cold starts, growth assumptions baked into algorithms (the O(n²) that is fine at n=100).

Confirm a suspected issue is **on a path users actually hit** before rating it — a slow function nobody calls is noise. Trace from the user-visible metric down: what does the slow flow execute, and where does the time go?

### Phase 4: Classify Severity

Every finding carries a severity from the single shared [severity scale](../_shared/references/conventions.md#severity-and-priority) — `🔴 Critical` / `🟡 Major` / `⚪ Minor`, mapping to `[P0]` / `[P1]` / `[P2]`. Calibrate by **user impact × frequency** using [references/findings-format.md](references/findings-format.md): a budget-breaking delay on a high-traffic path is Critical; real waste on a secondary path is Major; an optimization opportunity with no felt impact is Minor. Every severity claim cites its evidence — a measurement, a trace, or a complexity argument about growth.

### Phase 5: Produce the Findings Report

Structure all findings using [references/findings-format.md](references/findings-format.md): group by dimension, then by severity. Each finding records the affected flow and metric, the evidence, the severity, and a concrete remediation with its expected effect.

Lead with a summary: the baseline numbers, counts by severity, and the top findings to fix first — ordered by user-felt impact, not by how interesting the engineering is. Then, if the user wants remediation tracked, offer to write the report as `plans/performance-review-<date>/prd.md` in PRD format (using [../idea-to-prd/references/prd-schema.md](../idea-to-prd/references/prd-schema.md)) so it hands off to **design-to-tasks**. Baseline measurements become the PRD's success criteria — remediation is verified by re-measuring, not by code inspection.

## Key Principles

**Measure first; never optimize on faith.** Every finding cites evidence: a number, a trace, a query plan, or a growth argument. "This looks slow" is not a finding. The cheapest performance win is deleting an optimization someone made without measuring.

**The user's clock is the only clock.** Severity follows what users feel — latency on paths they hit, at the frequency they hit them. A 10× speedup of a nightly job nobody waits on is a Minor finding no matter how satisfying.

**Complement, don't duplicate, `code-review`.** Line-level issues in a specific recent change belong to code-review's performance dimension. This skill owns the systemic view. When they overlap, point at code-review rather than re-checking the same line.

**Remediation states its expected effect.** "Add an index on `orders.user_id`" is half a remediation; "…which removes the table scan and should take the query from ~800ms to single-digit ms at current volume" is a finding someone can verify after fixing — and becomes the PRD success criterion.

**Fast-but-wrong is wrong.** Never recommend a change that trades correctness for speed (dropping validation, racing writes, caching what must be fresh). If a consistency trade-off is genuinely on the table, it is an architecture decision — route it to `prd-to-design` as an ADR, not a performance fix.

**No gold-plating.** Recommend the optimization the measured problem warrants — not every optimization that exists. Speculative tuning goes in "Future Opportunities," not findings.

## References

- [references/performance-checklist.md](references/performance-checklist.md) — The six-dimension sweep with per-stack signals to look for
- [references/measurement-guide.md](references/measurement-guide.md) — Establishing baselines, platform budgets, and per-stack measurement tools
- [references/findings-format.md](references/findings-format.md) — Severity calibration (user impact × frequency), finding format, and the PRD-compatible report schema
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — Canonical severity↔priority scale, lifecycle, and other shared conventions
- [../idea-to-prd/references/prd-schema.md](../idea-to-prd/references/prd-schema.md) — PRD structure for the findings report output
- [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md) — Codebase discovery checklist (shared reference)
