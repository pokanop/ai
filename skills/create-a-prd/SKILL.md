---
name: create-a-prd
description: Create detailed, development-ready Product Requirements Documents (PRDs) for software projects. Use when the user asks to "write a PRD", "create requirements", "plan a feature", "document a project spec", "scope a feature", or needs to turn a product idea into a structured specification. Covers problem definition, solution design, user stories, alternatives analysis, implementation planning, testing strategy, and risk assessment. Includes codebase discovery to align PRDs with the project's existing tech stack and conventions.
---

# Create a PRD

## File Structure

All PRDs live under a `plans/` directory at the project root. Each PRD gets its own dasherized subfolder named after the feature or initiative:

```
plans/
├── user-authentication/
│   └── prd.md
├── search-improvements/
│   └── prd.md
└── archive/
    └── onboarding-flow/
        └── prd.md
```

**Rules:**

- Always create the PRD at `plans/<dasherized-name>/prd.md`
- The folder name must be lowercase, dasherized, and descriptive (e.g., `api-rate-limiting`, not `feature1`)
- Create the `plans/` directory if it does not exist
- The subfolder scopes all artifacts for a single initiative -- companion skills may later add task lists, tracking docs, or other files alongside `prd.md`

### Plan Lifecycle

1. **Active** -- PRD lives in `plans/<name>/`. Work is in progress.
2. **Completed** -- Once the PRD and all associated tasks are done, move the entire folder to `plans/archive/<name>/`.

This convention keeps the `plans/` directory clean (only active work visible) while preserving a full history under `plans/archive/`.

## Workflow

### Phase 1: Discovery

Before writing, gather context through two parallel tracks.

**Track A -- Understand the problem.** Ask the user about:

- The core problem: What pain exists and why solve it now?
- Target users: Who is affected and how?
- Success metrics: How do we know it worked?
- Constraints: Timeline, tech stack, team size, budget, regulatory?

Do not write the PRD until the problem is understood. Ask 2-4 focused questions. Avoid overwhelming the user with a wall of questions -- prioritize the most critical unknowns first, then follow up.

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

### Phase 3: Review

Present the draft and ask for feedback on specific sections. Common review items:

- Are the non-goals correct? Is anything missing?
- Do the success criteria match business expectations?
- Are the phased rollout boundaries right?
- Are risks adequately identified?

Iterate until the user confirms the PRD is complete.

## Key Principles

**Reuse over reinvention.** Always prefer existing project tools, libraries, and patterns. New dependencies require explicit justification in the PRD.

**Scope discipline.** Non-goals are as important as goals. If the PRD covers multiple major features, split it. Each implementation phase must be independently deployable and valuable.

**Dynamic guidance, not rigid templates.** Do not include specific code, database schemas, or API response shapes in the PRD. These change during implementation. Instead, define requirements that constrain the implementation without dictating it.

**Quality gates from the project.** If the project has lint, format, type-check, or test commands, include all of them as required quality gates. Do not invent new tooling unless the project has none.

**Testing is in scope.** Every PRD must include a testing strategy appropriate to the project's complexity. Reference the project's existing test framework and patterns. Define what coverage is expected at each testing level.

## References

- [references/prd-schema.md](references/prd-schema.md) -- Full PRD document structure with section-by-section guidance
- [references/codebase-discovery.md](references/codebase-discovery.md) -- Checklist for understanding project conventions before writing
- [references/quality-standards.md](references/quality-standards.md) -- Writing standards, decision quality criteria, and completeness checklist
