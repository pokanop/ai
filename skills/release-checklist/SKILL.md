---
name: release-checklist
description: Verify a plan is ready to ship and produce a release checklist and changelog entry. Use when the user asks to "prepare a release", "create a release checklist", "we're ready to ship", "generate a changelog", "check if we're ready to deploy", or needs a go/no-go assessment before deploying. Reads plans/<name>/tasks.md and prd.md, runs all quality gates, verifies P0 task completion, produces a CHANGELOG.md entry, and outputs a deployment-ready checklist.
license: MIT
metadata:
  author: pokanop
  version: "2.0"
---

# Release Checklist

## Purpose

This skill provides the final gate before a plan's changes are deployed to production. It answers two questions: "Is the implementation complete?" and "Is it safe to ship?" Poor answers to either question create incidents. This skill exists to catch both.

```
idea-to-prd  →  prd-to-design  →  design-to-tasks  →  tasks-to-code  ⇄  code-review  →  release-checklist
                                                                                             (ship)
```

The full lifecycle is defined in [shared conventions](../_shared/references/conventions.md#the-development-lifecycle). This skill is the gate between "built and reviewed" and "deployed" — and after a Go, **plan-retrospective** closes the loop.

## Inputs

- `plans/<name>/tasks.md` — to assess completion status
- `plans/<name>/prd.md` — to identify the release scope and success criteria
- `plans/<name>/review.md` (when present) — to verify no `🔴 Blocking` review finding is unresolved
- `plans/<name>/decisions.md` (when present) — implementation decisions often carry deployment prerequisites (new env vars, migrations, feature flags) that belong on the checklist
- The project's quality gate commands — run to confirm they all pass

If the plan is not specified, ask which plan is being released.

## Workflow

### Phase 1: Completion Assessment

Read `tasks.md` and assess whether the plan is ready to ship. Compute the numbers deterministically rather than counting markers by eye:

```bash
python3 skills/_shared/scripts/plan-metrics.py  plans/<name>/tasks.md
python3 skills/_shared/scripts/plan-validate.py plans/<name>/tasks.md --prd plans/<name>/prd.md --strict
```

`plan-metrics.py` provides the completion totals; a `plan-validate.py` error (missing blocked/skipped notes, dependency problems, coverage gaps) means the task list itself is not release-grade — fix the record before assessing the release.

**P0 completion gate (hard block):**
- Every P0 task must be `[x]` complete. A plan with any P0 task in `[ ]`, `[~]`, or `[!]` state is **not ready to release**.
- Surface all incomplete P0 tasks as blocking items.

**Review gate (hard block):**
- If `plans/<name>/review.md` exists, every `🔴 Blocking` finding must be marked resolved. An unresolved Blocking finding is an unfixed Critical defect — it blocks release exactly like an incomplete P0 task.
- If no review artifact exists and the plan's changes are substantial, flag the absence: recommend a `code-review` pass before shipping (flag, not hard block — the user may have reviewed through other means).

**P1 and P2 assessment:**
- List all incomplete P1 (`[P1]`) tasks. These are "should be done" — flag but don't hard-block.
- List all incomplete P2 (`[P2]`) tasks. These are optional — note but do not flag as issues.
- List all skipped (`[-]`) tasks and confirm their deferrals were intentional.

**Open questions:**
- Are there any `[!]` blocked tasks? What were they blocked on, and is the blocker resolved?
- Are there tasks marked `[~]` (in progress)? These represent incomplete work.

### Phase 2: Run Quality Gates

Run every quality gate discovered for the project. All gates must pass for a release to proceed. See [references/checklist-schema.md](references/checklist-schema.md) for the gate verification format.

**Detect the project's actual gate commands first** from `package.json` scripts, `Makefile`, CI configuration, `pyproject.toml`, `Cargo.toml`, `go.mod`, `build.gradle`, or `Package.swift`. Run all of them — the same additive principle from `idea-to-prd` applies here. The commands below are examples to adapt, not defaults to copy.

Common gates (adapt to the project's actual toolchain):

```bash
# Type checking
bun run check / npm run typecheck / mypy .

# Formatting
bun run format / npm run format / cargo fmt --check / swift-format lint

# Linting
bun run lint / npm run lint / ruff check / cargo clippy / golangci-lint run / swiftlint / ./gradlew lint

# Tests
bun run test / npm test / pytest / cargo test / go test ./... / swift test (or xcodebuild test) / ./gradlew test

# Build
bun run build / npm run build / cargo build / go build ./... / swift build (or xcodebuild build) / ./gradlew assemble
```

**If a gate fails:**
1. Stop — the release is blocked
2. Surface the specific failure(s) as blocking items
3. Do not proceed to the checklist output until all gates pass

### Phase 3: PRD Success Criteria Check

Read the PRD's Executive Summary (Section 1) for the stated success criteria. For each success criterion, assess whether it has been met based on the task completion state and any notes in `tasks.md`.

Example:
```
PRD Success Criterion: "Users can register and log in within 3 clicks"
Status: ✅ Met — Tasks 1.2, 1.3, 1.4, and 2.1 all complete.

PRD Success Criterion: "p95 login response time < 200ms"
Status: ⚠️ Unverified — No performance test was run. QG-4 in the PRD required this but no task implemented it.
```

Any unverified or unmet success criterion is a blocking item.

### Phase 4: Produce the Release Checklist

Write the release checklist. See [references/checklist-schema.md](references/checklist-schema.md) for the full schema.

The checklist covers:
- Pre-release gate results (task completion, quality gates, success criteria)
- Deployment prerequisites (environment variables, migrations, feature flags)
- Smoke test steps (the minimal set of user flows to verify after deployment)
- Rollback plan (what to do if the release causes a production incident)
- Post-release verification (what to check in the first 30 minutes after deployment)

### Phase 5: Generate the Changelog Entry

Produce a `CHANGELOG.md` entry for this release. See [references/changelog-guide.md](references/changelog-guide.md) for the format.

Derive the changelog from:
- PRD goals and non-goals (what was intended)
- Completed tasks and their completion notes (what was built)
- PRD user stories (what users can now do)

The changelog is user-facing — write it for a reader who will use the product, not one who reads the code. Focus on user-visible changes, not implementation details.

### Phase 6: Present and Confirm

Present to the user:
1. **Go / No-Go verdict** — Clear statement based on gate results
2. **Blocking items** — If no-go, what must be fixed
3. **Release checklist** — If go, the deployment checklist
4. **Changelog entry** — Draft for review

If the verdict is Go, ask: "Ready to mark this plan complete and archive it?" If yes, invoke the **plan-retrospective** skill.

## Key Principles

**Hard blocks are hard.** A failing quality gate or an incomplete P0 task is a hard block on release. Do not suggest workarounds or "ship and fix" approaches unless the user explicitly requests one — and even then, document the risk clearly.

**Rollback is mandatory.** Every release checklist must include a rollback plan. "We can't roll back" is itself a risk that must be documented and accepted, not ignored.

**Changelogs are user-facing.** Write for someone who uses the product. "Fixed database connection pooling" is not a useful changelog entry. "Fixed intermittent errors when loading your profile" is.

**Don't release what you can't monitor.** If the project has no error tracking or logging in the deployment environment, flag this as a release risk.

## References

- [references/checklist-schema.md](references/checklist-schema.md) — Full release checklist structure
- [references/changelog-guide.md](references/changelog-guide.md) — Changelog entry format and writing guidelines
- `../_shared/scripts/README.md` — `plan-metrics.py` / `plan-validate.py`: deterministic completion assessment
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — Canonical priority (`[P0]`/`[P1]`/`[P2]`), status markers, and the lifecycle (single source of truth)
