---
name: prd-to-design
description: Turn a Product Requirements Document into a technical design — component boundaries, API and data contracts, sequence flows, and the key architecture decisions captured as ADRs. Use when the user asks to go from "prd to design", "design the architecture", "write an ADR", do a "technical design" or "system design", or needs to decide how a non-trivial feature will be built before tasks are cut. Reads plans/<name>/prd.md and produces plans/<name>/design.md plus plans/<name>/adr/NNNN-*.md. Optional step in the build pipeline — warranted for non-trivial features, skipped for simple ones.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# PRD to Design

This skill is the second step in the build pipeline. It sits between the PRD (*what* and *why*) and the task list (*build*), and answers *how*:

```
idea-to-prd  →  prd-to-design  →  design-to-tasks  →  tasks-to-code
  (what/why)      (architecture)     (task list)         (build)
```

The PRD deliberately excludes schemas, API shapes, and component structure — those are design decisions. This skill makes them, records the rationale, and hands `design-to-tasks` a concrete architecture to decompose. The PRD stays authoritative for *requirements*; the design is authoritative for *structure*.

## When to Use This — and When to Skip It

This step is **optional**. Use it when the architecture is not obvious and getting it wrong is expensive:

- More than two or three components, or a new boundary between existing ones
- A new or changed data model, public API, or integration contract
- A decision that is hard to reverse later (storage engine, sync model, auth model)
- Multiple reasonable approaches that need to be weighed before committing

**Skip it** for simple features — a single endpoint, a copy change, a contained bug-fix-shaped feature. In that case hand the PRD straight to `design-to-tasks`, which falls back to `prd.md` when no `design.md` exists. Do not invent architecture a small feature does not need; over-design is as much a failure as under-design.

**Trigger phrases:** "prd to design", "design the architecture", "write an ADR", "technical design", "system design".

## File Structure

