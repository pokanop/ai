# Findings Format

How to classify performance findings, write them up, and (optionally) emit them as a
PRD. Consistent severity is what turns a performance review into a prioritized work
list rather than a wall of "this could be faster."

---

## Severity — user impact × frequency

Performance findings use the single shared
[severity scale](../../_shared/references/conventions.md#severity-and-priority) —
`🔴 Critical` / `🟡 Major` / `⚪ Minor`, mapping to `[P0]` / `[P1]` / `[P2]`. There is
no separate performance scale; this section is only the calibration for *what counts
as* Critical/Major/Minor when the finding is a performance gap.

Calibrate on two axes:

- **User impact** — how far past budget is the affected metric? Budget broken
  multiply, or the flow effectively unusable / crash-inducing (OOM, timeout) → high.
  Noticeably over budget → medium. Measurable waste the user cannot feel → low.
- **Frequency** — who hits it, how often? The primary flow, every session → high. A
  secondary flow or only-at-scale condition → medium. Rare paths, admin tools, one-off
  jobs → low.

| | Frequency: High | Frequency: Medium | Frequency: Low |
|---|---|---|---|
| **Impact: High** | 🔴 Critical | 🟡 Major | 🟡 Major |
| **Impact: Medium** | 🟡 Major | 🟡 Major | ⚪ Minor |
| **Impact: Low** | ⚪ Minor | ⚪ Minor | ⚪ Minor |

**Growth findings** are rated at their *projected* impact when the trajectory is
certain (table grows with users, algorithm is superlinear on user data) — an
unbounded query on the primary flow is Major *today* even if today's measurement
passes, because the trajectory is the evidence. Speculative scale ("if we ever go
viral") stays Minor.

**Unmeasured findings** (static analysis only — see
[measurement-guide.md](measurement-guide.md)) are capped at `🟡 Major`.

### 🔴 Critical — budget-breaking on a path users hit constantly. Fix before release.
- Cold launch / first load multiples over budget on the primary surface.
- An N+1 or missing index putting p95 of a core endpoint into seconds.
- A main-thread block that visibly freezes the UI during a common interaction.
- Memory growth that kills the app/process in a normal-length session.

**Ask:** "Does the user feel this every time, and is the budget clearly broken?" If
yes → Critical.

### 🟡 Major — real, felt waste; or certain-trajectory growth. Fix this cycle.
- A request waterfall adding hundreds of ms to a common screen.
- Unbounded queries / missing pagination on data that grows with usage.
- Bundle weight pushing load past budget on median connections.
- Missing timeouts that turn a dependency blip into a stalled feature.
- No caching layer where read traffic plainly warrants one.

### ⚪ Minor — measurable but not felt. Fix when adjacent work happens.
- Over-fetching that inflates payloads without moving the user metric.
- Optimizations on secondary/rare paths.
- Eager initialization of features most sessions never touch.
- Missing memoization where re-renders are wasteful but under budget.

> **Correctness outranks speed.** If a candidate remediation would trade correctness
> for performance (dropping validation, caching must-be-fresh data, racing writes),
> it is not a finding's remediation — it is an architecture decision. Route it to
> `prd-to-design` as an ADR.

---

## Writing a finding

Each finding records the **flow and metric** it affects, the **evidence**, the
severity, and a **remediation with its expected effect**. The expected effect is what
makes the finding verifiable after the fix.

```
🔴 Critical — N+1 query on the dashboard's project list

Flow / metric:   Dashboard first load; API p95.
Evidence:        GET /api/projects issues 1 + 47 queries (query log, seeded dev
                 DB: 48 round-trips, 1.9s server time). EXPLAIN shows per-row
                 lookups on tags with no index.
Why it grows:    Query count is linear in projects per user (median 47, p90 210).
Remediation:     Eager-load tags in the projects query (single JOIN) and add the
                 covering index from the EXPLAIN output.
Expected effect: 48 round-trips → 1–2; server time from ~1.9s to <100ms at
                 current volume. Verify by re-running the same seeded request.
```

**Group systemic issues.** If 9 endpoints share the missing-pagination pattern, that
is **one** finding with the instances listed — not 9 findings — exactly as
`ui-design-audit` and `security-review` group repeated instances. The fix is one
shared pattern, not 9 edits.

**Report the finding where the fix lives.** A slow screen caused by a waterfall
(dimension 2) feeding an N+1 (dimension 1) is two findings, cross-referenced in the
flow summary so the compound effect on the user metric is visible.

---

## Report structure

Lead with the summary, then the grouped findings:

1. **Baseline summary** — the metrics measured, their values vs. budgets, and where
   the budgets came from (NFRs, history, or adopted platform defaults).
2. **Counts by severity** — `2 🔴 / 5 🟡 / 6 ⚪`.
3. **Top findings** — the 3–5 items to fix first, ordered by user-felt impact.
4. **Findings by dimension** — the six dimensions, severity-ordered within each.
5. **Out of scope / Future Opportunities** — speculative tuning and optimizations
   below the felt threshold (no gold-plating in findings).

---

## Optional: PRD-compatible output

When the user wants remediation tracked, write the report as
`plans/performance-review-<date>/prd.md` in PRD format so it feeds
**design-to-tasks** — the same handoff `ui-design-audit` and `security-review` use.
Use the idea-to-prd PRD schema (linked from the skill's References) and adapt it:

- **Executive Summary** — the baseline vs. budgets and headline findings. The
  baseline numbers become the **success criteria**: each states metric, current
  value, target, and measurement conditions.
- **Goals / Non-Goals** — bring the scoped flows within budget; list flows and
  dimensions explicitly not reviewed.
- **Findings as Functional Requirements** — each finding becomes an `FR-N`: *"The
  [flow] shall [meet metric target] by [remediation]."* Map severity to priority with
  the canonical [severity↔priority mapping](../../_shared/references/conventions.md#severity-and-priority):
  `🔴 Critical → [P0]`, `🟡 Major → [P1]`, `⚪ Minor → [P2]`.
- **Non-Functional Requirements** — the budgets themselves as `NFR-N` (e.g. "API p95
  < 300ms", "cold launch < 2s") so they outlive this one remediation and future work
  is measured against them.
- **Testing Strategy** — re-measure each baseline under the same conditions after
  remediation; where practical, add a regression guard (a timing assertion, a bundle
  size check in CI, a query-count assertion) so the win doesn't silently erode.

Severity assignment uses the matrix above; the dimensions being scored come from
[performance-checklist.md](performance-checklist.md).
