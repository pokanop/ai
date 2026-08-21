# Research Synthesis

[← Back to Text Prompts](../README.md)

Literature reviews, competitive analysis, and multi-source synthesis with explicit evidence grading. The core discipline: separate what the sources say from what the model concludes, and make it cite as it goes.

**Best for:** Literature reviews · Competitive analysis · Market research · Due diligence · Decision memos

---

## Prompt Variations

**Variation 1 — Multi-Source Synthesis with Evidence Grading**
```text
You are a research analyst. Synthesize the sources below to answer: [RESEARCH QUESTION].

Method:
1. Extract the relevant claims from each source, citing as [S1], [S2], etc.
2. Group claims into themes. Note where sources agree, disagree, or talk past each other.
3. Grade the evidence for each theme: STRONG (multiple independent sources), MODERATE (single credible source), WEAK (indirect or dated).

Output:
## Answer — 3-4 sentences, direct
## Themes — for each: finding, evidence grade, citations, and any dissent
## Gaps — what the sources don't cover that the question needs
## Confidence — overall, with one sentence why

Rules: every factual claim carries a citation. Never average away disagreement — surface it. Nothing in the Answer that isn't supported in Themes.

<sources>
[S1]: [PASTE SOURCE 1]
[S2]: [PASTE SOURCE 2]
[S3]: [PASTE SOURCE 3]
</sources>
```

**Variation 2 — Competitive Analysis**
```text
Analyze these competitors for [OUR PRODUCT/COMPANY + ONE-LINE DESCRIPTION].

For each competitor, using only the provided material:
- Positioning: who they target and the promise they make (quote their own words where possible)
- Strengths / weaknesses relative to us — be specific, no generic "strong brand"
- Pricing & packaging, if available; otherwise mark UNKNOWN

Then synthesize:
- A positioning map: the 2 axes that best differentiate this market, and where everyone sits
- The gap: the segment or promise no one owns, and whether we credibly can
- Threats: which competitor hurts us most and the leading indicator to watch

Mark every inference that goes beyond the provided material with "(inference)".

<material>
[PASTE COMPETITOR PAGES / REVIEWS / NOTES]
</material>
```

**Variation 3 — Paper/Report Breakdown**
```text
Break down the paper/report below for [AUDIENCE — e.g., a product team with no statistics background].

## What they did — method in plain language, 2-3 sentences
## What they found — the key results, with the actual numbers
## How much to trust it — sample size, methodology limits, conflicts of interest, and whether the conclusions match the data
## What it means for us — implications for [OUR CONTEXT], clearly labeled as interpretation
## One-line takeaway

Rules: keep the authors' claims and your assessment visibly separate. If the abstract oversells the results, say so.

<document>
[PASTE PAPER / REPORT]
</document>
```

**Variation 4 — Decision Memo from Research**
```text
Write a decision memo: should we [DECISION — e.g., adopt technology X]?

Base it only on the research notes below. Structure:
## Recommendation — one sentence, decisive
## Why — the 3 strongest reasons, each tied to evidence from the notes
## Risks — the 2-3 strongest counterarguments, steelmanned honestly
## What would change our mind — specific, observable triggers
## Open questions — what we'd need to learn to raise confidence

Length: under 600 words. If the evidence genuinely doesn't support a recommendation, say "insufficient evidence" and specify exactly what's missing.

<notes>
[PASTE RESEARCH NOTES]
</notes>
```

---

## 💡 Tips

- **Citations as you go**: requiring [S1]-style citations on every claim is the single best hallucination control for synthesis work.
- **Grade, don't flatten**: forcing STRONG/MODERATE/WEAK labels stops the model from presenting one blog post and a meta-analysis with equal confidence.
- **Preserve disagreement**: models instinctively harmonize conflicting sources — explicitly instruct them to surface dissent.
- **Steelman the other side**: in decision memos, demand honest counterarguments; a memo with no real risks section is advocacy, not analysis.
- **Pairs well with:** [Prompt Engineering Guide](prompt-engineering-guide.md), [Summarization & Transformation](summarization-transformation.md)
