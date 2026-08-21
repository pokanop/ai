# Animation & Stylized

[← Back to Video Prompts](../README.md)

Non-photorealistic looks — 3D character animation, anime, claymation, paper cutout, pixel art in motion. The key is naming the medium and its physical tells (frame rate feel, material texture, line quality) so the model commits to the style instead of drifting back to realism.

**Best for:** Kids' content · Explainers · Music visuals · Game trailers · Stylized brand spots

---

## Prompt Variations

### 🔵 Google Veo 3.1 _(Featured)_

**Variation 1 — 3D Animated Character** _(Pixar-style)_
```text
3D animated film style: a whimsical [CHARACTER — e.g., round robot with big expressive eyes] waddles through [ENVIRONMENT — e.g., a cozy cluttered workshop], pauses, and reacts with exaggerated surprise as [EVENT] happens. Soft global illumination, subsurface scattering on materials, large emotive eyes, squash-and-stretch animation principles. Warm storybook palette. SFX: playful orchestral sting, servo whirs, a comedic boing on the reaction.
```

**Variation 2 — Anime Action Cut** _(Shonen Energy)_
```text
2D anime style: [CHARACTER] sprints across a rooftop at sunset, hair and jacket streaming, then leaps between buildings in dramatic slow motion. Bold cel shading, speed lines, dramatic perspective foreshortening, painted cloud background with warm rim light. Limited-animation feel with impactful key poses. SFX: whoosh of wind, fabric snap, a rising taiko drum hit at the leap.
```

**Variation 3 — Claymation Loop** _(Handmade Charm)_
```text
Stop-motion claymation style: a hand-sculpted [CHARACTER] with visible fingerprint textures tends a tiny garden in [ENVIRONMENT], moving with a charming 12-frames-per-second stop-motion stutter. Miniature handmade set with felt plants and painted backdrop, soft practical lighting like a diorama. Ambient noise: gentle ukulele, tiny tactile foley sounds.
```

### OpenAI Sora 2

**Variation 1 — Paper Cutout World**
```text
Layered paper cutout animation: a flat paper [CHARACTER] slides between layered paper scenery of [ENVIRONMENT], each layer casting a small drop shadow. Elements hinge and fold like a pop-up book as the scene changes. Crisp cut edges, visible paper grain, pastel construction-paper palette. Sound: paper rustles and soft ticks as pieces move.
```

**Variation 2 — Pixel Art in Motion**
```text
16-bit pixel art animation: a tiny pixel [CHARACTER] runs right through a side-scrolling [ENVIRONMENT] with parallax background layers, jumping over obstacles. Limited color palette, chunky dithered shading, crisp pixel grid with no anti-aliasing. Chiptune soundtrack with jump blips synchronized to the action.
```

### Runway Gen-4.x

> Feed a styled illustration or render as the input image; the prompt should only move it.

**Variation 1 — Bring an Illustration to Life**
```text
The illustrated character blinks, breathes, and shifts weight from foot to foot as the background clouds drift slowly. Gentle looping idle animation, consistent line work and flat colors preserved. Locked camera.
```

### Kling 2.x

**Variation 1 — Stylized Character Turn**
```text
A [STYLE — e.g., cel-shaded] [CHARACTER] turns to face the camera and strikes a confident pose, cape settling behind them. Scene: a stylized [ENVIRONMENT] with bold graphic shapes. Camera language: slow push-in at eye level. Lighting: flat stylized shading with strong rim light. Atmosphere: heroic, energetic.
```
- **Negative prompt:** `photorealistic, live action, realistic skin texture, motion blur smear, extra fingers`

### Pika 2.2

**Variation 1 — Style Morph** _(Pikaframes)_
```text
Start frame: a photograph of [SUBJECT]. End frame: the same subject as a [STYLE — e.g., claymation figure]. Prompt: the subject smoothly transforms from photograph to [STYLE], textures shifting material by material while the pose holds. Locked camera, even lighting.
```

---

## 💡 Tips

- **Name the medium's physics**: "12fps stop-motion stutter," "cel shading," "paper grain," "squash and stretch" — the tells make the style believable.
- **Keep palettes tight**: Stylized looks read best with 3–5 named colors ("pastel construction-paper palette," "limited 16-color palette").
- **Match motion to medium**: Claymation moves in steps; anime holds key poses; 3D animation eases smoothly. Say so.
- **Anchor with references on i2v platforms**: A styled still into Runway/Kling/Pika locks the aesthetic far better than text alone.
- **Pairs well with:** [Cinematic Sequence](cinematic-sequence.md), [Brand Commercial](brand-commercial.md)
