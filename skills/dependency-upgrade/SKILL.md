---
name: dependency-upgrade
description: Safely upgrade project dependencies, frameworks, or toolchains through staged, individually-verified bumps. Use when the user asks to "upgrade dependencies", "update packages", "bump versions", "update to the latest version", "do a major version upgrade", "migrate to React 19 / Python 3.13 / Rails 8", "fix npm audit findings", or "update the lockfile". Reads changelogs and breaking-change notes before touching anything, sequences risky bumps one at a time with quality gates green after each, keeps lockfile changes disciplined and reviewable, and applies supply-chain caution — preferring versions published at least 7 days ago and pinned, bounded ranges.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Dependency Upgrade

## Purpose

Dependency work is the change nobody scoped: no PRD, no design, yet it can rewrite the behavior of the whole application in one lockfile diff. The failure modes are characteristic — the "harmless" batch update that breaks one transitive edge, the major bump attempted without reading the migration guide, the audit fix that swaps one vulnerability for a compromised release published yesterday.

This skill turns upgrades into a **staged, evidence-driven process**: understand what each bump changes *before* applying it, apply risky bumps one at a time, hold every quality gate green throughout, and treat the registry itself as an untrusted input. The unit of progress is a verified bump, not an updated manifest.

## Triage Before You Start

Classify the work first, using the canonical [routing table](../_shared/references/conventions.md#routing):

| The request is… | Is it this skill? | Route to |
|----------------|-------------------|----------|
| Bumping versions of existing dependencies (patch → major), toolchains, or lockfile maintenance | ✅ Yes | This skill |
| Resolving dependency-audit findings (CVEs) by upgrading | ✅ Yes | This skill; [`security-review`](../security-review/) *finds* them, this skill *applies* the fix |
| Adopting a **new** dependency or a new capability of an upgraded one | ❌ No | [`idea-to-prd`](../idea-to-prd/) — that is new behavior with its own trade-offs |
| Removing a dependency by rewriting its usages | ⚠️ Split | The removal decision is a design change; the mechanical rewrite may be [`refactor`](../refactor/) |
| App code was already broken before the upgrade | ❌ No | [`debug-and-fix`](../debug-and-fix/) first — never upgrade on a red baseline |

**Bright line:** an upgrade changes *versions*, plus the minimal code changes the new versions require. Improvements the new version merely *enables* are logged as Future Opportunities, never bundled into the upgrade diff.

## Inputs

1. **A scope** — everything outdated, one dependency, a security finding, or a framework migration. If open-ended, produce the outdated report first and propose batches rather than updating blindly.
2. **A green baseline** — run the project's full quality-gate set (lint, typecheck, test, build) *before* changing anything. Every subsequent failure is then attributable to a bump. If the baseline is red, stop and surface it.

## Workflow

### Phase 1: Inventory and Plan the Batches

1. **Discover the ecosystem's mechanics** — manifest(s), lockfile, the exact outdated/audit/install commands for the package manager in use, and any workspace/monorepo structure (see [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md)). Respect the project's own tooling — if it uses `bun`, everything goes through `bun`, never a mixed `npm` call.
2. **Produce the outdated/audit report** and classify each candidate by risk using [references/upgrade-planning.md](references/upgrade-planning.md): semver distance (patch / minor / major), how load-bearing the package is, and whether it is a framework, a build tool, a type package, or a leaf utility.
3. **Batch by risk, not alphabetically**: patch/minor bumps of leaf dependencies can travel together; every **major** bump, framework, or build-toolchain change gets its own stage — its own verification, its own revertable commit.
4. **Order the stages** so prerequisites come first (a framework major before the plugins that follow it; the toolchain before the libraries compiled by it). Present the plan when the scope is large or any stage is high-risk.

### Phase 2: Read Before You Bump

For each stage, *before* changing any file:

1. **Read the changelog / release notes** for every version being crossed — not just the target version. Breaking changes announce themselves in the versions in between.
2. **Read the migration guide** for majors; note codemods the project provides and deprecations that become removals.
3. **Check the supply-chain signals** in [references/supply-chain.md](references/supply-chain.md): prefer versions **published at least 7 days ago** (fresh releases are where compromised packages live before being yanked); be suspicious of ownership changes, sudden maintainer swaps, and install scripts appearing where none existed.
4. **Map the blast radius** — search the codebase for the APIs the changelog says changed. This turns "hope it works" into a concrete list of call sites to update.

### Phase 3: Apply One Stage at a Time

1. **Bump via the package manager**, never by hand-editing the lockfile. Manifest ranges stay pinned or bounded — no `latest`, no `*`, no unbounded `>=`.
2. **Make the required code changes** the migration guide calls for — mechanically, minimally, following the project's existing patterns. Run the official codemod when one exists.
3. **Run the full quality-gate set.** Green → commit the stage (manifest + lockfile + required code changes together, nothing else). Red → fix forward only if the changelog explains the failure; otherwise revert the stage and record why in the plan.
4. **Inspect the lockfile diff** before committing: only the expected packages moved, no surprise new transitive dependencies, no dependency silently switching registry or source URL. Lockfile discipline is a review artifact, not a formality.

Never stack a second risky stage on top of an unverified one — the whole value of staging is that a failure indicts exactly one bump.

### Phase 4: Verify the Whole, Then Report

1. With all stages applied, run the full gate set once more, plus the ecosystem's audit tool — confirm the upgrade actually resolved the findings it set out to resolve and introduced no new ones.
2. Smoke-test the golden paths if the project has a runnable dev target — type checkers do not catch runtime behavior changes in untyped seams.
3. Report:

```markdown
## Dependency Upgrade Summary

**Scope**: [what was upgraded, N packages across M stages]
**Notable bumps**: [package X a.b.c → x.y.z (major): required changes and why]
**Deferred**: [bumps intentionally not taken, and why — e.g. released < 7 days ago, breaking change needs its own plan]
**Audit**: [findings resolved / remaining]
**Quality gates**: All passing ✅ after every stage
```

A major migration too large for this pass (framework rewrite, API rearchitecture) is scoped out honestly: route it to [`idea-to-prd`](../idea-to-prd/) so it gets a plan, rather than half-landing it inside an upgrade.

## Key Principles

**Never upgrade on a red baseline.** A failing gate before the first bump makes every later failure unattributable. Green first, then bump.

**One risky change per stage.** Batch the boring, isolate the dangerous. When a stage fails, the cause list has exactly one entry.

**The changelog is the spec.** Reading release notes and migration guides before bumping is the difference between an upgrade and a gamble. Unread breaking changes don't not exist.

**Treat the registry as untrusted input.** A version published yesterday, a new maintainer, a new install script — each is a reason to wait or investigate. Prefer versions ≥ 7 days old; most supply-chain compromises are caught and yanked within days.

**The lockfile is part of the diff.** Review it like code: unexpected transitive additions and source changes are findings, not noise. Hand-editing it is forbidden.

**Upgrades are not feature work.** Adopting shiny new APIs the bump enables is a separate, planned change. The upgrade diff contains versions plus the changes the versions *require* — nothing else.

## References

- [references/upgrade-planning.md](references/upgrade-planning.md) — Risk classification, batching, stage ordering, and reading changelogs/migration guides effectively
- [references/supply-chain.md](references/supply-chain.md) — Supply-chain threat signals, the ≥ 7-day rule, version-range and lockfile discipline per ecosystem
- [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md) — Discovering the package-management and CI mechanics (shared reference)
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — Canonical routing table and shared conventions (single source of truth)
