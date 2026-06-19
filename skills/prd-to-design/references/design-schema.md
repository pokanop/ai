# Design Document Schema

Write the design to `plans/<dasherized-name>/design.md`. Use this schema as the output structure. Every section is required unless marked optional. Match depth to the feature's complexity and irreversibility — a two-component feature needs far less than a new storage layer. Design to the **contract level**: define interfaces, boundaries, and data ownership, not the line-level code that fulfills them.

## 1. Context

- **Designs**: link to the PRD this satisfies (`plans/<name>/prd.md`) and name the initiative.
- **Scope of this design**: one or two sentences on what structure this document decides. Note anything in the PRD that is deliberately left to implementation.
- **Status**: `Draft` / `Approved`. Mirrors the review state of the document.

## 2. Architecture Overview

A high-level description of the components and the boundaries between them. Include a diagram (ASCII or Mermaid) when more than a couple of components interact.

- Name each component and state, in one line, what it is responsible for.
- Show how components communicate (direct call, HTTP, queue, event) and which way the dependency points.
- Distinguish **new** components from **existing** ones the design touches. New boundaries are a cost — justify each.

```
┌────────────┐      ┌──────────────┐      ┌────────────┐
│  Client    │ ───▶ │  API Gateway │ ───▶ │  Service   │
└────────────┘      └──────────────┘      └─────┬──────┘
                                                 │
                                          ┌──────▼──────┐
                                          │  Datastore  │
                                          └─────────────┘
```

## 3. Component Responsibilities

For each component, a short entry:

- **Responsibility**: the single thing this component owns. If you cannot state it in one sentence, the boundary is wrong.
- **Owns**: the data, state, or logic only this component is allowed to touch.
- **Depends on**: the other components or external services it calls, and why.
- **Requirements**: the `FR-N` / `NFR-N` labels this component exists to satisfy. Every component must trace to at least one.

A component that owns nothing, or that no requirement needs, does not belong in the design.

## 4. API & Interface Contracts

Define the contracts between components and to the outside world — the shape, not the implementation.

- **Endpoints / methods**: name, inputs, outputs, and error cases. For HTTP: method, path, request/response schema, status codes. For an internal interface: the function or message signature.
- **Invariants**: what the caller may rely on (idempotency, ordering, auth required, rate limits).
- **Versioning & compatibility**: is this a new contract or a change to an existing one? If a change, state the backward-compatibility story.

Specify contracts precisely enough to build and test against, but do not prescribe the internal code that satisfies them.

```
POST /api/widgets
  Request:  { name: string, ownerId: string }
  Response: 201 { id: string, name: string, createdAt: timestamp }
  Errors:   400 invalid body · 401 unauthenticated · 409 name taken
  Invariant: idempotent on (ownerId, name)
```

## 5. Data Model & Contracts

The entities the design introduces or changes, at the contract level.

- **Entities**: each entity, its fields and types, and the component that owns it. One owner per entity.
- **Relationships**: how entities relate (one-to-many, references, ownership).
- **Migration impact**: new tables/columns, backfills, and whether the change is online-safe. Reference the project's existing migration mechanism rather than inventing one.
- **Retention & privacy**: where any `NFR-N` covers PII, retention, or encryption, state how the data model meets it.

Keep this to the logical model and ownership. Exact column types and index choices can be refined during implementation unless an `NFR-N` pins them.

## 6. Sequence Flows

For each significant user story (`US-N`) or critical path, a step-by-step flow through the components. A numbered list or a sequence diagram both work.

```
Create widget (US-3):
  1. Client → API Gateway: POST /api/widgets
  2. API Gateway → Service: validate auth, forward request
  3. Service → Datastore: insert if (ownerId, name) free
  4. Service → Client: 201 with new widget  (or 409 on conflict)
```

Cover the error and edge paths the PRD's acceptance criteria require, not just the happy path. A flow that only shows success hides the hard parts.

## 7. Key Decisions

A summary table of the significant architecture decisions, each linking to its ADR. This is the index; the rationale lives in the ADRs.

| # | Decision | Choice | ADR |
|---|----------|--------|-----|
| 1 | Storage engine | Postgres (JSONB for flexible fields) | `adr/0001-storage-engine.md` |
| 2 | Sync model | Server-authoritative, optimistic client | `adr/0002-sync-model.md` |

Reversible, low-stakes choices can stay as a one-line note here without a full ADR. See [adr-template.md](adr-template.md) for what warrants an ADR.

## 8. Cross-Cutting Concerns

How the design handles the things that span components. Address each or state why it does not apply:

- **Security**: trust boundaries, authn/authz placement, input validation, secret handling. Tie to the PRD's security `NFR-N`s.
- **Error handling**: how failures propagate across boundaries; what is retried, surfaced, or swallowed.
- **Observability**: what is logged, traced, or measured to know the system is healthy.
- **Performance budgets**: the latency/throughput targets from the `NFR-N`s, allocated across the components in the critical path.

## 9. Risks & Open Technical Questions

- **Risks**: technical risks this design carries (a new dependency's maturity, a scaling unknown, a tricky migration) with a mitigation or a spike to de-risk it.
- **Open questions**: technical unknowns that need an answer before or during implementation, each with who decides and the impact of leaving it open.

Carry forward any PRD open question that the design could not resolve.

## 10. Appendix (Optional)

- Glossary of domain or architecture terms
- Links to related designs, RFCs, or external references
- Rejected whole-architecture alternatives that are bigger than a single ADR

---

The labels (`FR-N`, `NFR-N`, `US-N`), priorities, and the `plans/` layout referenced above are defined once in the [shared conventions](../../_shared/references/conventions.md).
