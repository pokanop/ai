# Measurement Guide

How to establish the baseline that makes a performance review evidence-driven. The
rule the whole skill hangs on: **a finding without a measurement, a trace, or a
growth argument is a superstition** — and the review's job is to replace
superstitions with numbers.

---

## 1. Pick the user-visible metrics

Measure what the user waits on, in the scope under review:

| Surface | Primary metrics |
|---|---|
| Web app | First contentful paint, largest contentful paint, time to interactive, interaction latency, route-change time, bundle size |
| Mobile app | Cold/warm launch time, screen-transition time, frame rate / dropped frames (jank), memory footprint, battery drain |
| API / backend | Request latency p50 and **p95** (tail latency is what users complain about), error/timeout rate, throughput |
| Pipeline / job | End-to-end wall time, throughput per unit, peak memory |

Two or three metrics is enough — the ones the reported symptom or the launch gate
actually cares about. Averages hide the problem; prefer percentiles.

## 2. Measure with the stack's own tools

Use what the project (or its platform) already provides. Never install a heavyweight
profiling stack just for a review; the findings should be reproducible by anyone on
the project with what's already there.

- **Web**: the bundler's analyzer for bundle size (`--analyze`, `vite-bundle-visualizer`,
  `webpack-bundle-analyzer`); Lighthouse / browser performance panel for load and
  main-thread metrics; the network tab for waterfalls and payload sizes.
- **iOS**: Instruments (Time Profiler, Allocations, Leaks), `os_signpost` around suspect
  spans, Xcode Organizer's launch/hang metrics if the app ships.
- **Android**: Android Studio profilers, `Macrobenchmark` for launch, StrictMode for
  main-thread I/O, Perfetto traces.
- **Backend**: request timing from the framework's own logging/middleware; `EXPLAIN` /
  `EXPLAIN ANALYZE` on the hot queries; the ORM's query log to expose N+1s; language
  profilers (`pprof`, `perf`, `py-spy`, `clinic`, Instruments) on a representative run.
- **Any stack**: the test suite as a harness — a timing assertion around the hot path
  is a crude but reproducible measurement, and it later becomes the regression guard.

Record the *conditions* with the number: dataset size, machine, cold vs. warm. A
measurement without its conditions can't be compared against after remediation.

## 3. Set budgets

A number is only slow relative to a budget. Priority order for where budgets come from:

1. **The plan's NFRs** — if the PRD or `design.md` covering this area defines
   performance targets (`NFR-N`), those are the budgets. The review then doubles as an
   NFR verification pass, and violations trace straight back to requirements.
2. **The project's own history** — a regression against a previously-measured state
   ("search was 200ms two releases ago, is 1.4s now") is the strongest possible budget.
3. **Platform-standard defaults** — when the project defines nothing, adopt the
   platform's conventional targets and *say so in the report*: web vitals thresholds
   (LCP < 2.5s, interaction < 200ms), mobile launch < ~2s cold / instant warm,
   API p95 in the low hundreds of ms for interactive calls, 60fps (no dropped-frame
   clusters) for scrolling and animation.

Adopted defaults are a starting point for conversation, not gospel — an internal admin
tool and a consumer onboarding flow deserve different budgets, and the report should
right-size them.

## 4. When you can't measure

Sometimes the review runs where the app can't: no runnable environment, no production
data, no APM. The review can still proceed on **static evidence** — query-shape
analysis, bundle manifests, complexity arguments — under two rules:

- Label every such finding **unmeasured**, and cap its severity at `🟡 Major` (a
  Critical claim requires a number or a trace that shows the user-facing budget is
  broken).
- The first remediation task in any PRD emitted from an unmeasured review is
  *"establish the measurement"* — the fix cannot be verified otherwise.

**Growth arguments are the exception**: an unbounded query on a table that grows with
users, or an O(n²) on user-generated data, is a legitimate finding at any current
size. State the trajectory ("linear in orders per user, currently ~50, unbounded") —
that is the measurement.

## 5. Baseline → success criteria

Every measurement taken in Phase 1 has a second life: when the review is emitted as a
PRD, the baseline becomes the **success criteria** — "dashboard LCP from 4.1s to
< 2.5s on the standard dataset" — and re-measuring under the same conditions is the
**testing strategy**. Write measurements down precisely enough to be re-run by
whoever picks up the remediation tasks; that is what makes the audit → `design-to-tasks`
→ `tasks-to-code` handoff verifiable end to end.
