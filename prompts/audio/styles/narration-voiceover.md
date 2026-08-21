# Narration & Voiceover

[← Back to Audio Prompts](../README.md)

Documentary narration, audiobook reads, explainer voiceovers, and ad reads with ElevenLabs v3. The script *is* the prompt: inline audio tags, punctuation, and phrasing direct the performance.

**Best for:** Explainer videos · Documentaries · Audiobooks · Ads & promos · E-learning

---

## Prompt Variations

### 🟣 ElevenLabs v3 _(Featured)_

**Variation 1 — Documentary Narrator** _(Measured Gravitas)_
```text
[calm] In the heart of [PLACE], something remarkable is happening. [pause] For over [TIMESPAN], [SUBJECT] has shaped everything around it — quietly, patiently… almost invisibly.

[curious] But look closer, and a different story emerges. [SURPRISING FACT]. And that changes everything we thought we knew about [TOPIC].
```

**Variation 2 — Energetic Explainer** _(Upbeat & Clear)_
```text
[cheerfully] Ever wondered how [TOPIC] actually works? [excited] It's simpler than you think!

Here's the key: [CORE CONCEPT IN ONE SENTENCE]. That's it — that's the magic. [pause]

Now, there are three things you need to know. First, [POINT ONE]. Second, [POINT TWO]. And third — this is the important one — [POINT THREE].

[warmly] And that's how [TOPIC] works. Pretty cool, right?
```

**Variation 3 — Intimate Audiobook Read** _(First Person)_
```text
[calm] I remember the first time I saw [PLACE/THING]. [pause] The light was fading, and everything smelled of [SENSORY DETAIL].

[sighs] Looking back now, I should have known what was coming. But that evening… [drawn out] that evening, everything still felt possible.
```

**Variation 4 — Ad Read** _(Confident 30s Spot)_
```text
[confident] Tired of [PAIN POINT]? You're not alone.

[warmly] That's why we built [PRODUCT] — [ONE-LINE VALUE PROP]. No [FRICTION ONE]. No [FRICTION TWO]. Just [CORE BENEFIT].

[excited] Try [PRODUCT] free today at [WEBSITE]. [pause] [calm] [PRODUCT]. [TAGLINE].
```

---

## 💡 Tips

- **Give it a full paragraph**: very short v3 prompts (under ~250 characters) behave inconsistently — write the whole passage.
- **Tags before the text they modify**: `[calm] In the heart of…` — and switch tags between paragraphs to shape the arc.
- **Punctuation is direction**: ellipses trail off, dashes add beats, CAPS add stress. No SSML `<break>` tags in v3 — use `[pause]` and punctuation.
- **Cast the right voice**: pick a voice whose natural character matches the read; tags fine-tune, they don't transform.
- **Pairs well with:** [Character & Dialogue Voice](character-dialogue-voice.md), [Podcast & Jingle](podcast-jingle.md)
