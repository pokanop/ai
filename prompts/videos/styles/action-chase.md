# Action & Chase

[← Back to Video Prompts](../README.md)

High-energy pursuits, stunts, and kinetic camera work. Action is the hardest thing to prompt — physics, speed, and coherent geometry all strain the models — so these prompts keep each clip to one clear beat of action with a camera move that matches its energy.

**Best for:** Trailers · Sports content · Game cinematics · Stunt previz · Music video cuts

---

## Prompt Variations

### 🔵 Google Veo 3.1 _(Featured)_

**Variation 1 — Rooftop Parkour Beat** _(Chase)_
```text
Dynamic tracking shot: [SUBJECT — e.g., a runner in a grey hoodie] sprints across a rooftop toward the camera, vaults a ventilation duct, and slides under a pipe, the camera whip-panning to follow. Late afternoon sun, long shadows, dust kicked up on the slide. Fast shutter feel with crisp motion, urban skyline background. SFX: pounding footsteps, fabric rustle, a metallic clang on the vault, driving percussion.
```

**Variation 2 — Vehicle Pursuit** _(Cinematic)_
```text
Low-angle tracking shot alongside a [VEHICLE — e.g., matte black motorcycle] weaving through night traffic on a rain-slicked street, neon reflections streaking across the wet asphalt. A pursuing [VEHICLE 2] slides into frame behind it. Motion blur on the background, sharp focus on the lead vehicle. SFX: engine roar, tires hissing on wet pavement, a horn dopplering past.
```

**Variation 3 — Slow-Motion Impact** _(Sports)_
```text
Ultra slow-motion shot: [ATHLETE] leaps for [ACTION — e.g., a header on a driven cross], captured mid-air at the peak of extension, sweat and rain droplets suspended around them. Stadium floodlights create four-point rim lighting. The camera arcs slightly around the moment of contact. SFX: a deep sub-bass hit at contact, crowd roar swelling in slow motion.
```

### OpenAI Sora 2

**Variation 1 — Foot Chase Through Market**
```text
Handheld chase shot: the camera pursues [SUBJECT] as they sprint through a crowded [MARKET/ENVIRONMENT], dodging vendors, knocking over a crate of [OBJECTS] that scatter across the ground. Realistic collision physics, crowd reacting and turning. Hard midday light, documentary energy. Sound: shouting vendors, scattering objects, hard breathing close to the mic.
```

**Variation 2 — Multi-Shot Action Sequence**
```text
Shot 1: Wide shot — [SUBJECT] skids around a corner into an alley, glancing back. Shot 2: Close-up — their eyes find a fire escape. Shot 3: Low angle — they leap, catch the ladder, and haul themselves up as their pursuer's shadow crosses the wall below. Gritty urban grade, continuous energy across cuts, realistic physics. Sound: footsteps, chain-link rattle, tense pulsing score.
```

### Runway Gen-4.x

**Variation 1 — Energy from a Still**
```text
The subject bursts into a sprint away from the camera as the handheld camera chases, shaking with the run, background rushing past with motion blur. Fast, urgent, continuous motion. Cinematic live-action.
```

### Kling 2.x

**Variation 1 — Standoff to Strike**
```text
Two [FIGHTERS] circle each other, then one lunges with a fast strike that the other barely blocks, both sliding back from the impact. Scene: [ENVIRONMENT — e.g., a rain-soaked dojo courtyard at dusk]. Camera language: slow orbital move that snaps to a quick push-in on the strike. Lighting: moody low key with rim light. Atmosphere: coiled tension exploding into violence.
```
- **Negative prompt:** `extra limbs, distorted anatomy, teleporting, rubbery motion, frame stutter`

### Pika 2.2

**Variation 1 — Impact Effect** _(Pikaffects-friendly)_
```text
[SUBJECT/OBJECT] is struck by [FORCE — e.g., a shockwave] and shatters into fragments that blast toward the camera in slow motion, pieces tumbling with realistic spin. Dark background, hard rim light on the debris. Locked camera.
```

---

## 💡 Tips

- **One beat per clip**: a vault, a strike, a skid — not a whole fight. Chain clips for sequences.
- **Match camera energy to action**: handheld chase for pursuits, whip-pan for direction changes, slow arc for slow-motion peaks.
- **Give physics anchors**: dust, splashes, scattering objects, and fabric movement make speed legible and hide anatomical wobble.
- **Slow motion is your friend**: models handle 2x-slower action far more coherently than real-time frenzy.
- **Expect iteration**: action has the highest artifact rate of any genre; generate multiple seeds and cut the best moments.
- **Pairs well with:** [Drone & Establishing Shot](drone-establishing-shot.md), [Cinematic Sequence](cinematic-sequence.md)
