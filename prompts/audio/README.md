# Audio Generation Prompts

[← Back to Main Repository](../../README.md)

A curated library of **8 audio prompt styles** covering music, voice, and sound effects, with copy-paste prompt variations for Suno v5 _(featured for music)_, Udio, and ElevenLabs v3 _(featured for voice)_ — simply replace `[PLACEHOLDERS]` with your own content.

---

## ⚡ Quick Start

1. Pick a style from the [categories below](#-audio-prompt-styles).
2. Open the style doc and copy the variation for your platform.
3. Replace the `[PLACEHOLDERS]` and generate.
4. Iterate — adjust genre tags, BPM, structure tags, or delivery tags based on the result.

---

## Platform Guide

### 🟠 Suno v5 _(Featured — Full Songs with Vocals)_

> *Suno generates complete songs — vocals, instruments, and mix — from a style description plus optional custom lyrics with structure tags.*

- **Two prompt fields**: a **Style of Music** description (genre, mood, tempo, instrumentation, vocal type) and, in Custom mode, a **Lyrics** field with your own words.
- **Structure tags** go in the lyrics field in square brackets, one per section:
  `[Intro]`, `[Verse]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Instrumental Break]`, `[Guitar Solo]`, `[Outro]`, `[End]`
- **Style patterns that work**: `genre + subgenre, mood, tempo/BPM, key instrumentation, vocal description` — e.g. `melancholic indie folk, 90 BPM, fingerpicked acoustic guitar, soft airy female vocals, warm tape saturation`.
- **Tips**: Keep the style description under ~200 characters of dense, comma-separated descriptors. Use `[Instrumental]` sections to give songs room to breathe. Exclude unwanted elements in the "Exclude Styles" field rather than writing "no drums" in the prompt.

### Udio

> *Udio also generates full songs from text, with strong genre fidelity; it favors tag-like prompts and supports the same square-bracket lyric structure tags.*

- **Prompting style**: comma-separated genre/mood/instrumentation tags work better than prose — e.g. `synthwave, retro 80s, analog synth arpeggios, driving beat, nostalgic, male vocals`.
- **Lyrics**: supports Custom lyrics with `[Verse]`, `[Chorus]`, `[Bridge]`-style section tags, or auto-generated/instrumental modes.
- **Manual mode** treats your tags literally for tighter control.
- **Tips**: Lead with the genre. Add era descriptors ("90s", "vintage") for period-authentic production. Generate short segments and use extensions/remix to build full arrangements.

### 🟣 ElevenLabs v3 _(Featured — Expressive Voice)_

> *Eleven v3 is a text-to-speech model with inline audio tags that direct emotion, delivery, and non-verbal sounds.*

- **Audio tags** go inline in square brackets, right before the text they modify:
  - Emotion/delivery: `[whispers]`, `[shouting]`, `[excited]`, `[sarcastic]`, `[curious]`, `[calm]`, `[cheerfully]`
  - Non-verbal: `[laughs]`, `[sighs]`, `[gasps]`, `[clears throat]`, `[exhales]`
  - Pacing: `[pause]`, `[rushed]`, `[drawn out]`
- **Punctuation matters**: ellipses `…` add trailing pauses, CAPS add emphasis, dashes create beats.
- **No SSML break tags** in v3 — use audio tags and punctuation for pacing instead.
- **Tips**: Match tags to the voice's character — a calm narrator voice fights `[shouting]`. Prompts under ~250 characters can behave inconsistently; give the model a full paragraph. Voice choice matters as much as the prompt.

### Sound Effects (ElevenLabs SFX & video-model SFX)

- **ElevenLabs Sound Effects** generates standalone SFX from short text descriptions (up to ~30 seconds, loopable): describe the source, action, environment, and character — e.g. `heavy wooden door creaking open slowly in a stone cathedral, long echo`.
- **In video models** (Veo 3.1, Sora 2), cue SFX inline in the video prompt: `SFX: rain on a tin roof, distant thunder.`
- **Tips**: One sound event per prompt. Include acoustic space ("in a small tiled bathroom", "outdoor open field") to control reverb.

---

## 🎚️ Music Prompt Building Blocks

| Element | Examples |
|---------|----------|
| Genre + subgenre | `indie folk`, `melodic techno`, `boom bap hip hop`, `cinematic orchestral` |
| Mood | `melancholic`, `euphoric`, `menacing`, `nostalgic`, `triumphant` |
| Tempo | `slow ballad`, `90 BPM`, `120 BPM driving`, `uptempo 140 BPM` |
| Instrumentation | `fingerpicked acoustic guitar`, `analog synth pads`, `808 bass`, `string ensemble` |
| Vocals | `soft airy female vocals`, `gritty baritone`, `rap verses`, `instrumental (no vocals)` |
| Production | `lo-fi tape warmth`, `polished pop mix`, `live room ambience`, `vintage vinyl crackle` |

---

## How to Use These Prompts

1. **Find a style** from the categories below.
2. **Click through** to the individual style doc.
3. **Pick a variation** for your platform and use case.
4. **Replace placeholders** — `[TOPIC]`, `[PRODUCT]`, `[NAME]`, etc. — with your desired content.
5. **Iterate** — swap genre tags, adjust BPM, or add/remove structure and delivery tags.

---

## 🎧 Audio Prompt Styles

| # | Style | Description |
|---|-------|-------------|
| 1 | [Pop Anthem](styles/pop-anthem.md) | Radio-ready pop with full verse/chorus structure and hooks |
| 2 | [Electronic & Dance](styles/electronic-dance.md) | House, techno, synthwave, and EDM drops with BPM control |
| 3 | [Cinematic Score](styles/cinematic-score.md) | Orchestral and hybrid trailer music, themes, and underscore |
| 4 | [Lo-fi & Ambient](styles/lofi-ambient.md) | Chill beats, ambient textures, and focus/sleep soundscapes |
| 5 | [Narration & Voiceover](styles/narration-voiceover.md) | Documentary, audiobook, and explainer voice delivery |
| 6 | [Character & Dialogue Voice](styles/character-dialogue-voice.md) | Expressive character performances with emotion tags |
| 7 | [Podcast & Jingle](styles/podcast-jingle.md) | Intros, outros, stingers, and branded audio idents |
| 8 | [Sound Effects](styles/sound-effects.md) | Foley, ambience, impacts, and UI sounds |

---

> **Contribute!** Made a great track or voice clip with one of these prompts? Share your results and prompt refinements via PR!
