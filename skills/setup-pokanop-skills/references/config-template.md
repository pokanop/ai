# Config Template (plans/config.md)

The file `setup-pokanop-skills` writes. Keep every top-level section, even when
the answer is "none" — an explicit "none" tells downstream skills the question
was asked and answered, while a missing section means the repo was never set up.

Copy the skeleton, replace the bracketed guidance, and delete nothing:

```markdown
# Skills Suite Configuration

One-time repo configuration for the pokanop skills suite, written by
`setup-pokanop-skills`. Other skills read this during discovery instead of
re-asking. Edit directly, or re-run `setup-pokanop-skills` for a guided
revision.

## Issue Tracker

- **Tracker:** [GitHub Issues | GitLab Issues | Jira | Linear | local markdown | none]
- **Project / repo:** [e.g. pokanop/ai, or the Jira project key]
- **Ticket references:** [convention for commits/PRs, e.g. "prefix commits with POK-N", or "none"]

[For "other" trackers: one paragraph describing the workflow in the user's own words.]

## Plans and Docs

- **Plans directory:** [`plans/` (suite default) or the agreed alternative]
- **Docs location:** [e.g. `docs/`, a wiki URL, or "none"]

## Coding Conventions

- **Package manager:** [e.g. bun — use it for every install/script command]
- **Quality gates:** [every check command that must stay green, e.g. `bun run validate`, `bun run build`]
- **Convention docs:** [files skills should read first, e.g. `AGENTS.md`, `CONTRIBUTING.md`, or "none"]
- **Notes:** [anything else — formatting tools, naming conventions, directory layout rules]

## Workflows

- **Branch naming:** [e.g. `devin/<timestamp>-<short-name>`, `feat/<slug>`, or "no convention"]
- **Design step:** [when `prd-to-design` is expected — e.g. "non-trivial features only" (suite default)]
- **Review expectations:** [e.g. "run code-review before every PR", or "reviewer's discretion"]
- **Notes:** [any other team preference every skill should respect]
```

## Section guidance

- **Issue Tracker** — the identifier and ticket-reference convention matter more
  than the tracker name: they are what `tasks-to-code` and `code-review` actually
  use when writing commits and PR descriptions.
- **Plans and Docs** — the plans directory should stay `plans/` unless the user
  has a real constraint; the whole suite's tooling and
  [layout conventions](../../_shared/references/conventions.md#the-plans-directory)
  assume it.
- **Coding Conventions** — quality gates listed here are *additive* to whatever
  a skill discovers in the repo: if the repo gains a new check script later, it
  becomes a gate even before the config is updated. Reality wins over the config.
- **Workflows** — record preferences, not policies the repo already enforces
  (branch protection, CI requirements); skills discover enforced rules on their
  own.

## Assumptions

When the user couldn't answer a question during setup, mark the recorded default
inline, e.g.:

```markdown
- **Ticket references:** none *(assumed — no tracker convention found; revisit if one is adopted)*
```
