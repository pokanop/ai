---
name: idea-to-prd
description: Create detailed, development-ready Product Requirements Documents (PRDs) for software projects. Use when the user asks to turn an "idea to prd", "write a PRD", "create requirements", "plan a feature", "document a project spec", "scope a feature", or needs to turn a product idea into a structured specification. Covers problem definition, solution design, user stories, alternatives analysis, implementation planning, testing strategy, and risk assessment. Includes codebase discovery to align PRDs with the project's existing tech stack and conventions.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Idea to PRD

This skill is the first step in the build pipeline — it turns a raw product idea into a structured PRD:

```
idea-to-prd  →  prd-to-design  →  design-to-tasks  →  tasks-to-code
  (what/why)      (architecture)     (task list)         (build)
```

`prd-to-design` is optional — skip it for simple features and hand the PRD straight to `design-to-tasks`.

## File Structure

The PRD is the first artifact in a plan folder. The full `plans/` layout and the active → `plans/archive/<name>/` lifecycle are defined once in [shared conventions](../_shared/references/conventions.md#the-plans-directory); this skill creates `plans/<dasherized-name>/prd.md`.

**Rules:**

- Always create the PRD at `plans/<dasherized-name>/prd.md`
- The folder name must be lowercase, dasherized, and descriptive (e.g., `api-rate-limiting`, not `feature1`)
- Create the `plans/` directory if it does not exist
- The subfolder scopes all artifacts for a single initiative -- companion skills may later add task lists, tracking docs, or other files alongside `prd.md`

## Workflow

### Phase 1: Discovery

Before writing, gather context through two parallel tracks.

**Track A -- Understand the problem.** Ask the user about:

- The core problem: What pain exists and why solve it now?
- Target users: Who is affected and how?
- Success metrics: How do we know it worked?
- Constraints: Timeline, tech stack, team size, budget, regulatory?

Do not write the PRD until the problem is understood. Ask 2-4 focused questions. Avoid overwhelming the user with a wall of questions -- prioritize the most critical unknowns first, then follow up.

**Handling incomplete answers:** If the user cannot answer a question, do not block. Document it in Section 9 (Open Questions) with a proposed default and proceed. Mark the assumption clearly so it can be revisited.

**Handling contradictions:** If the user provides conflicting requirements (e.g., "must be real-time" and "must work offline"), surface the conflict explicitly with concrete options. Do not silently choose one interpretation.

**Track B -- Discover the codebase.** Explore the project to understand existing conventions. See [references/codebase-discovery.md](references/codebase-discovery.md) for the full checklist. Key items:

- Detect the package manager (bun, yarn, pnpm, npm, etc.) and use it consistently
- Identify existing scripts (build, test, lint, format, check) -- these become quality gates
- Note the framework, file structure, naming conventions, and patterns
- Identify the database/ORM, testing framework, and CI/CD pipeline
- Catalog existing dependencies before recommending new ones

If there is no existing codebase (greenfield project), skip Track B and recommend conventions based on the chosen stack.

### Phase 2: Draft

Generate the PRD using the schema in [references/prd-schema.md](references/prd-schema.md). The schema has 10 sections:

1. **Executive Summary** -- Problem, solution, success criteria
2. **Goals and Non-Goals** -- Explicit scope boundaries
3. **User Stories and Requirements** -- Personas, stories with acceptance criteria, functional and non-functional requirements
4. **Solution Design** -- Approach, key decisions with rationale, architecture overview, modular design principles
5. **Alternatives Considered** -- What was evaluated and why it was rejected
6. **Implementation Plan** -- Phased rollout, tech stack alignment, migration needs
7. **Testing Strategy** -- Unit, integration, e2e levels; quality gates from discovered scripts
8. **Risks and Mitigations** -- Technical, scope, timeline, and operational risks
9. **Open Questions** -- Unresolved decisions with owners and impact
10. **Appendix** (optional) -- Glossary, links, supporting data

Apply the quality standards in [references/quality-standards.md](references/quality-standards.md) throughout:

- Use measurable, specific language -- no vague qualifiers
- Define *what* and *why*, not *how* -- avoid prescribing specific code, schemas, or API shapes
- Justify every new dependency against the existing stack
- Ensure every requirement is independently verifiable
- Keep one requirement per statement
- Label all requirements for traceability using the canonical [requirement labels](../_shared/references/conventions.md#requirement-labels): `FR-N` (functional), `NFR-N` (non-functional), `US-N` (user stories), `QG-N` (quality gates)

### Phase 2.5: Self-Validation

Before presenting the draft to the user, validate it against the completeness checklist in [references/quality-standards.md](references/quality-standards.md). This is a mandatory gate, not optional.

Verify:
- Every section from the schema is present (or explicitly marked N/A with reasoning)
- All requirements use `FR-N`, `NFR-N`, `US-N`, `QG-N` labels
- All user stories have acceptance criteria with priority levels
- Success criteria are measurable with specific numeric targets
- Non-goals section exists and is substantive
- No vague language ("should be fast", "handle gracefully") remains
- New dependencies are justified
- Implementation phases are independently deployable

If any check fails, fix it before presenting. Do not rely on the user to catch structural gaps.

### Phase 3: Review

Present the draft and ask for targeted feedback using these review criteria:

**Scope review:**
- Are the non-goals correct? Is anything missing that should be explicitly excluded?
- Should this PRD be split? (>2 major features or >8 FRs spanning different subsystems)

**Correctness review:**
- Do the success criteria match business expectations?
- Are the user stories complete? Any personas or workflows missing?
- Are constraints accurately captured?

**Feasibility review:**
- Are the phased rollout boundaries right? Is each phase independently deployable?
- Are risks adequately identified? Any missing technical or operational risks?
- Are effort and complexity realistic for the stated constraints?

**Open items review:**
- Are there open questions that should be resolved before implementation begins?
- Are proposed defaults for unresolved questions acceptable?

Iterate until the user confirms the PRD is complete.

### Phase 4: Handoff

Once the PRD is confirmed, point the user to the next step in the pipeline:

- For a non-trivial feature, **prd-to-design** turns the PRD into an architecture (`plans/<name>/design.md` plus ADRs) before tasks are cut.
- For a simple feature, hand the PRD straight to **design-to-tasks**, which decomposes it into an actionable, trackable task list at `plans/<name>/tasks.md` (it reads `design.md` when present and otherwise falls back to the PRD).

Either step is optional but recommended before implementation begins.

## Key Principles

**Reuse over reinvention.** Always prefer existing project tools, libraries, and patterns. New dependencies require explicit justification in the PRD.

**Scope discipline.** Non-goals are as important as goals. If the PRD covers multiple major features, split it. Each implementation phase must be independently deployable and valuable.

**Dynamic guidance, not rigid templates.** Do not include specific code, database schemas, or API response shapes in the PRD. These change during implementation. Instead, define requirements that constrain the implementation without dictating it.

**Quality gates are additive.** Discover every check command the project has (check, format, lint, test, build, etc.) and include **all** of them as required quality gates. Never skip a gate. If the project has five scripts, five gates must pass. Do not invent new tooling unless the project has none.

**Testing is in scope.** Every PRD must include a testing strategy appropriate to the project's complexity. Reference the project's existing test framework and patterns. Define what coverage is expected at each testing level.

## References

- [references/prd-schema.md](references/prd-schema.md) -- Full PRD document structure with section-by-section guidance
- [references/codebase-discovery.md](references/codebase-discovery.md) -- Checklist for understanding project conventions before writing
- [references/quality-standards.md](references/quality-standards.md) -- Writing standards, decision quality criteria, and completeness checklist
- [../_shared/references/conventions.md](../_shared/references/conventions.md) -- Shared priority, labels, and the `plans/` layout (single source of truth)
