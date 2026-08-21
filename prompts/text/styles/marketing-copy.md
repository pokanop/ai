# Marketing Copy

[← Back to Text Prompts](../README.md)

Landing pages, ads, emails, and product descriptions. Marketing prompts need three inputs to work: who exactly the reader is, what one action you want, and proof you can back claims with. Everything else is formatting.

**Best for:** Landing pages · Ad variants · Email sequences · Product descriptions · Social copy

---

## Prompt Variations

**Variation 1 — Landing Page Hero + Sections**
```text
You are a direct-response copywriter. Write landing page copy for [PRODUCT].

Audience: [SPECIFIC READER — e.g., engineering managers at 50-500 person startups drowning in flaky CI].
Their current alternative: [WHAT THEY DO TODAY].
The one action we want: [CTA — e.g., start a free trial].

Inputs:
- Value prop: [ONE SENTENCE]
- Proof points: [METRICS, CUSTOMERS, RESULTS — real ones only]
- Objections to preempt: [TOP 2-3 OBJECTIONS]

Produce:
1. Three headline options (under 10 words) + subheadline for each (under 20 words)
2. Three benefit blocks: header + 2 sentences, each anchored to a proof point
3. One objection-handling section
4. CTA section: button text + one line of friction-reduction ("No credit card…")

Rules: benefits over features. No hype words ("revolutionary", "game-changing"). Every claim must trace to a provided proof point — if you need one we didn't give, write [NEEDS PROOF].
```

**Variation 2 — Ad Variants for Testing**
```text
Write [NUMBER — e.g., 6] ad variants for [PLATFORM — e.g., LinkedIn] promoting [PRODUCT/OFFER].

Audience: [READER + THEIR PAIN].
Constraint: [PLATFORM LIMITS — e.g., 150-character primary text + 70-character headline].

Cover these angles, one variant each:
1. Pain-first ("Still doing [PAINFUL THING]?")
2. Outcome-first (the after state, concrete)
3. Social proof (built around [PROOF POINT])
4. Contrarian/myth-busting
5. Question hook
6. Direct offer

Tone: [TONE — e.g., dry, peer-to-peer, zero corporate enthusiasm]. Label each variant with its angle.
```

**Variation 3 — Email Sequence**
```text
Write a [NUMBER]-email sequence for [GOAL — e.g., onboarding trial users toward activation].

Reader: [WHO + WHERE THEY ARE IN THE JOURNEY].
Sequence arc: [EMAIL 1 JOB] → [EMAIL 2 JOB] → [EMAIL 3 JOB].

For each email:
- Subject line (under 45 characters) + preview text
- Body under 120 words, one idea per email
- One CTA, same action stated once

Voice: [VOICE — e.g., founder writing personally, lowercase subjects, no images-speak]. 
Rules: no "Just checking in". No fake urgency. Each email must be valuable even if the reader never clicks.
```

**Variation 4 — Product Description**
```text
Write a product description for [PRODUCT] sold on [CHANNEL — e.g., our DTC site].

Buyer: [WHO + WHAT THEY'RE REALLY BUYING — e.g., busy parents buying "one less decision", not pasta sauce].
Details to work in: [MATERIALS/SPECS/INGREDIENTS], [DIMENSIONS/SIZE], [CARE/USAGE].

Format: 
- Opening line that names the moment of use, not the product
- 2-3 short paragraphs, sensory and concrete
- Bulleted specs at the end

Tone: [BRAND VOICE — e.g., warm, wry, zero exclamation marks]. Avoid: "elevate", "crafted with care", "look no further".
```

---

## 💡 Tips

- **Proof points in, claims out**: give real metrics and customers; ban the model from inventing them ("write [NEEDS PROOF]" is the safety valve).
- **One reader, one action**: copy aimed at everyone converts no one — force yourself to fill in a specific reader before prompting.
- **Ban the hype lexicon**: listing forbidden words ("revolutionary", "elevate", "game-changing") does more for tone than any positive instruction.
- **Generate angles, not variations**: six different persuasion angles test better than six rewordings of the same idea.
- **Pairs well with:** [Creative Writing](creative-writing.md), [Summarization & Transformation](summarization-transformation.md)
