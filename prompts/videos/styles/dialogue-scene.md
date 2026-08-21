# Dialogue Scene

[← Back to Video Prompts](../README.md)

Character-driven scenes with synchronized, lip-synced speech and natural performance. Only Veo 3.1 and Sora 2 generate native dialogue — write the exact lines in quotation marks, keep them short, and direct the delivery like a script.

**Best for:** Short film scenes · Explainer hosts · Character vignettes · Ad spokespeople · Previz table reads

---

## Prompt Variations

### 🔵 Google Veo 3.1 _(Featured)_

> Veo 3.1 handles multi-person conversations with distinct voices. Attribute each line clearly and specify tone.

**Variation 1 — Two-Person Exchange** _(Drama)_
```text
Cinematic medium two-shot in [ENVIRONMENT — e.g., a dim diner booth at night], warm practical light overhead, rain on the window behind. [CHARACTER A — e.g., an older detective] leans forward and says wearily, "[LINE A — keep under 10 words]." [CHARACTER B — e.g., a nervous young man] looks away and replies quietly, "[LINE B]." Shallow depth of field, subtle handheld drift. Ambient noise: rain, distant dishes clinking, low diner hum.
```

**Variation 2 — Direct-to-Camera Host** _(Explainer)_
```text
Medium shot of [HOST — describe age, style, energy] standing in [ENVIRONMENT — e.g., a bright modern studio with soft gradient backdrop], speaking directly to camera with warm confident energy: "[SCRIPT LINE — 15-20 words max for 8 seconds]." Natural hand gestures synchronized to the emphasis. Soft key light, gentle background bokeh, 16:9. Ambient noise: clean room tone, subtle upbeat music bed underneath.
```

**Variation 3 — Emotional Close-Up** _(Performance)_
```text
Slow push-in to a tight close-up of [CHARACTER] in [ENVIRONMENT], eyes glistening, jaw tightening. After a long beat they whisper, "[LINE — under 8 words]," and exhale. Motivated window light on one side of the face, the other falling into shadow. Filmic grain, muted palette. SFX: room tone, a faint clock ticking, no music.
```

### OpenAI Sora 2

**Variation 1 — Walk-and-Talk**
```text
Tracking shot: [CHARACTER A] and [CHARACTER B] walk side by side through [ENVIRONMENT — e.g., a sunlit office corridor], mid-conversation. A says briskly, "[LINE A]"; B laughs and answers, "[LINE B]". The camera leads them, keeping both in frame, natural gait and gestures, realistic lip sync. Office ambience, footsteps, muffled phones ringing.
```

**Variation 2 — Interview Setup**
```text
Documentary interview framing: [SUBJECT] sits slightly off-center against [BACKDROP], soft key light, blurred background. An off-screen interviewer asks, "[QUESTION]"; the subject pauses, smiles, and answers, "[ANSWER LINE]". Natural conversational rhythm with small hesitations. Quiet room tone.
```

### Runway Gen-4.x

> No native audio — generate the performance and dub with a voice tool (e.g., ElevenLabs), or use Runway's lip-sync tools in post.

**Variation 1 — Silent Performance for Dubbing**
```text
Medium close-up: the subject speaks earnestly to someone off-frame right, with natural mouth movement, blinks, small head tilts, and hand gestures. Emotional, sincere delivery. Locked camera, shallow depth of field. Continuous, seamless shot.
```

### Kling 2.x

**Variation 1 — Reaction Coverage**
```text
[CHARACTER] listens to an off-screen speaker, expression shifting from skepticism to reluctant agreement, ending with a slow nod and a mouthed word. Scene: [ENVIRONMENT] with soft window light. Camera language: locked medium close-up. Lighting: naturalistic key with soft fill. Atmosphere: tense but thawing.
```
- **Negative prompt:** `distorted mouth, warped teeth, rubbery face, extra hands, jitter`

### Pika 2.2

**Variation 1 — Emotional Beat Shift** _(Pikaframes)_
```text
Start frame: [CHARACTER] straight-faced, listening. End frame: the same framing, face broken into a wide laugh. Prompt: the character's expression melts naturally from neutral attention into genuine laughter, shoulders relaxing. Locked camera, soft interior light.
```

---

## 💡 Tips

- **Budget ~2.5 words per second**: an 8s Veo clip fits roughly 15–20 spoken words total. Overstuffed scripts get rushed or cut off.
- **Direct the read**: "wearily," "briskly," "whispers" — delivery adjectives steer the voice performance.
- **Attribute every line**: "A says… B replies…" prevents voice-swapping between characters.
- **Silence is a tool**: A beat before or after a line ("after a long pause") makes performances feel human.
- **No-audio platforms**: Generate clean mouth movement and dub in post; keep the shot medium or closer so lip sync tools can track.
- **Pairs well with:** [Cinematic Sequence](cinematic-sequence.md), [Social / UGC Clip](social-ugc-clip.md)
