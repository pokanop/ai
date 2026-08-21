# Skills Changelog

History of the agent skills suite as a whole. Individual skills carry their own
`metadata.version` in their `SKILL.md` frontmatter; this file records the
suite-level milestones those versions roll up into.

## Unreleased

- New skill: `setup-pokanop-skills` — one-time repo onboarding that interviews
  the user (issue tracker, plans/docs locations, coding conventions, preferred
  workflows) and writes `plans/config.md`, the repo-local configuration other
  skills read during discovery instead of re-asking.
- `next-step` strengthened as the suite's start-here entry point (`2.2`): a
  compact routing map in the SKILL.md, a first-time check that routes repos
  without `plans/config.md` to `setup-pokanop-skills`, and plan inventories
  that skip `plans/config.md`.
- New skills being added in a parallel workstream — will be catalogued here and
  in [README.md](README.md) when they land.
- Added shared verification-gate discipline: a new
  `_shared/references/verification-gates.md` defines the evidence-before-claims
  gate sequence, what counts as evidence per claim, and an anti-rationalization
  table. The eight lifecycle skills (`idea-to-prd`, `prd-to-design`,
  `design-to-tasks`, `tasks-to-code`, `code-review`, `debug-and-fix`,
  `refactor`, `write-tests`) each gained a brief gate pointer at their
  verification moment and a minor version bump.

## 2.0 — Suite synchronization (PR [#15](https://github.com/pokanop/ai/pull/15), POK-299)

- Improved and synchronized the entire suite: one canonical lifecycle, routing
  table, severity↔priority scale, status markers, and `plans/` layout, defined
  once in `_shared/references/conventions.md` and linked from every skill.
- Added the deterministic plan tooling (`_shared/scripts/plan-metrics.py`,
  `plan-validate.py`) so skills compute plan state instead of hand-counting.
- Most skills bumped to `version: "2.0"`; skills introduced during this cycle
  (`next-step`, `performance-review`) start at `"1.0"`.

## June 2026 — Pipeline renames

- `create-a-prd` → `idea-to-prd` and `prd-to-tasks` → `design-to-tasks`, so the
  build-pipeline skills read `input-to-output` and the new `prd-to-design` step
  slots in between. Existing installs of the old slugs keep working; new
  installs and links use the new names.

## 1.0 — Initial skills

- First release of the suite: the build pipeline (PRD → tasks → code), code
  review, debugging, and release/retro close-out skills, each at
  `version: "1.0"`.

---

## Versioning policy

Skill versions follow a pragmatic semver:

- **Major** (`1.0` → `2.0`): the skill's contract changes — its inputs, outputs,
  artifact locations, or its position in the lifecycle. Consumers may need to
  adjust how they invoke it.
- **Minor** (`2.0` → `2.1`): behavior is refined or extended without breaking
  the contract — new references, better guidance, added checks.
- Typos and formatting fixes do not bump the version.

Versions live in each skill's `SKILL.md` frontmatter (`metadata.version`) and
are per-skill, not suite-wide — skills only bump when they themselves change.
A suite-wide milestone (like the 2.0 synchronization) is recorded here even
when some skills stay on an older version.
