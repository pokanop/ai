# Implementation Guide

Principles for writing code within the `tasks-to-code` workflow. These rules apply to every task, regardless of size or language.

## Pattern-First Principle

Before writing any code, find how the project already does the thing the task requires.

**Steps:**
1. Identify the closest analogous feature already in the codebase (e.g., if implementing a new API endpoint, find an existing endpoint in the same layer)
2. Study its structure: file location, naming, imports, error handling, response shape, test approach
3. Follow that pattern — don't invent a new one

The goal is that a new file or function should look like it was always part of the project, not like it was introduced by an outside agent.

**When no pattern exists:**
If there is genuinely no analogous pattern for what the task requires (common in early phases of a new project), reason from the project's general conventions (naming, file structure, import style) and document the choice in `decisions.md` as an "establishes pattern" decision. Future tasks will then have a pattern to follow.

## File Placement and Naming

Follow existing conventions exactly:

| Convention | How to Detect |
|------------|--------------|
| **Directory structure** | Where do similar files live? (`src/routes/`, `app/api/`, `lib/`, etc.) |
| **Naming style** | camelCase, kebab-case, PascalCase, snake_case? Check neighboring files. |
| **File extensions** | `.ts`, `.tsx`, `.js`, `.py`? What do existing files in the same directory use? |
| **Index files / barrel exports** | Does the project use `index.ts` re-exports? Follow the same pattern. |
| **Test file co-location** | Are tests co-located (`Component.test.tsx`) or in a separate `__tests__/` directory? |

Never create a new directory structure or naming convention without logging it as an "establishes pattern" decision.

## Minimal Footprint

Implement only what the task's acceptance criteria require. Nothing more.

**Prohibited without explicit task scope:**
- Refactoring adjacent code that isn't broken
- Adding extra error cases not in the acceptance criteria
- Improving performance of unrelated functions
- Adding logging, comments, or documentation not specified
- Extending a function's behavior "while you're in there"

**If you identify a genuine improvement:**
Note it in `decisions.md` under `## Future Opportunities`. Do not implement it now. Gold-plating is a risk to task focus and can introduce unintended regressions.

## Dependency Discipline

Prefer extending existing dependencies over adding new ones.

**Before adding any new library:**
1. Check whether an existing dependency already provides the capability
2. Check whether the standard library / built-in APIs are sufficient
3. If a new dependency is truly needed, add it and record the justification in `decisions.md`

**Format for justifying a new dependency:**
```
New dependency: <package-name>
Reason: <what it provides that nothing existing can>
Alternatives considered: <what was checked first>
```

## Error Handling

Follow the project's existing error handling patterns, not generic ones.

**How to detect the pattern:**
- Look at how existing functions at the same layer handle errors (do they throw? return `Result` types? use error callbacks? return `null`?)
- Look at how the API layer formats error responses (does it use a shared error class? a specific status-code mapping? a standard JSON envelope?)
- Look at how the frontend handles async failures (toast notifications? error boundaries? inline messages?)

**Apply that same pattern in your implementation.** Do not introduce a new error handling style unless the PRD explicitly calls for one and the task's acceptance criteria require it.

## Atomicity

Each task's implementation should be a complete, independently verifiable unit of work.

This means:
- The code compiles and passes quality gates as-of the task's completion (not "it'll work once the next task is done")
- If the task involves both a backend change and a frontend change, both are included in the same task's implementation (as specified)
- Database migrations are included alongside the schema change they support

If a task's scope turns out to be too large to implement atomically in one session, do not implement it partially and mark it `[x]`. Instead:
1. Complete what you can
2. Mark the task `[!]` with a note on what remains
3. Suggest splitting the task to the user

## Surfacing Unknowns

Some unknowns are worth stopping for; most are not.

**Stop and ask the user when:**
- The implementation approach would materially change based on the answer (e.g., whole different architecture)
- The acceptance criteria are genuinely ambiguous and cannot be interpreted correctly without clarification
- A security or data-integrity decision is involved

**Make a reasonable assumption and log it when:**
- The choice is between two equivalent conventions (e.g., which of two valid naming styles to use)
- The choice is reversible with low effort
- The choice affects only this task and not future tasks

When assuming, always log the assumption in `decisions.md` so it can be reviewed and overridden if needed.
