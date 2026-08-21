# Skill Evals

Agent-in-the-loop evaluation scenarios for the skills in [`skills/`](../skills/).

## Philosophy: Start with Evaluation

Per Anthropic's skill-authoring guidance, a skill should be developed against
evaluations, not vibes: define concrete scenarios with fixture inputs and
machine-checkable expectations *first*, then iterate on the skill until an
agent running it passes them. These evals make skill regressions observable —
when a skill's instructions change, re-run the scenarios and grade the output
deterministically instead of eyeballing it.

The split of responsibilities:

- **The agent does the skill work** — a human points an agent at a scenario's
  input fixtures and the skill under test. This part cannot run in CI: it needs
  a live agent.
- **The runner grades the output deterministically** — stdlib-only Python that
  applies each scenario's machine-checkable expectations to the artifacts the
  agent produced.

Each scenario also commits a `sample_output/` — a known-good artifact produced
by actually running the skill. It serves two purposes: it is the reference for
what a passing artifact looks like, and it keeps the grader itself exercised —
a full `python3 evals/run.py` on a fresh checkout grades every scenario
against its sample instead of skipping everything.

Because the generation half is agent-in-the-loop, **these evals are not (and
must not become) a required CI gate**. They are a manual authoring tool.

## Running an Eval

1. Pick a scenario, e.g. `scenarios/design-to-tasks/basic-prd/`. Read its
   `scenario.json` — the `prompt` field is what you give the agent, and
   `input/` holds the fixtures it works from.

2. In a scratch directory (or a throwaway branch), have an agent run the skill
   with the scenario's inputs. Example for `design-to-tasks`:

   > Using the design-to-tasks skill, generate a task list for the PRD at
   > `evals/scenarios/design-to-tasks/basic-prd/input/prd.md`. Write the
   > result to `evals/scenarios/design-to-tasks/basic-prd/output/tasks.md`.

3. Grade the output:

   ```bash
   python3 evals/run.py                                   # all scenarios
   python3 evals/run.py design-to-tasks/basic-prd         # one scenario
   ```

   A scenario with a live `output/` directory is graded against it. Without
   one, the runner falls back to the committed `sample_output/` (labeled
   `(sample_output)` in the report), so a full run always grades every
   scenario. Only a scenario with neither directory is reported as SKIP.
   Exit code is non-zero if any graded scenario fails.

`output/` directories are scratch space — they are gitignored and never
committed. `sample_output/` directories are committed reference artifacts;
update one only by re-running the skill and re-grading.

## Scenario Layout

```
evals/
├── run.py                          # stdlib-only grader
└── scenarios/
    └── <skill-name>/
        └── <scenario-name>/
            ├── scenario.json       # prompt + expectations
            ├── input/              # committed fixtures the agent works from
            ├── sample_output/      # committed known-good artifact (graded fallback)
            └── output/             # agent-produced artifacts (gitignored)
```

Check paths in `scenario.json` always use the `output/` prefix; when the
runner grades a `sample_output/`, it remaps the prefix automatically.

`scenario.json` fields:

| Field | Meaning |
|-------|---------|
| `skill` | The skill under test (must match a `skills/<name>/` directory) |
| `description` | What the scenario exercises |
| `prompt` | The instruction to give the agent |
| `checks` | Ordered list of machine-checkable expectations (below) |

Check types (paths are relative to the scenario directory):

| `type` | Behavior |
|--------|----------|
| `file_exists` | `path` must exist in the output |
| `plan_validate` | Run `skills/_shared/scripts/plan-validate.py <tasks> --prd <prd> --strict`; exit 0 required. Fields: `tasks`, optional `prd` |
| `regex` | `pattern` must match the contents of `path` (multiline mode) |
| `regex_absent` | `pattern` must NOT match the contents of `path` |
| `min_count` | `pattern` must match at least `count` times in `path` |

## Adding a Scenario

1. Create `scenarios/<skill>/<scenario-name>/` with an `input/` fixture that is
   small, self-contained, and committed.
2. Write `scenario.json` with a precise `prompt` and the strictest checks that
   are deterministic. Prefer the shared plan tooling (`plan_validate`) over
   ad-hoc regexes where it applies — it already encodes the suite's structural
   contract for `tasks.md`.
3. Run the agent, then `python3 evals/run.py <skill>/<scenario-name>` until the
   scenario passes for the right reasons.
4. Commit the passing artifact as `sample_output/` (copy `output/` over and
   drop anything extraneous) so future full runs grade the scenario without a
   live agent run.

Keep checks about **structure and contract** (labels present, tooling passes,
required sections exist), not about wording — agent output varies; the
contract must not.
