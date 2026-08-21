# Blameless Analysis Guide

How to get from a timeline to contributing factors without landing on a
scapegoat — human or technical. Used by `incident-postmortem` Phase 3.

## The Blameless Axiom

Everyone involved acted reasonably given the information, tools, and pressures
they had at the time. This is an *analytical* stance, not politeness: if a
reasonable person could make that call in that situation, the same situation
will produce the same call again — so the fix must change the **situation**.

The rewrite discipline:

| Blameful (dead end) | Blameless (actionable) |
|---------------------|------------------------|
| "X deployed without running the tests" | "The deploy path allows shipping without the test gate; nothing enforces it" |
| "The responder wasted 40 minutes on the wrong theory" | "No dashboard correlates deploys with latency, so the recent-deploy hypothesis wasn't checkable" |
| "Y approved a bad config change" | "Config changes have no validation or canary stage; correctness rests on review alone" |

Every rewrite converts an unfixable fact about a person into a fixable fact
about a system — which is exactly what Phase 4 needs.

## Iterative "Why" Analysis

Ask *why* repeatedly — usually around five times — but with two corrections to
the classic technique:

1. **Stop at systems, not people.** If an answer names a human decision, ask
   why the system made that decision available, attractive, or invisible — and
   continue from there.
2. **Branch, don't chain.** Each "why" usually has several true answers.
   Follow each branch; the branches are your contributing factors. Forcing a
   single chain is how postmortems end up with one shallow "root cause".

Worked fragment:

```
Why did checkout fail?            → p99 latency exceeded the timeout
Why the latency?                  → an N+1 query shipped in abc123          [defect]
Why did it ship?                  → no test exercises checkout with >10 items  [detection gap]
Why full impact immediately?      → rollout goes 0→100% with no health gate    [amplification]
Why 14 minutes to detect?         → no latency alert on checkout; paged on errors only [detection gap]
Why 40 minutes on a wrong theory? → no deploy-vs-metrics view for responders   [response friction]
```

One incident, five factors, five distinct action items — versus "root cause:
N+1 query", one fix, and every other hole still open.

## Factor Classification

| Class | The system… | Typical action items |
|-------|-------------|----------------------|
| **Defect** | did the wrong thing (code/config/data) | Fix via `debug-and-fix`, with regression test |
| **Detection gap** | failed and we found out late (or from customers) | Alerts, SLOs, missing test classes, canary signals |
| **Amplification** | let a small failure become a big one | Staged rollouts, circuit breakers, bulkheads, backpressure, quotas |
| **Response friction** | was hard to diagnose or repair under pressure | Runbooks, dashboards, rollback speed, access paths |

Classify every factor: the class tells you what *kind* of work prevents it,
and a postmortem whose factors are all "defect" almost certainly stopped
digging too early.

## Anti-patterns

- **The single root cause.** Real incidents are conjunctions. If your analysis
  fits in one sentence, the branches were pruned prematurely.
- **The scapegoat component.** "The database was slow" is the technical
  version of blaming a person — ask why the system was built such that a slow
  database becomes a user-facing outage.
- **Counterfactual drift.** "If only we had X" is a hypothesis, not a finding.
  Tie every factor to evidence in the timeline.
- **Hindsight fluency.** "It was obviously the deploy" — it is obvious *now*.
  Judge decisions against what responders knew at the time; the gap between
  the two is usually a detection or observability finding.
- **Severity inflation/deflation.** Impact numbers from Phase 1 set severity;
  neither drama nor damage control gets a vote.
- **The wish list.** Action items that restate virtues ("be more careful",
  "improve testing") route nowhere. Every item names concrete work a skill can
  execute.

## Facilitating the Human Side

When responder accounts conflict with logs, trust the logs for *what happened*
and the humans for *what it was like* — both are evidence; they answer
different questions. Collect accounts individually where possible (group
settings converge on the loudest narrative), and close the loop: the draft is
reviewed by the people involved before it is marked `Reviewed`. Their
corrections are data, and their comfort signing it is the blamelessness test.
