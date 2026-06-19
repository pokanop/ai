# Architecture Decision Record (ADR) Template

An ADR captures one significant decision: the context that forced it, what was chosen, and what was given up. The design's [Key Decisions](design-schema.md) table indexes them; each ADR holds the rationale.

## File and numbering convention

- One decision per file, at `plans/<name>/adr/NNNN-short-title.md`.
- `NNNN` is a zero-padded, monotonically increasing integer: `0001`, `0002`, … Numbers are never reused, even after an ADR is superseded — the gap is the history.
- `short-title` is a lowercase, dasherized summary of the decision (`0001-storage-engine.md`, `0002-sync-model.md`).

## When a decision warrants an ADR

Write an ADR when **any** of these holds:

- The decision is **hard to reverse** (a one-way door — storage engine, public API shape, auth model, sync strategy).
- There were **reasonable alternatives** that a maintainer might later ask "why not that instead?"
- The decision **shapes multiple components** or a cross-cutting concern.
- The choice **trades off** against a non-functional requirement (cost vs. latency, simplicity vs. flexibility).

Skip the ADR for reversible, low-stakes, obvious choices — record those as a one-line note in the design's Key Decisions table instead. Use the [tradeoff-rubric.md](tradeoff-rubric.md) to decide and to weigh the alternatives.

## Template

```markdown
# ADR NNNN: <decision title>

- **Status**: Proposed | Accepted | Superseded by ADR-NNNN | Deprecated
- **Date**: YYYY-MM-DD
- **Deciders**: <who made the call>
- **Requirements**: <FR-N / NFR-N this decision serves>

## Context

The forces at play: the requirement or constraint that forces a decision, the
relevant facts about the existing system, and what makes this non-obvious.
State the problem, not the solution. One who disagrees with the decision should
still agree with the context.

## Decision

The choice, stated in active voice: "We will use …". Be specific and
unambiguous — this is the sentence the design and the tasks build on.

## Alternatives Considered

For each real alternative (not strawmen):

- **<Option>** — what it is, its main pro, and the specific reason it was
  rejected for this context. Score them with the trade-off rubric when the
  call is close.

## Consequences

- **Positive**: what this buys us.
- **Negative / costs**: what we give up or take on (new dependency, more ops
  surface, a migration). Name them honestly — an ADR with no downsides is
  hiding one.
- **Follow-ups**: work this decision creates that `design-to-tasks` must turn
  into tasks (a migration, a spike, a guardrail).
```

## Status lifecycle

- **Proposed** — drafted, under review.
- **Accepted** — the decision is in force; the design and tasks may rely on it.
- **Superseded by ADR-NNNN** — a later ADR replaced it. Do not edit the old decision; write a new ADR and link back. The superseded record stays as history.
- **Deprecated** — no longer relevant and not replaced (the feature was cut).

Keep accepted ADRs immutable. Changing your mind means a new ADR that supersedes the old one — that chain is the value.

## Example

```markdown
# ADR 0001: Storage engine for the widget service

- **Status**: Accepted
- **Date**: 2026-06-19
- **Deciders**: Eng team
- **Requirements**: FR-2, NFR-1 (p95 read < 50ms), NFR-4 (flexible widget schema)

## Context

Widgets have a small fixed core and a large, caller-defined set of optional
attributes that changes often. We already run Postgres in production; adding a
second datastore adds ops burden the team has no appetite for.

## Decision

We will store widgets in Postgres, with the fixed columns typed and the
variable attributes in a single JSONB column.

## Alternatives Considered

- **A dedicated document store (MongoDB)** — natural fit for variable schema,
  but a new datastore to run, back up, and monitor. Rejected: ops cost
  outweighs the schema convenience at our scale.
- **A key/value column table (EAV)** — stays in Postgres but makes queries and
  constraints painful. Rejected: query complexity and weak integrity.

## Consequences

- **Positive**: one datastore, flexible attributes, transactional with the rest
  of the service's writes.
- **Negative**: JSONB queries need GIN indexes and careful access patterns to
  hit NFR-1; attribute-level constraints move into the application layer.
- **Follow-ups**: a task to add the GIN index and a task to add app-level
  validation of the attribute payload.
```
