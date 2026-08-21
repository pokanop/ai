# Prompt Engineering Guide

[← Back to Text Prompts](../README.md)

The five foundations of effective prompting — role, structure, few-shot examples, chain-of-thought, and output-format contracts — each with a copyable pattern. Every other template in this library is built from these pieces.

**Best for:** Learning the craft · Debugging weak prompts · Building prompt templates · Team prompt standards

---

## 1. Role — tell the model who it is

A specific role primes vocabulary, depth, and judgment. Generic roles ("You are a helpful assistant") add nothing; specific ones change the output.

```text
You are a [SPECIFIC ROLE — e.g., senior security engineer who has performed hundreds of code audits]. Your strengths are [2-3 RELEVANT SKILLS]. You are reviewing this for [AUDIENCE/STAKES — e.g., a production deployment at a fintech company].
```

**Weak:** "You are a helpful writing assistant."
**Strong:** "You are a developmental editor for literary fiction with a reputation for preserving an author's voice while tightening structure."

## 2. Structure — separate the parts with delimiters

Models parse structured prompts more reliably than walls of text. Separate context, instructions, and data with clear delimiters (XML tags work especially well with Claude; Markdown headers work everywhere).

```text
<context>
[BACKGROUND THE MODEL NEEDS — who, what, why]
</context>

<task>
[THE ONE THING YOU WANT DONE]
</task>

<constraints>
- [CONSTRAINT 1 — e.g., under 300 words]
- [CONSTRAINT 2 — e.g., no jargon]
</constraints>

<input>
[THE MATERIAL TO WORK ON]
</input>
```

Put long documents **before** the instructions — models attend better to instructions at the end of the prompt.

## 3. Few-shot — show, don't just tell

One to three input→output examples define format, tone, and judgment more precisely than paragraphs of description.

```text
Convert each customer complaint into a structured ticket.

Example 1:
Input: "app crashed AGAIN when I uploaded a photo, third time this week!!"
Output: {"category": "crash", "feature": "photo upload", "severity": "high", "sentiment": "frustrated"}

Example 2:
Input: "would be nice if dark mode remembered my choice"
Output: {"category": "feature-request", "feature": "dark mode", "severity": "low", "sentiment": "neutral"}

Now convert:
Input: "[CUSTOMER MESSAGE]"
Output:
```

Choose examples that cover **edge cases**, not just the happy path — the model generalizes from whatever variety you show it.

## 4. Chain-of-thought — reason before answering

For math, logic, analysis, and multi-step tasks, instructing the model to work through the problem before answering measurably improves accuracy.

```text
[PROBLEM/QUESTION]

Think through this step by step before giving your final answer:
1. First, identify [WHAT TO IDENTIFY — e.g., the key variables].
2. Then, [INTERMEDIATE STEP — e.g., check each assumption].
3. Finally, state your conclusion.

Show your reasoning, then give your final answer on a new line starting with "Answer:".
```

> **Note:** Reasoning models (OpenAI o-series/GPT-5 thinking, Claude with extended thinking, Gemini thinking modes) already reason internally — for those, describe the *goal and criteria* clearly rather than dictating reasoning steps.

## 5. Output contract — specify the exact deliverable

The single highest-leverage fix for inconsistent outputs: state the format, length, and boundaries explicitly, and say what to do when the task can't be completed.

```text
Respond with exactly this structure:

## Summary
[2-3 sentences]

## Key Findings
[3-5 bullet points, each under 20 words]

## Recommendation
[One paragraph, decisive]

Rules:
- Total length under [WORD COUNT] words.
- If information is missing, write "INSUFFICIENT DATA" for that section instead of guessing.
- Do not include any text outside this structure.
```

For machine-readable output: "Respond only with valid JSON matching this schema: `{...}`. No markdown, no explanation."

---

## Putting it together

A complete prompt using all five foundations:

```text
You are a [ROLE]. 

<context>
[BACKGROUND]
</context>

<task>
[THE TASK]
</task>

Example of the expected output:
[ONE GOOD EXAMPLE]

Work through the input step by step, considering [KEY CRITERIA], before writing your final response.

Respond with [EXACT FORMAT], under [LENGTH]. If [FAILURE CONDITION], respond with [FALLBACK] instead.

<input>
[THE INPUT]
</input>
```

---

## 💡 Tips

- **Iterate one variable at a time**: change the role OR the examples OR the format between runs, so you learn what actually moved the output.
- **Say what to do, not what to avoid**: "Write in plain declarative sentences" beats "Don't be verbose."
- **Give an escape hatch**: telling the model what to output when it can't comply ("say INSUFFICIENT DATA") is the best defense against hallucination.
- **Test on hard inputs**: a prompt that works on easy cases often breaks on ambiguous ones — build your test set from the failures.
- **Pairs well with:** [System Prompts](system-prompts.md), [Research Synthesis](research-synthesis.md)
