# Summarization & Transformation

[← Back to Text Prompts](../README.md)

Summaries, rewrites, tone shifts, and format conversions — the workhorse tasks. The key controls: who the summary is *for*, what they'll *do* with it, and a hard length budget.

**Best for:** Meeting notes · Executive summaries · Tone rewrites · Format conversion · Repurposing content

---

## Prompt Variations

**Variation 1 — Audience-Targeted Summary**
```text
Summarize the document below for [READER — e.g., a CFO deciding whether to attend the full briefing].

They will use this summary to [PURPOSE — e.g., decide go/no-go in under a minute].

Format:
- One-sentence bottom line first
- 3-5 bullets, each under 20 words, ordered by importance to this reader
- One "watch out" line if the document contains any risk, caveat, or deadline

Hard limit: [LENGTH — e.g., 120 words]. Preserve exact numbers, dates, and names — never round or approximate them.

<document>
[PASTE DOCUMENT]
</document>
```

**Variation 2 — Meeting Notes → Action Summary**
```text
Convert the raw meeting notes below into a structured summary.

## Decisions made — each with who decided and any dissent noted
## Action items — table: owner, action, deadline (write "UNASSIGNED" or "NO DATE" rather than inventing)
## Open questions — unresolved items that need a future decision
## Context worth keeping — max 3 bullets

Rules: use only what's in the notes. Don't infer decisions from discussion — if it wasn't decided, it's an open question.

<notes>
[PASTE RAW NOTES / TRANSCRIPT]
</notes>
```

**Variation 3 — Tone & Register Rewrite**
```text
Rewrite the text below, changing only the tone — preserve every fact, commitment, and the core structure.

From: [CURRENT TONE — e.g., stiff corporate legalese]
To: [TARGET TONE — e.g., clear, human, and warm — like a competent colleague explaining it over coffee]

Constraints:
- Same information; nothing added, softened away, or dropped — especially [CRITICAL ELEMENTS — e.g., the deadline and the refund terms]
- Reading level: [LEVEL — e.g., 8th grade]
- Length: within 10% of the original

<text>
[PASTE TEXT]
</text>
```

**Variation 4 — Format Conversion**
```text
Convert the content below from [SOURCE FORMAT — e.g., a 2,000-word blog post] into [TARGET FORMAT — e.g., a 10-slide talk outline / a Twitter thread / an FAQ].

Target format spec:
[FORMAT RULES — e.g., "Each slide: headline (under 8 words) + max 3 bullets + a speaker note"]

Preserve: the core argument, all statistics, and [KEY ELEMENTS].
Adapt: examples may be compressed; anecdotes may be reduced to one line.
Cut: [WHAT TO DROP — e.g., housekeeping, promotional sections].

<content>
[PASTE CONTENT]
</content>
```

**Variation 5 — Progressive Summarization** _(Long Documents)_
```text
Summarize this document at three zoom levels:

1. One sentence — the single most important point.
2. One paragraph (under 100 words) — the argument and key evidence.
3. One page (under 400 words) — sectioned summary preserving structure, numbers, and caveats.

Each level must stand alone. Flag anything at level 3 that contradicts the impression given by level 1 — if the nuance changes the headline, say so.

<document>
[PASTE DOCUMENT]
</document>
```

---

## 💡 Tips

- **Reader + purpose beats length alone**: "for a CFO deciding go/no-go" produces a different (better) summary than "summarize in 100 words".
- **Protect the numbers**: explicitly instruct exact preservation of figures, dates, and names — summarizers love to round and drop them.
- **Don't let it invent decisions**: for meeting notes, the "if it wasn't decided, it's an open question" rule prevents phantom commitments.
- **Zoom levels reveal drift**: the three-level pattern exposes when a punchy one-liner misrepresents the full document.
- **Pairs well with:** [Research Synthesis](research-synthesis.md), [Technical Documentation](technical-documentation.md)
