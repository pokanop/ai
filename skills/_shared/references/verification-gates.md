# Verification Gates

The single source of truth for how skills in this suite verify their own claims.
Every lifecycle skill has moments where it is tempting to declare success —
"tests should pass now", "the criteria look satisfied", "this is obviously
done." This reference defines the gates that stand between that temptation and
the claim. When a skill says "run the verification gate", it means this file.

If any skill's wording disagrees with this file, **this file wins** — fix the
skill, not this reference.

---

## The Iron Law

```
NO CLAIM OF SUCCESS WITHOUT FRESH EVIDENCE FROM THIS SESSION
```

A claim — "tests pass", "the bug is fixed", "the task is complete", "behavior
is unchanged", "every requirement is covered" — is only allowed **after**
running the command or check that proves it, in the current state of the code,
and reading its full output. A previous run does not count. A partial run does
not count. Confidence does not count.

Rewording the claim does not exempt it. "Should pass", "looks correct",
"probably fine", and "I'm confident" are success claims wearing a disguise —
the gate applies to paraphrases and implications exactly as it applies to the
words "it works".

## The Gate Sequence

Before making any claim of completion, correctness, or preservation:

1. **Identify** — what command or concrete check proves this specific claim?
2. **Run** — execute it fully, fresh, against the current state.
3. **Read** — the entire output: exit code, counts, failures, warnings.
4. **Compare** — does the output actually support the claim?
   - **No** → report the real state, with the evidence. Do not soften it.
   - **Yes** → make the claim, citing the evidence.

Skipping any step and claiming anyway is not verifying — it is guessing with
authority.

## What Counts as Evidence

| Claim | Required evidence | Not sufficient |
|---|---|---|
| Tests pass | Full test run in this session: 0 failures | Earlier run, subset run, "should pass" |
| Quality gates green | Every discovered gate run: all exit 0 | The gates near the change, extrapolation |
| Bug is fixed | Original reproduction steps no longer trigger it | Root cause "addressed", code changed |
| Regression test works | Test fails on unfixed code, passes on fixed | Test passes once on fixed code |
| Behavior unchanged (refactor) | Same tests green **and** `git diff` shows no test edits | Green suite alone |
| Acceptance criteria met | Each criterion individually checked and ticked | "Tests pass so the task is done" |
| Requirements covered | `plan-validate.py` clean run | Eyeballing the task list |
| Statistics current | `plan-metrics.py` output copied in | Hand-adjusted counts |
| Document complete | Every checklist item verified against the draft | "I followed the schema" |

## Anti-Rationalization Table

These thoughts are the failure mode this reference exists to stop. Each one
feels reasonable in the moment; each one ships unverified work.

| Rationalization | Reality |
|---|---|
| "It should work now" | Run it. "Should" is a hypothesis, not evidence. |
| "The tests passed earlier" | Earlier is a different codebase. Run them again. |
| "This change is too small to break anything" | Small changes break things constantly. The gate is cheap; the regression is not. |
| "I'll verify at the end, after the next few steps" | Batched verification hides which step broke it. Verify at each gate. |
| "The lint/typecheck passed, so it builds" | Different tools check different things. Run each gate. |
| "I'm confident in this fix" | Confidence is a feeling. The reproduction steps are the test. |
| "Marking it done, the criteria are basically met" | "Basically" means at least one criterion was not checked. Check it. |
| "Re-checking would just waste time" | One command now versus a debugging session later. |
| "The user is waiting; I'll skip the checklist just this once" | The exceptions become the norm. No exceptions. |
| "The script's count disagrees, but my count is right" | The deterministic script is the arbiter. Fix the data, not the tally. |
| "I only changed a test/doc/comment, gates don't apply" | If a gate command exists, it applies. Run it. |
| "It's a different phrasing, so the rule doesn't apply" | The rule covers paraphrases and implications. Spirit over letter. |

## Red-Flag Phrases

If any of these appear in your reasoning or your report, stop — you are about
to make a claim without evidence:

- "should work", "should pass", "probably fine", "seems to"
- "I'm confident", "clearly", "obviously done"
- Any expression of satisfaction ("Great!", "Done!") before the gate has run
- "Basically complete", "essentially passing", "almost certainly"
- Marking `[x]` on a task or checklist item you did not individually verify

## Where the Gates Sit in This Suite

Each lifecycle skill names its own gate at the point where the claim is made;
this table is the map, the skills define the details.

| Skill | Gate moment | The claim being gated |
|---|---|---|
| `idea-to-prd` | Phase 2.5 self-validation | "The PRD is complete and well-formed" |
| `prd-to-design` | Phase 5 self-validation | "The design covers every requirement" |
| `design-to-tasks` | Phase 3.5 + `plan-validate.py` | "Every requirement has a task" |
| `tasks-to-code` | Phase 5 verify, before `[x]` | "This task is done" |
| `code-review` | Before delivering the review | "These findings reflect the actual change" |
| `debug-and-fix` | Phase 4 verify + red-green regression test | "The bug is fixed and stays fixed" |
| `refactor` | Phase 4, tests + `git diff` on test files | "Behavior is unchanged" |
| `write-tests` | Phase 5, full suite + watch-it-fail | "These tests protect the behavior" |

The deterministic helpers (`plan-validate.py`, `plan-metrics.py` in
`_shared/scripts/`) exist precisely because hand-counting invites
rationalization — when a script can be the arbiter, run the script.
