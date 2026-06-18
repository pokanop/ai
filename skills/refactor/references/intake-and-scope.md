# Intake and Scope

How a refactor starts: where the work comes from, how to confirm it is actually a refactor, and how to keep it boxed so a cleanup does not metastasize into a rewrite.

---

## Where Refactor Work Comes From

A refactor target usually arrives one of three ways:

| Source | What it looks like |
|--------|--------------------|
| **A deferred Future Opportunity** | An entry in `plans/<name>/decisions.md` or `plans/<name>/retro.md` recorded by `tasks-to-code`, `code-review`, or `plan-retrospective` when an improvement was noticed but kept out of scope. |
| **A direct request** | "Refactor this", "clean up X", "reduce the duplication in Y", "extract Z". |
| **A code-review suggestion** | A 🟡 Suggestion or "Future Opportunities" item from a `code-review` pass that is structural, not behavioral. |

This skill is the consumer end of the suite's no-gold-plating discipline. The other skills *defer* improvements on purpose so a task or fix stays focused; this skill is where those deferred, behavior-preserving improvements get executed deliberately and safely.

---

## Consuming a "Future Opportunity"

Future Opportunities are written in a consistent shape (see `../../tasks-to-code/references/decision-log.md` and `../../plan-retrospective/references/retro-schema.md`):

```markdown
## Future Opportunities

- **[Noticed during Task 2.3]**: The rate limiter could be extracted to a shared
  middleware for use across all API routes (currently duplicated on auth endpoints).
```

When consuming one:

1. **Read the entry and its context.** The decision or retro around it usually says *why* it was deferred (time, risk, out of task scope) and what constraints apply.
2. **Re-confirm it is still valid.** Code moves. Verify the duplication / tangle / smell the entry describes still exists before acting on it.
3. **Triage it** (next section). Many "opportunities" are actually new features or behavior changes wearing a cleanup's clothing — those do not belong here.
4. **Translate it into a concrete structural goal** — one sentence naming the transformation, not a vague aspiration.

Future Opportunities are an informational list, not a tracked backlog. Executing one does not require ceremony — but it does require the same triage and safety net as any other refactor.

---

## Triage: Is This Actually a Refactor?

A refactor changes **structure**, never **observable behavior**. Run every candidate through this gate:

| The change… | Refactor? | Route |
|-------------|-----------|-------|
| Restructures code; same inputs → same outputs, errors, side effects, API | ✅ Yes | This skill |
| Adds / removes / changes a feature or any output | ❌ No | `create-a-prd` → `prd-to-tasks` → `tasks-to-code` |
| Corrects wrong behavior | ❌ No | `debug-and-fix` |
| Changes a public API, schema, or contract other code relies on | ⚠️ Not pure | The contract change is a feature (PRD); internal cleanup can follow as a refactor |
| Changes performance characteristics | ⚠️ Careful | Refactor only if outputs are provably identical *and* you have a before/after benchmark; otherwise it is a feature with its own acceptance criteria |
| Upgrades a dependency or changes build config | ❌ Usually not | Behavior/compatibility risk; treat as its own change with verification, not a refactor |

**The bright line:** if you cannot guarantee that every existing test passes *unchanged* afterward, it is not a refactor. Stop and route it.

### Why misclassification is dangerous

A feature has acceptance criteria; a bug fix has a regression test. A refactor has neither — its only safety guarantee is "behavior didn't change." If you let a behavior change ride in disguised as a refactor, nothing in the process is designed to catch the regression. That is precisely why the triage gate is strict.

---

## Boxing the Scope

Before the first change, write down the box:

- **In scope:** the specific files / modules / functions being restructured.
- **Out of scope:** everything else — stated explicitly, including the tempting adjacent cleanups.
- **The goal:** one sentence. *"Extract the duplicated retry loop from `client.ts` and `worker.ts` into a shared `withRetry` helper, with no change to retry timing or error propagation."*

### No-gold-plating applies recursively

Refactoring is itself subject to the rule it helps the suite enforce. While restructuring, you *will* notice more things worth improving — that is the nature of reading code closely. Do not chase them. Each one you act on widens the diff, dilutes the review, and raises regression risk.

Instead, record them where the rest of the suite records deferred work:

```markdown
## Future Opportunities

- **[Noticed during refactor of client.ts]**: `worker.ts` also duplicates the
  back-off calculation — candidate for the same extraction in a follow-up.
```

A focused refactor that does one thing well and leaves a breadcrumb for the next one beats a sprawling one that does five things and can't be reviewed.

### Sizing

If the boxed refactor is genuinely large (many transformations across many files), prefer to split it into several smaller, independently-verifiable refactors rather than one marathon session. Each should leave the suite green and the codebase shippable. A refactor that can only be verified "all at once at the end" is too big.

---

## When to Decline

Some refactors are not worth doing, or not safe to do right now. Say so rather than proceeding:

- **No safety net is achievable.** If the target's behavior cannot be put under test even with a reasonable enabling change, surface the risk before restructuring — an unverifiable refactor is a gamble.
- **The baseline is red.** Failing tests mean there is a bug to fix first; refactoring on a broken baseline hides which change broke what.
- **The "opportunity" is stale or already done.** Confirm the smell still exists.
- **It is really a feature.** Route it to the PRD chain instead of stretching the definition of "refactor."
