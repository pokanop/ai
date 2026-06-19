# Shared Conventions

The single source of truth for the markers, labels, severities, priorities, effort
sizes, and the `plans/` layout used across **every** skill in this collection.

When a skill needs to refer to one of these conventions, it links here instead of
restating the definition. If any skill's wording disagrees with this file, **this
file wins** — fix the skill, not this reference.

---

## Task Status Markers

Used as the leading checkbox on every task in `tasks.md`, and in any status report
derived from it.

| Status | Marker | Meaning |
|--------|--------|---------|
| Not Started | `[ ]` | Work has not begun |
| In Progress | `[~]` | Actively being worked on |
| Completed | `[x]` | Done and verified — all acceptance criteria met |
| Blocked | `[!]` | Cannot proceed — the task note records the blocker |
| Skipped | `[-]` | Intentionally not doing — the task note records the reason |

**Rules:**

- Only the top-level task checkbox counts toward statistics — never the
  acceptance-criteria sub-checkboxes.
- `[!]` and `[-]` always carry a note explaining the block or the reason for skipping.
- `[x]` means verified: do not mark a task complete until every acceptance-criteria
  sub-checkbox is checked.

---

## Priority

Priority answers *"how important is this?"* It is written as a bracketed tag on a task
(`[P0]`) and as a bare label in a PRD (`P0`).

| Priority | Tag | Meaning |
|----------|-------|---------|
| P0 | `[P0]` | Must-have — required to ship/launch |
| P1 | `[P1]` | Should-have — expected, but can ship without it |
| P2 | `[P2]` | Nice-to-have |

PRD requirement language maps to priority: **must** → P0, **should** → P1, **may** → P2.

---

## Severity and Priority

There is **one** severity scale across all skills. Severity answers *"how bad is this
finding?"* and maps directly to [priority](#priority), so findings can flow straight
into a task list. This is the single canonical severity↔priority mapping.

| Severity | Marker | Priority | Use when |
|----------|--------|----------|----------|
| Critical | `🔴` | `[P0]` | Blocks shipping: a correctness or security bug, a broken acceptance criterion, or a broken/blocking user experience. Must be fixed before merge or release. |
| Major | `🟡` | `[P1]` | A real problem that should be fixed this cycle but does not block the release. |
| Minor | `⚪` | `[P2]` | Polish: trivial style, a one-step deviation, a cosmetic inconsistency. |

**Code review** applies this same scale using disposition names, because "blocks the
merge" reads more naturally on a diff than "P0":

| Code-review term | Canonical severity | Marker |
|------------------|--------------------|--------|
| Blocking | Critical | `🔴 Blocking` |
| Suggestion | Major | `🟡 Suggestion` |
| Nit | Minor | `⚪ Nit` |

Code review adds one marker that is **not** a severity: `✅ Praise`, for calling out
something done well. Praise carries no priority.

**UI design audit** uses the canonical names directly (`🔴 Critical` / `🟡 Major` /
`⚪ Minor`) and maps them to `[P0]` / `[P1]` / `[P2]` when it emits its findings as a PRD.

---

## Effort (T-shirt Sizes)

Effort estimates the work to complete a task. It is written as a bracketed tag (`[M]`).

| Size | Tag | Rough time | Typical scope |
|------|-------|-----------|---------------|
| Small | `[S]` | < 1 hr | Config change, simple utility, small fix |
| Medium | `[M]` | 1–2 hr | Single endpoint, one component, one test suite |
| Large | `[L]` | 2–4 hr | Multi-file feature component, moderate complexity |
| Extra-large | `[XL]` | 4–8 hr | Cross-cutting concern or major integration — **break it down further before starting** |

---

## Requirement Labels

Labels make every requirement traceable from PRD → tasks → retro. They are assigned in
the PRD and referenced everywhere downstream.

| Label | Prefix | What it tags |
|-------|--------|--------------|
| Functional Requirement | `FR-N` | Something the system must do |
| Non-Functional Requirement | `NFR-N` | A performance, security, accessibility, or reliability target |
| User Story | `US-N` | A user-facing story with acceptance criteria |
| Quality Gate | `QG-N` | A lint / format / test / build / review check that must pass |

`N` is a stable integer: assigned once and never renumbered, so references in tasks,
commits, and conversations stay valid. During task decomposition, a risk that needs its
own implementation work is tagged `RISK-N`.

---

## The `plans/` Directory

All planning artifacts for one initiative live in a single dasherized folder under
`plans/`. Active work stays in `plans/<name>/`; completed work moves to
`plans/archive/<name>/`.

```
plans/
├── <active-feature>/         # Active work
│   ├── prd.md                # idea-to-prd — source of truth for intent
│   ├── design.md             # prd-to-design — architecture (optional; non-trivial features)
│   ├── adr/                  # prd-to-design — architecture decision records (NNNN-*.md)
│   ├── tasks.md              # design-to-tasks — derived task list, updated by tasks-to-code
│   ├── decisions.md          # tasks-to-code — implementation decision log
│   ├── review.md             # code-review — optional, multi-round review tracking
│   └── retro.md              # plan-retrospective — added at close-out
└── archive/
    └── <completed-feature>/  # Moved here by plan-retrospective after close-out
        ├── prd.md
        ├── tasks.md
        ├── decisions.md
        └── retro.md
```

- The folder name is lowercase, dasherized, and descriptive (`api-rate-limiting`, not
  `feature1`).
- `prd.md` (and `design.md`, when present) is never modified after tasks are generated —
  it is the historical record of intent and structure. The task list is a derivative artifact.
- `design.md` and `adr/` are optional: `prd-to-design` adds them for non-trivial features,
  and `design-to-tasks` falls back to `prd.md` when they are absent.
- A UI design audit writes its findings as `plans/ui-audit-<date>/prd.md` so they feed
  straight into `design-to-tasks`.
- Not every file exists for every plan; each skill creates the ones it owns.
