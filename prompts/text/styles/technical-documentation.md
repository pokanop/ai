# Technical Documentation

[← Back to Text Prompts](../README.md)

READMEs, API references, tutorials, and architecture docs. The pattern throughout: give the model the raw material (code, specs, notes), name the audience precisely, and enforce a docs structure.

**Best for:** READMEs · API references · Tutorials & how-tos · Architecture decision records · Changelogs

---

## Prompt Variations

**Variation 1 — README from Code**
```text
You are a senior technical writer. Write a README for the project below.

Audience: [AUDIENCE — e.g., developers evaluating whether to adopt this library, 5-minute attention span].

Structure:
1. One-paragraph pitch — what it does and why it exists (no marketing fluff).
2. Quick start — the shortest path to a working example, with copy-paste commands.
3. Core usage — the 2-3 most common operations, each with a code example.
4. Configuration — table of options: name, type, default, description.
5. [OPTIONAL SECTIONS — e.g., troubleshooting, contributing].

Rules: every code example must be runnable as written. Don't document internals the user never touches. If something is unclear from the source, insert a TODO comment rather than guessing.

<source>
[PASTE CODE / PACKAGE FILES]
</source>
```

**Variation 2 — API Endpoint Reference**
```text
Document the API endpoint(s) below as reference documentation.

For each endpoint produce:
- Method + path, one-line description
- Parameters table: name, in (path/query/body), type, required, description
- Request example (curl) with realistic values
- Success response example (JSON) with realistic values
- Error responses: status code, when it happens, example body
- Notes: rate limits, auth requirements, pagination — only if evident from the source

Tone: neutral reference. No tutorials, no "simply". Mark anything you inferred rather than found in the source with "(inferred)".

<source>
[PASTE HANDLER CODE / OPENAPI SPEC / NOTES]
</source>
```

**Variation 3 — Step-by-Step Tutorial**
```text
Write a tutorial: "[TITLE — e.g., Deploying X to Y in 15 minutes]".

Audience: [SKILL LEVEL — e.g., knows Docker basics, has never used Y].
End state: by the end, the reader has [CONCRETE WORKING RESULT].

Format:
- Prerequisites list (with versions) up front.
- Numbered steps. Each step: what to do, the exact command/code, what they should see if it worked.
- One "checkpoint" every 3-4 steps so readers can verify before continuing.
- A troubleshooting section for the 3 most likely failure points.

Rules: never combine two actions in one step. Show expected output after every command that produces any. 

Source material:
[PASTE NOTES / COMMANDS / DOCS]
```

**Variation 4 — Architecture Decision Record**
```text
Write an ADR from the discussion notes below.

Format:
# ADR-[NUMBER]: [TITLE]
## Status: [Proposed/Accepted]
## Context — the forces at play, in 2-3 paragraphs. What problem, what constraints.
## Decision — what we chose, stated in one decisive sentence, then the specifics.
## Alternatives considered — for each: what it was, why rejected (one honest paragraph each).
## Consequences — positive AND negative outcomes we accept. Include follow-up work created.

Rules: past-tense decisions, present-tense consequences. Preserve real disagreements from the notes — an ADR that hides tradeoffs is worthless.

<notes>
[PASTE DISCUSSION / SLACK THREAD / MEETING NOTES]
</notes>
```

---

## 💡 Tips

- **Feed it the source**: docs written from code/specs are accurate; docs written from a description hallucinate flags and defaults.
- **"Mark inferences"** is the honesty switch: telling the model to tag anything not found in the source ("(inferred)", "TODO") catches most fabrication.
- **Name the audience's starting point**: "knows Docker, never used Y" changes what gets explained versus assumed.
- **Enforce runnable examples**: "every example must be runnable as written" forces concrete versions, imports, and values.
- **Pairs well with:** [System Prompts](system-prompts.md), [Summarization & Transformation](summarization-transformation.md)
