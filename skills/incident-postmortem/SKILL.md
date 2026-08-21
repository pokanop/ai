---
name: incident-postmortem
description: Write a blameless postmortem for an incident or outage and turn it into tracked follow-up work. Use when the user asks to "write a postmortem", "do an incident review", "write up the outage", "analyze what went wrong in production", "do a root cause analysis of the incident", or "run a blameless retro on the incident". Reconstructs a factual timeline from evidence, identifies contributing factors rather than a single root cause or a person to blame, and produces prioritized action items that route into the pipeline — defect fixes to debug-and-fix, systemic prevention work emitted as a PRD for design-to-tasks.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Incident Postmortem

## Purpose

An incident that ends at "service restored" will happen again. The suite has skills for fixing what is broken ([`debug-and-fix`](../debug-and-fix/)) and for closing out planned work ([`plan-retrospective`](../plan-retrospective/)) — but nothing that looks at an *unplanned* failure and asks the only questions that buy future reliability: **what actually happened, why was the system able to fail this way, and what work prevents the class — not just the instance?**

This skill produces a **blameless postmortem**: an evidence-based timeline, a contributing-factors analysis (never a single scapegoat cause, never a named culprit), and a set of prioritized action items that enter the development pipeline as real, tracked work instead of dying in a document. Like the audit skills, it can emit its remediation work as a PRD — the postmortem *is* the requirements document for the prevention work.

## Triage Before You Start

| The situation is… | Is it this skill? | Route to |
|-------------------|-------------------|----------|
| The incident is **over** (or stable) and needs analysis | ✅ Yes | This skill |
| The system is **still down or degrading** | ❌ No | [`debug-and-fix`](../debug-and-fix/) — restore first; analysis needs a stable patient |
| A specific defect found during analysis needs fixing | ❌ Not here | Each becomes an action item routed to [`debug-and-fix`](../debug-and-fix/) |
| Closing out a *planned* body of work | ❌ No | [`plan-retrospective`](../plan-retrospective/) — retros close plans; postmortems analyze failures |
| A general "is our posture sound?" concern, no incident | ❌ No | [`security-review`](../security-review/) / [`performance-review`](../performance-review/) — audits don't need an outage to run |

## Inputs

A postmortem is only as good as its evidence. Gather what exists before writing:

1. **Impact facts** — what was affected, for whom, from when to when. Severity claims come from these facts, not adjectives.
2. **The record** — alerts, dashboards/graphs, logs, deploy history, chat transcripts from the response, the commits or config changes in the suspect window.
3. **Responder accounts** — what people saw, decided, and did, *as they experienced it at the time*. Collected to reconstruct the timeline, never to assign fault.

If the fix is already known or applied, capture it — but a postmortem that stops at "the fix" has answered the smallest of its three questions.

## Workflow

### Phase 1: Establish Impact and Severity

