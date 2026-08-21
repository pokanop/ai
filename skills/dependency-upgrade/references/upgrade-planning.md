# Upgrade Planning

How to turn an outdated-dependencies report into an ordered, risk-batched
upgrade plan. Used by `dependency-upgrade` Phases 1–2.

## Risk Classification

Score each candidate bump on two axes:

### Semver distance

| Distance | Nominal meaning | Real-world caution |
|----------|-----------------|--------------------|
| **Patch** (`1.2.3 → 1.2.4`) | Bug fixes only | Usually safe in batches — but a patch can still change behavior your code accidentally depended on |
| **Minor** (`1.2.x → 1.5.0`) | Additive features | Safe-ish in batches; watch for deprecation warnings that foreshadow the next major |
| **Major** (`1.x → 2.0`) | Breaking changes | Always its own stage; read the migration guide first |
| **0.x anything** | No stability contract | Treat every 0.x bump as a potential major |

### Load-bearing weight

| Category | Examples | Handling |
|----------|----------|----------|
| **Framework / runtime** | React, Django, Rails, the language toolchain | Own stage, first in order, migration guide mandatory |
| **Build & test toolchain** | Bundler, compiler, test runner, linter | Own stage; failures here masquerade as app failures |
| **Widely-imported library** | HTTP client, ORM, date library | Own stage for majors; grep the codebase for its API surface |
| **Leaf utility** | A formatter used in two files | Batchable, even across majors if the changelog is trivial |
| **Type/lint-only** | `@types/*`, lint plugins | Batchable; failures are compile-time and obvious |

## Batching Rules

1. All-patch/minor **leaf** updates → one batch, one commit, one gate run.
2. Each **major** → its own stage.
3. Each **framework/toolchain** bump (any distance) → its own stage.
4. A package and its **plugin family** (e.g. a framework and its official
   adapters) move together in one stage — they are one compatibility surface.
5. Cap batch size at what you can attribute a failure to; ~10 trivial bumps is
   fine, 40 is an unreviewable diff.

## Stage Ordering

Order stages so each one lands on a foundation that already supports it:

1. Language / runtime version (if in scope)
2. Build and test toolchain
3. Framework majors, with their plugin families
4. Widely-imported library majors
5. The batched leaf/minor/patch remainder
6. Type/lint-only cleanup

If a bump requires another bump (peer-dependency constraints), the dependency
graph — not this list — wins; note the forced coupling in the plan.

## Reading Changelogs Effectively

For each staged bump, crossing versions `a.b.c → x.y.z`:

- Read the notes for **every release between** the two, not just `x.y.z`. In
  monorepos, read the specific package's changelog, not the umbrella one.
- Extract three lists: **breaking changes** (must act), **deprecations** (act
  now or note for next time), **behavior changes** (verify the affected paths).
- Map each breaking change to concrete call sites with a codebase search
  *before* bumping. An empty result set is evidence of safety; a long one
  might justify deferring the bump into its own plan.
- Prefer the project's **official migration guide and codemods** over manual
  edits — they encode edge cases the changelog omits.
- No changelog at all? That is itself a risk signal — inspect the source diff
  between tags, or defer the bump.

## When a Stage Fails

1. Read the failure against the changelog's breaking-change list. A named,
   expected breakage → fix forward mechanically.
2. An *unexplained* failure → revert the stage cleanly and investigate
   separately. Debugging forward on an unverified bump conflates two unknowns.
3. A failure revealing the app depended on undocumented behavior → the fix may
   be genuine `debug-and-fix` work; the bump waits until the app is correct.
4. Record deferred bumps and their blockers in the report — an upgrade plan
   whose failures evaporate silently will re-litigate them next quarter.
