---
name: setup-pokanop-skills
description: One-time onboarding for the pokanop skills suite. Interviews the user about their issue tracker, where plans and docs live, coding conventions, and preferred workflows, then writes the repo-local configuration at plans/config.md that every other skill reads for context. Use when the user says "set up the skills", "setup pokanop skills", "configure the skills", "onboard this repo", "initialize the skill suite", "get started with these skills", or when another skill finds no plans/config.md and the repo has never used the suite before. Run once per repo; re-run only to change the recorded answers.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Setup Pokanop Skills

## Purpose

Every other skill in this suite assumes context about the repo it runs in: where work is tracked, where planning artifacts live, which conventions the code follows, and how the team likes to work. This skill gathers those answers **once**, in a short interview, and records them in a single repo-local file — `plans/config.md` — that the rest of the suite reads instead of re-asking.

Run it once per repo, before (or on) first use of any other skill. Re-running is only needed to change an answer; the config can also just be edited directly.

This is a prompt-driven skill, not a deterministic script: explore first, present what you found, confirm with the user, then write.

## Workflow

### Phase 1: Explore

Before asking anything, look at the repo so the interview proposes defaults instead of open-ended questions:

- **`plans/config.md`** — does it already exist? If so, this is a re-run: show the current answers and ask only what the user wants to change.
- **Remote and tracker signals** — `git remote -v` (GitHub? GitLab? none?), issue templates under `.github/`, references to Jira/Linear keys in commit messages.
- **`plans/` directory** — does it exist? Are there active plans (see the [`plans/` layout](../_shared/references/conventions.md#the-plans-directory))? An existing `plans/` tree means the suite's default location is already in use.
- **Convention signals** — `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, editor/linter configs, the package manager in use, and existing check scripts (lint, test, build, format). These seed the coding-conventions answer.
- **Docs location** — a `docs/` directory, a wiki link in the README, or docs colocated with code.

### Phase 2: Interview

Ask one section at a time, leading with the recommended default so the user can accept it in a word. Skip any section exploration already settled. Keep it to these four:

**Section A — Issue tracker.** Where is work tracked for this repo? Propose what the remote suggests (GitHub Issues for a GitHub remote, etc.). Options: GitHub Issues, GitLab Issues, Jira, Linear, local markdown (issues as files in the repo), or none/other (record the user's one-paragraph description as freeform prose). Record the tracker, the project/repo identifier, and any ticket-reference convention for commits and PRs (e.g. `POK-123` prefixes).

**Section B — Plans and docs.** Where should planning artifacts live? Default: the suite's standard `plans/` directory at the repo root — accept it unless the user has a reason not to. Also record where long-form docs live (e.g. `docs/`, a wiki, or none) so PRD/design skills know where to link supporting material.

**Section C — Coding conventions.** Confirm what exploration found: package manager, check commands that must stay green (these become the suite's quality gates), formatting/linting tools, and any convention docs the skills should read first (`AGENTS.md`, `CONTRIBUTING.md`, style guides). Ask only about gaps — don't re-ask what the repo already states.

**Section D — Preferred workflows.** How the team likes to work: branch naming, whether `prd-to-design` is expected for most features or reserved for large ones, review expectations (e.g. always run `code-review` before a PR), and anything else the user wants every skill to respect.

Handle incomplete answers the way `idea-to-prd` does: if the user can't answer, record a sensible default marked as an assumption and move on — never block the setup on an open question.

### Phase 3: Confirm and write

1. Draft `plans/config.md` from the answers using the template in [references/config-template.md](references/config-template.md). Keep every section, marking unused ones explicitly (e.g. "Issue tracker: none") so downstream skills can tell "answered: none" from "never configured".
2. Show the draft to the user and let them edit before writing.
3. Write the file, creating `plans/` if it does not exist. If `plans/config.md` already exists, update it in place — preserve any hand edits in sections the user didn't ask to change.

### Phase 4: Hand off

Tell the user setup is complete and that the other skills will now read `plans/config.md` during their discovery phase. Point them at `next-step` as the front door for whatever they want to do first, and mention that `plans/config.md` can be edited directly at any time — re-running this skill is only necessary for a guided revision.

## How other skills use the config

`plans/config.md` is discovery input, not law: skills read it at the start of their codebase-discovery step (alongside [codebase discovery](../idea-to-prd/references/codebase-discovery.md)) to avoid re-asking settled questions — which tracker to reference in tasks and commits, which quality gates to run, which conventions to follow. When the config and the repo's actual state disagree (e.g. the config names a check script that no longer exists), trust the repo and surface the discrepancy rather than silently following the stale answer.

## Key Principles

**Interview, don't interrogate.** Explore first so most sections open with a proposed default. Four short sections, one at a time — never a wall of questions.

**One file, one place.** All answers land in `plans/config.md`. No scattered dotfiles, no per-skill config. The `plans/` directory is already the suite's home for repo-local state.

**Confirm before writing.** The user sees and approves the draft before anything touches disk. On re-runs, unchanged sections are preserved verbatim.

**Config is context, not command.** Downstream skills treat the config as remembered answers, not overrides of what the repo actually contains. Reality on disk wins; the config saves questions.

## References

- [references/config-template.md](references/config-template.md) — The `plans/config.md` template with section-by-section guidance
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — The `plans/` layout, lifecycle, and routing table (single source of truth)
