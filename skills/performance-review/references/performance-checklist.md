# Performance Checklist

The six-dimension sweep. Work through each dimension in scope, evaluating against the
baseline from Phase 1. Every dimension lists the *posture questions* first — the
systemic gaps no single diff review would catch — then concrete signals to look for.
Findings must sit on a path users actually hit; trace from the user-visible metric
down, never from "this code looks slow" up.

---

## 1. Data Access & Queries

**Posture questions:** Is there a pagination pattern, or does every list endpoint
return everything? Are indexes maintained as query patterns evolve? Does the ORM hide
per-row queries?

Signals:

- **N+1 queries** — a loop (or ORM relation access) issuing one query per row.
  Fetching 50 orders then 50 customers is the classic; ORMs make it invisible in code
  and obvious in query logs. Look for relation access inside iteration; confirm with
  the query log or an `EXPLAIN`-level trace.
- **Missing indexes** — columns used in `WHERE`, `JOIN`, `ORDER BY` on growing tables
  without an index. Check migrations against the actual query patterns; run `EXPLAIN`
  on the hot queries from Phase 1.
- **Over-fetching** — `SELECT *` (or full-document reads) feeding a response that uses
  three fields; loading full relations to render a count.
- **Unbounded result sets** — queries with no `LIMIT` on tables that grow with usage.
  Fine at launch, a timeout at month six. This is a growth argument even when today's
  measurement looks fine.
- **Chatty transactions** — many round-trips inside one request where a batch or join
  would do; N sequential `INSERT`s instead of one bulk write.

## 2. Network & Payloads

**Posture questions:** How many round-trips does the primary flow take? Is anything
cached at the HTTP layer? Does payload size grow with data volume?

Signals:

- **Request waterfalls** — request B waits on response A when both could start
  together; serial fetches across components that each "own" their data. Visible in
  the network tab / trace as a staircase.
- **Chatty APIs** — a screen that needs 6 calls to render; missing batch endpoints for
  list+detail patterns.
- **Payload bloat** — uncompressed responses (no gzip/brotli), full objects where
  summaries would do, base64 blobs inside JSON.
- **Missing HTTP caching** — no `Cache-Control`/`ETag` on static or slow-changing
  resources; every session re-downloading the same data.
- **Bundle size (web)** — no code splitting, heavyweight dependencies for trivial
  needs, dev-only code in production builds. Measure with the bundler's analyzer;
  compare against the budget.
- **Asset weight** — unoptimized images (wrong format, no responsive sizes), fonts
  blocking first paint, videos autoloading off-screen.

## 3. Rendering & Responsiveness

**Posture questions:** What blocks the main thread? Is there a perceived-performance
strategy (skeletons, optimistic updates), or does the UI freeze until data lands?

Signals:

- **Main-thread blocking** — synchronous parsing/crypto/layout work on the UI thread
  (web: long tasks in the profiler; iOS/Android: jank warnings, dropped-frame
  metrics).
- **Unnecessary re-renders** — components re-rendering on unrelated state changes;
  missing memoization on expensive subtrees; state held too high in the tree.
- **Layout thrash** — interleaved reads and writes of layout properties forcing
  repeated reflow.
- **Missing list virtualization** — rendering thousands of rows when a viewport shows
  twenty. Any unbounded list UI over a growing dataset.
- **Startup / launch time** — everything initialized eagerly at boot; work that could
  be deferred until first use running before first paint/first frame.
- **Perceived performance** — nothing on screen while loading (pairs with
  `ui-design-audit`'s Loading States dimension: that skill checks consistency, this
  one checks the time-to-something-visible against the budget).

## 4. Memory & Resources

**Posture questions:** What grows without bound? What is never released? On mobile:
what runs when the user isn't looking?

Signals:

- **Leaks and retention** — listeners/observers registered but never removed;
  closures retaining large objects; caches keyed by ever-growing ids with no
  eviction. (iOS: retain cycles without `weak`; JS: detached DOM trees; long-lived
  maps.)
- **Unbounded caches and queues** — any in-memory collection that only ever grows;
  "cache" without a max size or TTL is a leak with a nicer name.
- **Handle leaks** — connections, file descriptors, subscriptions opened per-request
  and not reliably closed on error paths.
- **Battery and background work (mobile)** — timers and polls running in background,
  location/sensor use beyond need, sync loops that never back off.
- **Resource-heavy hot paths** — allocations inside tight loops, repeated
  serialization of the same object, logging large payloads at info level.

## 5. Concurrency & Async

**Posture questions:** Does independent work actually run concurrently? What happens
when a dependency is slow — does the system degrade or seize?

Signals:

- **Serial awaits** — sequential `await`s (or completion-handler chains) on
  independent operations that could run in parallel (`Promise.all`, task groups,
  `async let`).
- **Blocking I/O on hot paths** — synchronous file/network/DB calls on the request
  path or UI thread.
- **Missing timeouts** — outbound calls with no timeout, letting one slow dependency
  stall every caller; no circuit-breaking or fallback on flaky externals.
- **Lock contention** — a coarse lock (or a single-writer table/row) serializing what
  should be concurrent; connection pools sized at 1× default under real concurrency.
- **Thundering herds** — cache expiry or retry logic that synchronizes clients into
  simultaneous stampedes; retries without jitter/backoff.

## 6. Scalability Posture

**Posture questions:** What assumptions break at 10× the data, users, or traffic?
This dimension is mostly *growth arguments* — the code is fine today and measurably
wrong later, so severity leans on trajectory, not current numbers.

Signals:

- **Algorithmic growth** — the O(n²) comparison, the in-memory sort of a table, the
  "load all then filter" pattern. Fine at n=100; state at what n it breaks.
- **Caching strategy** — no caching layer where read traffic dwarfs writes; or its
  inverse, cache-everything with no invalidation story (a correctness risk — flag it,
  route the design to `prd-to-design`).
- **Connection pooling** — per-request connections to DBs/services; pools that don't
  match deployment concurrency.
- **Queue backpressure** — producers with no bound or shedding when consumers fall
  behind; retry storms amplifying incidents.
- **Cold starts** — serverless/container start time on the user path; heavyweight
  init that re-runs per instance.
- **Data-volume assumptions** — full-table scans in scheduled jobs, exports built in
  memory, pagination by `OFFSET` on large tables.

---

## Cross-dimension rule

The user-felt symptom usually spans dimensions ("dashboard is slow" = one waterfall +
one N+1 + one oversized payload). Report the finding where the *fix* lives, and group
by flow in the summary so the reader sees the compound effect on the metric they care
about.
