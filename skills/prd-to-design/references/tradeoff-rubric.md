# Trade-off & Alternatives Rubric

A decision is only as good as the alternatives it beat. This rubric is how `prd-to-design` weighs options before committing one to an [ADR](adr-template.md): generate real alternatives, score them against consistent criteria, and record why the winner won and each loser lost.

## 1. Generate real alternatives

- Find **at least two** genuine options for any significant decision. If you can only think of one, you have not looked hard enough — or the decision is not significant enough to need an ADR.
- No strawmen. Every alternative listed must be one a competent engineer would actually consider. A rigged comparison fools the next reader and yourself.
- Always include the **"do nothing new" option** — reuse what the project already has. It is the baseline every alternative must beat, because a new component or dependency is a standing cost.

## 2. Score against consistent criteria

Evaluate every option against the same criteria. Weight them by what *this* decision and the PRD's requirements actually care about — latency-critical features weight performance heavily; an internal tool weights simplicity.

| Criterion | The question it answers |
|-----------|-------------------------|
| **Requirement fit** | Does it satisfy the `FR-N` / `NFR-N` this decision serves? A no here is disqualifying. |
| **Simplicity** | How much complexity does it add to build, understand, and operate? |
| **Reversibility** | If we are wrong, how cheaply can we undo it? (See one-way vs. two-way doors below.) |
| **Reuse** | Does it use existing components, patterns, and dependencies, or add new ones? |
| **Operability** | Cost to deploy, monitor, back up, and debug in production. |
| **Risk / maturity** | Is the approach (or dependency) proven, and does the team know it? |
| **Cost** | Infrastructure, licensing, and ongoing maintenance burden. |

A lightweight scored matrix makes the trade-off explicit:

```
Criterion (weight)      Postgres+JSONB   MongoDB   EAV table
Requirement fit (×3)         ✓✓            ✓✓         ✓
Simplicity (×2)              ✓✓            ✓          ✗
Reuse (×2)                   ✓✓            ✗          ✓✓
Operability (×2)             ✓✓            ✗          ✓✓
Risk/maturity (×1)           ✓✓            ✓          ✓
→ winner: Postgres+JSONB (reuses the datastore we already run)
```

The matrix is an aid to thinking, not an oracle. If the scores say one thing and judgment says another, trust judgment — and write down *why* in the ADR.

## 3. Weigh reversibility first

Sort the decision by how hard it is to undo, because that sets how much rigor it deserves:

- **One-way doors** (expensive or impossible to reverse): storage engine, public API contract, data ownership model, auth model, a dependency that spreads through the code. Spend the analysis. These always get an ADR.
- **Two-way doors** (cheap to reverse): an internal helper's shape, a library for a contained concern, a cache policy. Pick a reasonable option, note it, and move on. Do not over-analyze a decision you can change in an afternoon.

Most decisions are two-way doors. Spending one-way-door rigor on a two-way-door decision is its own failure mode — analysis paralysis is a cost too.

## 4. Decide and record

- State the decision in one unambiguous sentence.
- Record **why the chosen option wins** and, for each alternative, **the specific reason it lost** in this context. "Simpler" or "faster" alone is not a reason — say simpler or faster *at what cost*.
- Note the **consequences you are accepting**, especially the negative ones. The option you picked has downsides; if you cannot name them, you have not understood the trade-off.
- If the call is genuinely close or contested, say so and record what would change the decision. A close call documented honestly ages better than false confidence.

## When to write an ADR vs. a one-line note

| Situation | Where it goes |
|-----------|---------------|
| One-way door, or reasonable alternatives existed, or it shapes multiple components | A full [ADR](adr-template.md) |
| Two-way door, low stakes, obvious choice | A one-line entry in the design's Key Decisions table |
| Pure implementation detail with no architectural reach | Leave it to `tasks-to-code` and its `decisions.md` |

When in doubt, prefer the lighter record. An ADR for a trivial choice buries the decisions that matter under noise.
