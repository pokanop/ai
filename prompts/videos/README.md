# Video Generation Prompts

[← Back to Main Repository](../../README.md)

A curated library of **10 video prompt styles** covering the most common video use cases, each with copy-paste prompt variations for Google Veo 3.1 _(featured)_, OpenAI Sora 2, Runway Gen-4.5, Kling 2.x, and Pika 2.2 — simply replace `[PLACEHOLDERS]` with your own content.

---

## ⚡ Quick Start with Veo 3.1

If you just want to generate something great right now:

1. Pick a style from the [categories below](#-video-prompt-styles).
2. Open the style doc and go to the **Google Veo 3.1** section (listed first).
3. Choose the variation that matches your use case.
4. Copy the prompt, replace the `[PLACEHOLDERS]`, and generate.
5. Iterate — adjust camera movement, lighting, pacing, and audio cues based on the result.

> **Have a reference image?** Most platforms now support image-to-video. Veo 3.1's "ingredients to video" accepts reference images for consistent characters and objects; Runway Gen-4 requires an input image; Kling and Pika both support image-to-video and start/end frames.

---

## Platform Guide

Each prompt is provided in platform-specific variants. Understanding each platform's capabilities, duration limits, and prompt conventions will help you get the best results.

### 🔵 Google Veo 3.1 _(Featured — Best Audio + Cinematic Control)_

> *Veo 3.1 generates video with rich, natively synchronized audio — dialogue, sound effects, and ambient noise are all driven by your prompt.*

- **Durations**: 4, 6, or 8 second clips (extendable via scene extension).
- **Aspect ratios**: `16:9` or `9:16`. Output at 720p or 1080p (4K available on some tiers).
- **Prompt structure**: Use the five-part formula — **[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]**.
- **Audio cues**:
  - **Dialogue**: put specific speech in quotation marks — `A woman says, "We have to leave now."`
  - **Sound effects**: describe them explicitly — `SFX: thunder rumbling in the distance, rain on a tin roof.`
  - **Ambience**: set the sound bed — `Ambient noise: a quiet café murmur, cups clinking.`
- **Key features**: "ingredients to video" (reference images for consistent characters/objects), "first and last frame" transitions, scene extension.
- **Tips**: Front-load camera and shot type ("Cinematic dolly-in shot…"). Name lens and lighting like a director. Describe one continuous shot per clip for best coherence.

### OpenAI Sora 2

> *Sora 2 generates synchronized audio and dialogue and excels at physical realism and multi-shot continuity.*

- **Durations**: 4, 8, 12, 16, or 20 seconds (set via API parameter, not prose).
- **Resolutions**: 1280×720 / 720×1280 (`sora-2`); up to 1920×1080 / 1080×1920 (`sora-2-pro`).
- **Prompt structure**: Write like a shot list — describe the shot type, subject, action, setting, lighting, and mood in prose. Resolution and duration are API parameters and cannot be requested in prose.
- **Audio cues**: Include dialogue lines in quotes and describe sound design in prose; Sora 2 syncs speech and effects to the visuals.
- **Key features**: character references (cameos) for consistent characters, video extension, remixing.
- **Tips**: Shorter clips follow instructions more reliably. For multi-shot sequences, describe each shot in order ("Shot 1: … Shot 2: …").

### Runway Gen-4.x

> *Gen-4 and Gen-4.5 are image-to-video first: the input image defines composition, and the prompt describes motion.*

- **Durations**: 5 or 10 second clips at 24fps.
- **Aspect ratios**: `16:9`, `9:16`, `1:1`, `4:3`, `3:4`, `21:9`.
- **Prompt structure**: Focus almost exclusively on **motion** — subject action, environmental motion, camera motion, and motion style/timing. Don't re-describe what's in the input image.
- **Audio**: No native audio generation — add sound in post.
- **Camera keywords**: `locked camera`, `handheld camera`, `slow dolly-in`, `tracking shot`, `orbit`, `crane up`, `crash zoom`, `rack focus`.
- **Tips**: Start with a minimal motion prompt and layer detail once the basic motion works. Add `Continuous, seamless shot` to avoid unwanted cuts. Use sequential language ("then") for ordered actions.

### Kling 2.x

> *Kling 2.1/2.5 produces smooth, physically plausible motion with strong prompt adherence and start/end frame control.*

- **Durations**: 5 or 10 second clips; Standard and Professional modes.
- **Aspect ratios**: `16:9`, `9:16`, `1:1`.
- **Prompt structure**: **Subject + Subject Movement + Scene + (Camera Language + Lighting + Atmosphere)**.
- **Audio**: No native audio generation — add sound in post.
- **Key features**: image-to-video, start/end frame control, negative prompts to suppress artifacts.
- **Tips**: Keep motion achievable within 5 seconds — extreme camera moves in short clips look disorienting. Use negative prompts (`blurry, distorted, extra limbs`) sparingly and specifically.

### Pika 2.2

> *Pika 2.2 is built around Pikaframes keyframe control — define start and end frames and let the model generate the motion between them.*

- **Durations**: 1–10 second clips at native 1080p.
- **Aspect ratios**: `16:9`, `9:16`, `1:1`, `4:5`, `5:4`, `3:2`, `2:3`.
- **Prompt structure**: Short, direct motion descriptions. With Pikaframes, let the frames do the work and use the prompt to guide the transition style.
- **Audio**: No native audio generation — add sound in post.
- **Key features**: Pikaframes (keyframe interpolation), Pikadditions (add elements to a scene), Pikaswaps (swap objects/subjects), Pikaffects (dynamic visual effects), negative prompts.
- **Tips**: For product or transformation shots, Pikaframes with a clean start and end image beats a long text prompt.

---

## 🎥 Camera Movement Cheat Sheet

Use precise cinematography terms — every platform responds better to named camera moves than to vague descriptions:

| Term | What it does | Best for |
|------|--------------|----------|
| `Static / locked shot` | Camera doesn't move | Dialogue, product hero shots |
| `Dolly-in / dolly-out` | Camera physically moves toward/away | Building tension, reveals |
| `Tracking shot` | Camera follows the subject | Action, walking scenes |
| `Orbit / arc shot` | Camera circles the subject | Product showcases, hero moments |
| `Crane / pedestal up` | Camera rises vertically | Establishing shots, endings |
| `Pan / tilt` | Camera rotates horizontally/vertically | Scanning environments |
| `Handheld` | Natural shake and drift | UGC, documentary realism |
| `FPV drone shot` | Fast, fluid first-person flight | Establishing shots, adrenaline |
| `Rack focus` | Focus shifts between subjects | Emotional beats, reveals |
| `Crash zoom` | Rapid zoom toward subject | Comedy, dramatic emphasis |

---

## 📐 Duration & Aspect Ratio Reference

| Platform | Clip lengths | Aspect ratios | Native audio |
|----------|--------------|---------------|--------------|
| Veo 3.1 | 4, 6, 8s (+ extension) | 16:9, 9:16 | ✅ Dialogue, SFX, ambience |
| Sora 2 | 4, 8, 12, 16, 20s | 16:9, 9:16 (via resolution) | ✅ Dialogue, SFX, ambience |
| Runway Gen-4.x | 5, 10s | 16:9, 9:16, 1:1, 4:3, 3:4, 21:9 | ❌ |
| Kling 2.x | 5, 10s | 16:9, 9:16, 1:1 | ❌ |
| Pika 2.2 | 1–10s | 16:9, 9:16, 1:1, 4:5, 5:4, 3:2, 2:3 | ❌ |

---

## How to Use These Prompts

1. **Find a style** from the categories below.
2. **Click through** to the individual style doc.
3. **Pick a variation** that matches your intended output.
4. **Copy the prompt** for your platform — Veo 3.1 is listed first and recommended.
5. **Replace placeholders** — `[SUBJECT]`, `[ENVIRONMENT]`, `[PRODUCT]`, etc. — with your desired content.
6. **Iterate** — adjust camera movement, lighting, pacing, or audio cues based on initial results.

---

## 🎬 Video Prompt Styles

| # | Style | Description |
|---|-------|-------------|
| 1 | [Cinematic Sequence](styles/cinematic-sequence.md) | Film-grade narrative shots with deliberate cinematography, lighting, and mood |
| 2 | [Product Showcase](styles/product-showcase.md) | Studio-quality product reveals with orbit shots, macro details, and clean lighting |
| 3 | [Social / UGC Clip](styles/social-ugc-clip.md) | Authentic handheld selfie-style content for TikTok, Reels, and Shorts |
| 4 | [Animation & Stylized](styles/animation-stylized.md) | 3D animation, anime, claymation, and other non-photorealistic looks |
| 5 | [Drone & Establishing Shot](styles/drone-establishing-shot.md) | Sweeping aerial and FPV drone footage for openers and location reveals |
| 6 | [Dialogue Scene](styles/dialogue-scene.md) | Character-driven scenes with synchronized speech and natural performance |
| 7 | [Action & Chase](styles/action-chase.md) | High-energy pursuits, stunts, and dynamic camera work |
| 8 | [Nature & Wildlife](styles/nature-wildlife.md) | Documentary-style animal behavior and landscape footage |
| 9 | [Timelapse & Hyperlapse](styles/timelapse-hyperlapse.md) | Compressed time — city motion, clouds, construction, seasons |
| 10 | [Brand Commercial](styles/brand-commercial.md) | Polished 15–30s spot aesthetics — lifestyle, logo reveals, taglines |

---

> **Contribute!** Generated a great video with one of these prompts? Share your results and prompt refinements via PR!
