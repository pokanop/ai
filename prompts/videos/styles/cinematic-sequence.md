# Cinematic Sequence

[← Back to Video Prompts](../README.md)

Film-grade narrative shots with deliberate cinematography — named camera moves, motivated lighting, shallow depth of field, and a clear emotional beat. These prompts treat the model like a director treats a crew: shot type first, then subject, action, context, and mood.

**Best for:** Short films · Title sequences · Mood pieces · Pitch previsualization · Music video shots

---

## Prompt Variations

### 🔵 Google Veo 3.1 _(Featured)_

> Use the five-part formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]. Veo 3.1 generates synchronized audio, so score the scene in the prompt too.

**Variation 1 — Slow Dolly-In Reveal** _(Drama, Tension)_
```text
Cinematic slow dolly-in shot, 35mm anamorphic lens with shallow depth of field. [SUBJECT] stands motionless at a rain-streaked window, backlit by cold blue city light, as their reflection slowly sharpens in the glass. Interior of a dim [ENVIRONMENT] at night, practical lamps glowing warm in the background bokeh. Moody neo-noir style, volumetric haze, high contrast. Ambient noise: distant traffic, rain against glass, a low synth drone swelling.
```

**Variation 2 — Golden Hour Tracking Shot** _(Emotional, Uplifting)_
```text
Cinematic tracking shot following [SUBJECT] as they walk through [ENVIRONMENT] at golden hour, camera gliding smoothly at shoulder height. Warm rim light flares through [FOREGROUND ELEMENT], lens flare kissing the frame. Shallow focus keeps the subject sharp while the background melts into amber bokeh. Nostalgic, hopeful tone, filmic grain. SFX: soft footsteps, wind through leaves, a gentle piano motif.
```

**Variation 3 — Overhead God Shot** _(Stylized, Dramatic)_
```text
Overhead top-down crane shot descending slowly toward [SUBJECT] lying at the center of [ENVIRONMENT], arranged with striking symmetry. Hard single key light casts long dramatic shadows radiating outward. Desaturated palette with one accent color: [COLOR]. Slow, deliberate pacing. Ambient noise: a single sustained cello note, faint room tone.
```

### OpenAI Sora 2

**Variation 1 — Two-Shot Mini Sequence** _(Narrative Continuity)_
```text
Shot 1: Wide establishing shot of [SUBJECT] standing alone in [ENVIRONMENT] at dusk, silhouetted against the fading light, wind moving through the scene. Shot 2: Cut to a slow close-up of their face, eyes lifting toward the horizon, warm practical light on one side. Cinematic 35mm look, shallow depth of field, filmic color grade with lifted blacks. Sound design: low wind, distant birds, a sparse piano note on the cut.
```

**Variation 2 — Long Take** _(Immersive Realism)_
```text
A single continuous handheld long take: the camera follows [SUBJECT] from behind as they push through a door into [ENVIRONMENT], the light shifting from cold fluorescent to warm tungsten as they cross the threshold. Natural motion blur, realistic physics, documentary-cinema hybrid style. The subject pauses, exhales, and says quietly, "[LINE OF DIALOGUE]".
```

### Runway Gen-4.x

> Start from an input image that already has the composition and grade you want; prompt only the motion.

**Variation 1 — Dolly-In on a Still**
```text
The camera performs a slow, smooth dolly-in toward the subject as dust motes drift through the shafts of light. Subtle movement in the subject's hair and clothing. Continuous, seamless shot. Cinematic live-action.
```

**Variation 2 — Orbit with Rack Focus**
```text
The camera slowly orbits the subject clockwise while the focus racks from the foreground object to the subject's face. Background lights bloom into soft bokeh. Slow, deliberate motion. Continuous, seamless shot.
```

### Kling 2.x

**Variation 1 — Tension Build**
```text
[SUBJECT] slowly turns to face the camera, expression shifting from calm to alarm. Scene: a dim [ENVIRONMENT] with a single overhead practical light and drifting haze. Camera language: slow push-in from a low angle. Lighting: hard key with deep shadows, cool color temperature. Atmosphere: tense, foreboding, cinematic.
```
- **Negative prompt:** `blurry, distorted face, extra limbs, jittery motion, text, watermark`

### Pika 2.2

**Variation 1 — Keyframe Mood Transition** _(Pikaframes)_
```text
Start frame: [SUBJECT] in daylight in [ENVIRONMENT]. End frame: the same framing at night, neon light replacing the sun. Prompt: the light gradually shifts from warm daylight to cold neon night as shadows lengthen and street lights flicker on. Smooth, cinematic transition, camera locked.
```

---

## 💡 Tips

- **One shot per clip**: 4–10 seconds is one camera move, not a montage. Chain clips (or use Sora 2's multi-shot prompts / Veo's extension) for sequences.
- **Name the lens and move**: "35mm anamorphic, slow dolly-in" beats "cinematic camera" every time.
- **Motivate your light**: Say where light comes from (window, practical lamp, neon sign) — motivated light reads as film, unmotivated light reads as CG.
- **Score it in the prompt** (Veo 3.1 / Sora 2): describe ambience and music so the audio track supports the mood instead of fighting it.
- **Grade with words**: "lifted blacks," "teal-orange grade," "filmic grain" steer the color pipeline.
- **Pairs well with:** [Dialogue Scene](dialogue-scene.md), [Drone & Establishing Shot](drone-establishing-shot.md)