The design and its decision records live in the plan folder alongside the PRD. The full `plans/` layout and the active → `plans/archive/<name>/` lifecycle are defined once in [shared conventions](../_shared/references/conventions.md#the-plans-directory).

```
plans/
└── <feature-name>/
    ├── prd.md                  # Read-only input (idea-to-prd)
    ├── design.md               # Created by this skill
    └── adr/                    # Created by this skill
        ├── 0001-storage-engine.md
        └── 0002-sync-model.md
```

**Rules:**

- Always read `plans/<name>/prd.md` before designing — the design must satisfy its requirements.
- Never modify the PRD. The design is a derivative artifact; if the design surfaces a requirements gap, surface it to the user to fix in the PRD, do not silently absorb it.
- Write the design to `plans/<name>/design.md` and each significant decision to `plans/<name>/adr/NNNN-short-title.md`.
- If `design.md` already exists, read it first — this may be a revision, not a fresh design.

## Workflow

### Phase 1: Read the PRD

Read `plans/<name>/prd.md` end to end and extract what constrains the design:

- **Goals, non-goals, and constraints** — the boundaries the architecture must respect
- **Functional requirements (`FR-N`)** — what the system must do; every component must trace to one or more
- **Non-functional requirements (`NFR-N`)** — performance, scale, security, reliability targets that drive structural choices
- **User stories and acceptance criteria** — the flows the sequence diagrams must support
- **Open questions** — unresolved items that may block a decision

If the PRD is missing the sections needed to design against (goals, labeled requirements, or a coherent scope), stop and ask the user to complete it with `idea-to-prd` first. Do not design against ambiguity.

### Phase 2: Discover the existing architecture

Before inventing structure, learn what the project already has. A design that ignores existing patterns creates integration debt.

See [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md) for the full checklist. For design, focus on:

- **Existing boundaries** — current modules, services, and the seams between them
- **Data layer** — database/ORM, existing schemas, migration mechanism
- **Integration points** — internal APIs, external services, message/event flows
- **Conventions** — how components communicate, how errors propagate, how things are configured

For a greenfield project, skip discovery and choose conventions that fit the stack the PRD names.

### Phase 3: Draft the design

Generate `design.md` using the schema in [references/design-schema.md](references/design-schema.md). The schema covers:

1. **Context** — what is being designed and the PRD it satisfies
2. **Architecture Overview** — components and the boundaries between them
3. **Component Responsibilities** — what each component owns and depends on
4. **API & Interface Contracts** — endpoints, signatures, and message shapes at the contract level
5. **Data Model & Contracts** — entities, ownership, and migration impact
6. **Sequence Flows** — how the key user stories move through the components
7. **Key Decisions** — a summary table linking to the ADRs
8. **Cross-Cutting Concerns** — security, error handling, observability, performance budgets
9. **Risks & Open Technical Questions**

Design to the **contract level, not the implementation level.** Define the shape of an API, the boundary of a component, and the ownership of data — not the line-level code that fulfills them. Those are `tasks-to-code`'s job and they change during implementation.

### Phase 4: Capture decisions as ADRs

Every decision that is significant, hard to reverse, or has reasonable alternatives gets its own Architecture Decision Record under `plans/<name>/adr/`, using the template in [references/adr-template.md](references/adr-template.md).

Weigh alternatives with the [references/tradeoff-rubric.md](references/tradeoff-rubric.md) before committing: score each option against the requirements, complexity, reversibility, and operability, and record *why the chosen option wins and why each alternative was rejected*. A decision without its rejected alternatives is an assertion, not a decision.

Not every choice needs an ADR. A reversible, low-stakes choice can be a one-line note in the design's Key Decisions table. Reserve ADRs for the decisions a future maintainer would ask "why did they do it this way?" about.

### Phase 5: Self-Validation

Before presenting the design, validate it. This is a mandatory gate, not optional.

- Every component traces to at least one `FR-N`; no component exists without a requirement behind it
- Every `NFR-N` is addressed by a concrete structural choice (or explicitly deferred with a reason)
- Every user story has a sequence flow or is explicitly out of design scope
- Every significant or hard-to-reverse decision has an ADR with its alternatives recorded
- No line-level implementation has crept in where a contract belongs
- New dependencies and new boundaries are each justified against the existing architecture

If any check fails, fix it before presenting. Do not rely on the user to catch structural gaps.

### Phase 6: Review

Present the design and ask for targeted feedback:

- **Boundaries** — are the component responsibilities cohesive and the seams in the right place?
- **Contracts** — are the API and data contracts complete and stable enough to build against?
- **Decisions** — are the trade-offs acceptable? Any rejected alternative that should be reconsidered?
- **Feasibility** — does anything in the design fight the existing codebase or the stated constraints?

Iterate until the user confirms the design is sound.

### Phase 7: Handoff

Once the design is confirmed, hand off to **design-to-tasks**, which reads `design.md` (falling back to `prd.md` if absent) and decomposes it into a trackable task list at `plans/<name>/tasks.md`. Tasks decompose along the component and contract boundaries this design defines, and each ADR that needs building becomes work in the task list.

## Key Principles

**The PRD owns requirements; the design owns structure.** Never change `prd.md`. If the design reveals a missing or contradictory requirement, surface it for the PRD to fix — do not encode a requirements decision in the design.

**Contract over implementation.** Define interfaces, boundaries, and data ownership. Leave the line-level code to `tasks-to-code`. A design that pins implementation detail goes stale the moment code is written.

**Decisions carry their alternatives.** Every significant decision records what else was considered and why it lost. This prevents re-litigating settled questions and makes the design auditable.

**Reuse over reinvention.** Prefer existing components, patterns, and infrastructure. A new boundary or dependency is a cost that must be justified against what the project already has.

**Right-size the design.** Match design depth to the feature's complexity and irreversibility. A two-component feature does not need a distributed-systems design doc; a new storage engine does. Do not skip the design for a risky feature, and do not manufacture one for a trivial change.

## References

- [references/design-schema.md](references/design-schema.md) -- Full design-document structure with section-by-section guidance
- [references/adr-template.md](references/adr-template.md) -- Architecture Decision Record template, numbering, and status lifecycle
- [references/tradeoff-rubric.md](references/tradeoff-rubric.md) -- How to evaluate alternatives and decide when a choice warrants an ADR
- [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md) -- Checklist for understanding the existing architecture before designing (shared reference)
- [../_shared/references/conventions.md](../_shared/references/conventions.md) -- Shared priority, labels, and the `plans/` layout (single source of truth)
