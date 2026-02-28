---
name: plan-retrospective
description: Close out a completed plan with a structured retrospective. Use when the user asks to "close out a plan", "do a retro", "archive a plan", "write a retrospective", "wrap up a feature", or needs to formally complete a plan from plans/<name>/. Reads prd.md and tasks.md, computes completion metrics, surfaces scope drift, captures lessons learned, produces a retro.md, and moves the plan to plans/archive/.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Plan Retrospective

## Purpose

This skill is the closing step of the planning lifecycle:

```
create-a-prd  →  prd-to-tasks  →  tasks-to-code  →  plan-retrospective
  (what)           (how)           (build)             (close)
```

It formally closes a plan by computing what was actually built versus what was planned, capturing decisions and lessons, and archiving the plan folder with a complete record. Without this step, institutional knowledge from the implementation is lost.

## File Structure

The skill reads from and writes to the plan's directory:

```
plans/
└── feature-name/
    ├── prd.md          # Read-only — source of truth for original intent
    ├── tasks.md        # Read — final task state
    ├── decisions.md    # Read — decisions made during implementation (if exists)
    └── retro.md        # CREATED by this skill

→ After confirmation:

plans/
└── archive/
    └── feature-name/
        ├── prd.md
        ├── tasks.md
        ├── decisions.md
        └── retro.md
```

**Rules:**

- Never modify `prd.md` or `tasks.md` — they are the historical record
- `retro.md` is created in `plans/<name>/` before archiving
- The folder moves to `plans/archive/<name>/` only after the user confirms the retro is complete
- Create `plans/archive/` if it does not exist

## Workflow

### Phase 1: Read the Plan

Read all artifacts for the plan:

1. `plans/<name>/prd.md` — original goals, requirements, success criteria, phases
2. `plans/<name>/tasks.md` — final task statuses, completion notes, statistics
3. `plans/<name>/decisions.md` — implementation decisions (if it exists)

Extract:
- Original success criteria from the PRD (Section 1: Executive Summary)
- All requirements with labels (FR-N, NFR-N, US-N, QG-N)
- Final task status for every task
- Decisions that deviated from the PRD

### Phase 2: Compute Metrics

Calculate the following from `tasks.md`. See [references/metrics-guide.md](references/metrics-guide.md) for computation details.

**Completion metrics:**
- Total tasks, completed (`[x]`), skipped (`[-]`), blocked (`[!]`), not started (`[ ]`)
- Completion rate (completed / (total − skipped))
- Phase-by-phase breakdown

**Coverage metrics:**
- PRD requirements fully implemented (trace FR-N/US-N to completed tasks)
- PRD requirements partially implemented (task complete but acceptance criteria not fully met)
- PRD requirements not implemented (no corresponding completed task)

**Scope drift:**
- Tasks added that have no corresponding PRD requirement (gold-plating, scope creep)
- PRD requirements never tasked (decomposition gaps)
- PRD requirements tasked but skipped (intentional deferrals)

### Phase 3: Draft the Retrospective

Produce `retro.md` using the schema in [references/retro-schema.md](references/retro-schema.md). Sections:

1. **Summary** — What was built, in one paragraph. Reference the PRD's problem statement and state what was delivered.
2. **Metrics** — Computed numbers from Phase 2 (completion rate, requirement coverage).
3. **What Was Built** — A plain-language list of what was actually shipped, derivable by a reader who hasn't read the PRD.
4. **Scope Drift** — Any additions beyond the PRD, requirements intentionally deferred, and tasks skipped with reasons.
5. **Key Decisions** — The most significant decisions from `decisions.md` (or implementation notes in `tasks.md`). Focus on decisions that future work should know about.
6. **What Worked Well** — Patterns, tools, or approaches that should be repeated.
7. **What to Improve** — Friction points, estimation misses, blockers that could have been avoided.
8. **Open Items** — Any tasks marked `[!]` blocked or `[ ]` not started that are being carried forward rather than closed. For each, state: what it is, who owns it, and where it goes next (new plan, backlog, etc.).
9. **Future Opportunities** — Items from `decisions.md`'s Future Opportunities section, or patterns noticed during implementation that didn't fit the current scope.

### Phase 4: Review

Present the retrospective to the user and ask:

- Are the metrics accurate?
- Is the scope drift assessment correct? Were any additions intentional and should be noted as such?
- Are there key decisions or lessons missing?
- Are open items correctly characterized?

Iterate until the user confirms the retro is complete.

### Phase 5: Archive

Once the retrospective is confirmed:

1. Write the final `retro.md` to `plans/<name>/retro.md`
2. Create `plans/archive/` if it doesn't exist
3. Move `plans/<name>/` to `plans/archive/<name>/`
4. Confirm: "Plan `<name>` has been archived to `plans/archive/<name>/`. The `plans/` directory now shows only active plans."

Do not archive without explicit user confirmation. The plan folder is the canonical record — archiving is irreversible without a manual `mv` back.

## What Good Retrospectives Accomplish

- **Preserve intent.** The PRD captures what was planned; the retro captures what was built and why it diverged. Together they form the complete picture.
- **Surface lessons.** "What worked" and "what to improve" feed directly into how the next plan is written and executed.
- **Close loops.** Open items are made explicit and assigned next steps — they don't silently disappear into the backlog.
- **Inform future estimation.** Completion rates and scope drift data make future task estimation more accurate.

## Key Principles

**The retro describes reality, not the plan.** If the implementation diverged from the PRD, the retro says so clearly. It does not paper over gaps.

**Metrics without context mislead.** A 70% completion rate means something very different if 30% was intentionally deferred versus blocked. Always qualify the numbers with context.

**Blame-free by default.** The "what to improve" section focuses on process and tooling, not individuals. Retrospectives should be safe to write honestly.

**Open items need owners.** An open item without a clear next step will never get done. Every `[!]` and unclosed `[ ]` must either be assigned a next plan or explicitly deprioritized.

## References

- [references/retro-schema.md](references/retro-schema.md) — Full retrospective document structure
- [references/metrics-guide.md](references/metrics-guide.md) — How to compute completion, coverage, and drift metrics