State plainly, with numbers where they exist: duration, scope (users/requests/data affected), functional impact (what users couldn't do), and any data or financial consequence. Classify severity on the shared [severity scale](../_shared/references/conventions.md#severity-and-priority) so the follow-up work inherits honest priorities.

### Phase 2: Reconstruct the Timeline

Build a single chronological record from first triggering event to full resolution, using the format in [references/postmortem-schema.md](references/postmortem-schema.md):

- Every entry is **timestamped, factual, and sourced** (an alert, a log line, a deploy, a human action, a decision). Interpretation comes later; the timeline records only what happened.
- Mark the load-bearing instants: first user impact, **detection** (how did we find out — an alert or a customer?), diagnosis, mitigation, resolution. The gaps between them (time-to-detect, time-to-mitigate) are findings in themselves.
- Include the dead ends. A responder spending 40 minutes on a wrong theory usually indicates missing observability — that is an action item, not an embarrassment.

### Phase 3: Analyze Contributing Factors

Resist the single root cause. Real incidents are conjunctions — a defect *and* a missing test *and* an alert gap *and* a risky deploy practice all lined up. Using [references/analysis-guide.md](references/analysis-guide.md):

1. **Ask "why" past the first answer** — from the trigger down through the defect, the process that admitted it, and the detection gap that let it grow. Stop at *systemic* factors, not at a person.
2. **Blameless means system-focused**: every "human error" is rewritten as the system condition that made the error possible or undetectable ("the deploy script allowed a partial rollout with no health check" — not "X deployed it wrong"). People acting reasonably on the information they had is the axiom, not the question.
3. **Classify each factor**: defect (code/config wrong), detection gap (found out too late), amplification (small failure became large), response friction (fixing it was harder than it should be). The classes map to different kinds of action items.
4. **Note what went well** — the mitigations, safeguards, and calls that limited the blast radius. Reinforcing what worked is as much a postmortem output as fixing what didn't.

### Phase 4: Derive Action Items That Actually Route

Every action item must be **specific, owned, prioritized, and routed** — "improve monitoring" is a wish, not an action item. For each contributing factor, derive work and route it via the canonical [routing table](../_shared/references/conventions.md#routing):

| Action item kind | Routes to |
|------------------|-----------|
| Fix a specific defect that contributed | [`debug-and-fix`](../debug-and-fix/) — with the postmortem's evidence as the bug report |
| Systemic prevention/detection work (new safeguards, alerting, rollout changes) | Emit as a findings PRD → [`design-to-tasks`](../design-to-tasks/), like the audit skills |
| A posture concern the incident merely hinted at | [`security-review`](../security-review/) / [`performance-review`](../performance-review/) for a proper sweep |
| Structure-only cleanup that impeded the response | [`refactor`](../refactor/), as a Future Opportunity |

Prioritize with the shared severity↔priority scale — recurrence-preventing items for a Critical incident are `[P0]`, hardening is `[P1]`/`[P2]`. A postmortem with fifteen P0s has not prioritized.

### Phase 5: Write and File the Postmortem

Write `plans/incident-<date>-<slug>/postmortem.md` using the full schema in [references/postmortem-schema.md](references/postmortem-schema.md): summary, impact, timeline, contributing factors, what went well, action items. When systemic work was derived in Phase 4, write it as `prd.md` in the same folder (using [../idea-to-prd/references/prd-schema.md](../idea-to-prd/references/prd-schema.md)) so it enters the pipeline at `design-to-tasks` exactly like an audit's findings.

Review the draft against one test before presenting: **could every named person read this without flinching, and does every action item name work rather than a wish?**

## Key Principles

**Blameless is a method, not a courtesy.** The moment a postmortem can blame, people stop giving it accurate information, and the next one is fiction. Name systems and conditions, never culprits.

**The timeline is evidence, not narrative.** Timestamped facts with sources. If detection time is embarrassing, it goes in anyway — the embarrassment is the finding.

**Contributing factors, not root cause.** A single root cause is almost always the analysis stopping early. Enumerate the conjunction; each factor is a separate prevention opportunity.

**Fix the class, not the instance.** The defect fix restores yesterday's reliability. The action items that change detection, rollout, or design are what make the *class* of incident rarer.

**Action items are work, or they are decoration.** Routed, prioritized, owned — into `debug-and-fix` or through a PRD into the pipeline. A postmortem whose follow-ups live only in the document has produced a eulogy.

## References

- [references/postmortem-schema.md](references/postmortem-schema.md) — Full postmortem document structure: summary, impact, timeline format, contributing factors, action items
- [references/analysis-guide.md](references/analysis-guide.md) — Blameless facilitation, iterative "why" analysis, contributing-factor classification, and anti-patterns
- [../idea-to-prd/references/prd-schema.md](../idea-to-prd/references/prd-schema.md) — PRD structure for emitting systemic remediation work (shared reference)
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — Canonical routing table, severity↔priority scale, and the `plans/` layout (single source of truth)
