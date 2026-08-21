# Text Generation Prompts

[← Back to Main Repository](../../README.md)

A curated library of **7 text prompt templates** — system prompts, creative writing, technical docs, marketing copy, research synthesis, summarization, and a foundational prompt-engineering guide. Templates work across Claude, ChatGPT (GPT-5.x), Gemini, and open models like Llama — simply replace `[PLACEHOLDERS]` with your own content.

---

## ⚡ Quick Start

1. New to prompting? Start with the [Prompt Engineering Guide](styles/prompt-engineering-guide.md).
2. Pick a template from the [categories below](#-text-prompt-templates).
3. Copy the prompt, replace the `[PLACEHOLDERS]`, and run it.
4. Iterate — tighten the role, add examples, or strengthen the output-format contract based on results.

---

## Platform Guide

Modern frontier models respond to the same core techniques; the differences are mostly in formatting conventions and context handling.

### Claude (Anthropic)

- Responds especially well to **XML-style tags** for structure: `<context>…</context>`, `<examples>…</examples>`, `<instructions>…</instructions>`.
- Put long documents/context **before** the instructions for best results.
- Prefill the start of the assistant response (API) to lock output format.
- System prompts define role and rules; keep task-specific detail in the user message.

### ChatGPT / GPT-5.x (OpenAI)

- Markdown headers and bullet lists work well as structure.
- Use the system/developer message for persistent role and rules.
- Explicit output-format instructions ("Respond only with valid JSON matching this schema…") are honored reliably; structured outputs are available via the API.

### Gemini (Google)

- Handles very long contexts well — you can include large documents inline.
- Prefers clear sectioned prompts with headers; state the persona, task, context, and format in that order.

### Open models (Llama, etc.)

- Be more explicit and literal; avoid relying on implied conventions.
- Few-shot examples matter more — show, don't just tell.
- Keep system prompts short and rule-like; long nuanced system prompts degrade more than on frontier models.

### Universal principles

1. **Role** — tell the model who it is ("You are a senior technical writer…").
2. **Structure** — separate context, instructions, examples, and format with clear delimiters.
3. **Few-shot** — show 1–3 input→output examples of exactly what you want.
4. **Chain-of-thought** — for complex reasoning, ask the model to work step by step before answering.
5. **Output contract** — specify the exact format, length, and constraints of the response.

The [Prompt Engineering Guide](styles/prompt-engineering-guide.md) covers each of these in depth with copyable patterns.

---

## How to Use These Prompts

1. **Find a template** from the categories below.
2. **Click through** to the individual template doc.
3. **Copy the prompt** — most work as either a system prompt or a user message.
4. **Replace placeholders** — `[TOPIC]`, `[AUDIENCE]`, `[PRODUCT]`, etc. — with your content.
5. **Iterate** — the Tips section in each doc lists the highest-leverage adjustments.

---

## ✍️ Text Prompt Templates

| # | Template | Description |
|---|----------|-------------|
| 1 | [Prompt Engineering Guide](styles/prompt-engineering-guide.md) | The foundations: role, structure, few-shot, chain-of-thought, output contracts |
| 2 | [System Prompts](styles/system-prompts.md) | Reusable system-prompt patterns for assistants, agents, and personas |
| 3 | [Creative Writing](styles/creative-writing.md) | Fiction, poetry, and narrative voice with style control |
| 4 | [Technical Documentation](styles/technical-documentation.md) | READMEs, API docs, tutorials, and architecture docs |
| 5 | [Marketing Copy](styles/marketing-copy.md) | Landing pages, ads, emails, and product descriptions |
| 6 | [Research Synthesis](styles/research-synthesis.md) | Literature reviews, competitive analysis, and evidence-graded summaries |
| 7 | [Summarization & Transformation](styles/summarization-transformation.md) | Summaries, rewrites, tone shifts, and format conversions |

---

> **Contribute!** Refined one of these templates or built a great new one? Share it via PR!
