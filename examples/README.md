# Worked Examples

Golden, end-to-end outputs of the skill pipeline — real artifacts you can read to
see what each skill produces and how they chain together. Skills describe *how*
to produce an artifact; these examples show *what* a good one looks like.

## `dark-mode-toggle/` — one feature, the whole pipeline

A small but non-trivial feature (a persisted, OS-aware dark mode for a fictional
"Notes" web app) carried through every step of the build lifecycle. Each artifact
is the kind of output its skill would generate, and each links to the next.

| Step | Skill | Artifact |
|------|-------|----------|
| 1. PRD | [idea-to-prd](../skills/idea-to-prd/SKILL.md) | [dark-mode-toggle/prd.md](dark-mode-toggle/prd.md) |
| 2. Design | [prd-to-design](../skills/prd-to-design/SKILL.md) | [dark-mode-toggle/design.md](dark-mode-toggle/design.md) |
| 3. Decisions (architecture) | [prd-to-design](../skills/prd-to-design/SKILL.md) | [dark-mode-toggle/adr/0001-theme-persistence.md](dark-mode-toggle/adr/0001-theme-persistence.md) |
| 4. Tasks | [design-to-tasks](../skills/design-to-tasks/SKILL.md) | [dark-mode-toggle/tasks.md](dark-mode-toggle/tasks.md) |
| 5. Decisions (implementation) | [tasks-to-code](../skills/tasks-to-code/SKILL.md) | [dark-mode-toggle/decisions.md](dark-mode-toggle/decisions.md) |
| 6. Review | [code-review](../skills/code-review/SKILL.md) | [dark-mode-toggle/review.md](dark-mode-toggle/review.md) |
| 7. Release | [release-checklist](../skills/release-checklist/SKILL.md) | [dark-mode-toggle/release-checklist.md](dark-mode-toggle/release-checklist.md) |
| 8. Retro | [plan-retrospective](../skills/plan-retrospective/SKILL.md) | [dark-mode-toggle/retro.md](dark-mode-toggle/retro.md) |

```
idea-to-prd → prd-to-design → design-to-tasks → tasks-to-code → code-review → release-checklist → plan-retrospective
   prd.md        design.md         tasks.md        decisions.md    review.md    release-checklist.md      retro.md
                 adr/0001-*.md                                                                            (then archive)
```

## How to read it

Start with [the PRD](dark-mode-toggle/prd.md) and follow the links forward. The
thread to watch: requirement labels (`FR-5`, `NFR-2`, `US-1`, …) are assigned in
the PRD and stay traceable all the way to the retro's coverage table. One real
bug — a flash of the wrong theme — is introduced, caught in the
[review](dark-mode-toggle/review.md), explained in
[decisions.md](dark-mode-toggle/decisions.md), and turned into a lesson in the
[retro](dark-mode-toggle/retro.md).

The labels, status markers (`[ ]` / `[~]` / `[x]` / `[!]` / `[-]`), severities,
and the `plans/` layout these artifacts use are defined once in the
[shared conventions](../skills/_shared/references/conventions.md).

## Where these live in a real project

In an actual repo, a plan's artifacts live in `plans/<feature>/` while the work
is active, and [plan-retrospective](../skills/plan-retrospective/SKILL.md) moves
the folder to `plans/archive/<feature>/` at close-out. This example flattens the
whole lifecycle into one folder so you can browse every artifact — active and
closed — side by side.
