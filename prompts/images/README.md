# Image Generation Prompts

[← Back to Main Repository](../../README.md)

A comprehensive library of **57 optimized image generation prompt styles** across 11 categories, tailored for the four major AI platforms. Each style doc contains copy-paste prompts for ChatGPT, Midjourney, Stable Diffusion, and Nano Banana 2 — simply replace `[PLACEHOLDERS]` with your own content.

---

## Platform Guide

Each prompt is provided in four platform-specific variants. Understanding how each platform interprets prompts will help you get the best results.

### ChatGPT (GPT-4o Image Generation)

> *Replaces the standalone DALL-E 3 model, which is deprecated as of May 2026.*

- **Style**: Fully conversational, natural language. Describe your scene as if briefing an artist.
- **Strengths**: Excellent scene comprehension, precise spatial relationships, and iterative refinement through follow-up messages.
- **Tips**: Be specific about subject placement, lighting direction, and mood. You can assign it a persona (e.g., *"Act as a professional product photographer"*) for higher fidelity. Use follow-up messages to adjust individual elements without re-describing the whole scene.

### Midjourney (V7)

> *V7 is the current default model. Parameters like `--v 6.0` are no longer needed.*

- **Style**: Natural language with parameters appended at the end. V7 has moved away from keyword stuffing toward descriptive sentences.
- **Key Parameters**:

  | Parameter | Purpose | Example |
  |-----------|---------|---------|
  | `--ar` | Aspect ratio | `--ar 16:9`, `--ar 4:5` |
  | `--s` | Stylization (0–1000). Low = literal, high = artistic | `--s 250` |
  | `--no` | Exclude elements (replaces negative prompts) | `--no text, blur` |
  | `--cref` | Character reference — maintains identity across images | `--cref [URL]` |
  | `--sref` | Style reference — applies the aesthetic of a reference image | `--sref [URL]` |
  | `--iw` | Image weight for reference influence (0–2) | `--iw 1.5` |
  | `--chaos` | Variation in initial grid (0–100) | `--chaos 30` |

- **Tips**: Place the most important visual information first. Use `--niji` for anime and illustration styles.

### Stable Diffusion (SDXL / SD 3.5)

- **Style**: Supports both keyword tags and natural language. Modern models (SDXL, SD 3.5) work best with descriptive sentences, structured as **Subject → Action → Environment → Style/Lighting**.
- **Negative Prompts**: Use sparingly and only for *specific unwanted elements*. Bloated negative prompt lists degrade output quality on modern models. Try generating without negatives first, then add targeted exclusions as needed.
- **Tips**: Avoid over-weighting (e.g., `(keyword:1.5)`) — use it to nudge, not force. Ensure your resolution matches the model's native aspect ratio.

### Nano Banana 2

> *Nano Banana 2 (powered by Gemini 3.1 Flash Image) is a major upgrade over the original. Treat it as a full-featured creative engine, not a quick-filter tool.*

- **Style**: Detailed, structured natural language — similar to ChatGPT. Front-load the asset type and primary subject, then layer in style, lighting, and composition details.
- **Strengths**: Combines pro-model quality with flash-model speed. Supports multi-turn conversational refinement, search grounding (reference real-world subjects by name), accurate text rendering, character consistency (up to 5 characters), and output up to 4K resolution.
- **Key Tips**:
  - **Be specific, not vague** — NB2's reasoning engine rewards precise descriptors for textures, colors, and lighting over generic adjectives.
  - **Front-load important details** — Place the asset type and primary subject at the beginning of your prompt.
  - **Specify aspect ratios** — Explicitly state the intended format (e.g., `16:9` for desktop wallpaper, `4:5` for Instagram, `9:16` for stories).
  - **Iterate conversationally** — Refine results with follow-up commands (e.g., "Change the color palette to warmer tones," "Move the subject to the left").
  - **Leverage search grounding** — For real-world subjects, ask the model to reference accurate imagery (e.g., "Use image search to find accurate reference for [specific bird species]").
  - **Use positive framing** — Instead of "no cars," describe the scene you *do* want (e.g., "empty, deserted street").

---

## 🖼️ Using Reference Images (Image-to-Image)

When you want to stylize an existing photo (e.g., turning a portrait into a Pixar character), each platform handles reference images differently:

| Platform | How to Use a Reference Image |
|----------|------------------------------|
| **ChatGPT** | Upload the image to the conversation, then prompt: *"Using the attached image as a reference for the subject's appearance…"* |
| **Midjourney** | Place the image URL at the start of your prompt. Control adherence with `--iw` (0–2). For character consistency, use `--cref [URL]`. |
| **Stable Diffusion** | Use the **Img2Img** or **ControlNet** pipeline. Adjust `Denoising Strength` (0.4–0.7) to balance the original image against the new style. |
| **Nano Banana 2** | Upload your image to the conversation and describe the transformation. Supports conversational follow-ups to refine the result. |

> Styles marked with a 🔄 icon in their individual docs include dedicated **Image-to-Image Variations**.

---

## How to Use These Prompts

1. **Find a style** from the categories below.
2. **Click through** to the individual style doc.
3. **Copy the prompt** for your platform.
4. **Replace placeholders** — `[SUBJECT]`, `[ENVIRONMENT]`, `[COLOR]`, etc. — with your desired content.
5. **Iterate** — adjust details, swap environments, or refine lighting based on initial results.

> **Contribute!** Generated a great image with one of these prompts? Submit a PR to replace the placeholder image in the style doc with your result!

---

## 📸 Professional & Persona

| # | Style | Description |
|---|-------|-------------|
| 1 | [Cinematic Headshots](styles/cinematic-headshots.md) | Dramatic studio-quality portrait photography with Rembrandt lighting and shallow depth of field |
| 2 | [Modern Avatars](styles/modern-avatars.md) | Stylized 3D profile pictures with clean geometric surfaces and vibrant gradient backgrounds |

---

## 🎨 Toy & Miniature Worlds

| # | Style | Description |
|---|-------|-------------|
| 3 | [Lego Photography](styles/lego-photography.md) | Macro photography of Lego minifigures with plastic textures and injection mold seams |
| 4 | [Minecraft / Voxel](styles/minecraft-voxel.md) | Blocky cubic geometry with RTX ray-traced lighting in the Minecraft visual language |
| 5 | [3D Isometric Resin Sculptures](styles/3d-isometric-resin-sculptures.md) | Open handcrafted miniature resin sculptures with richly textured matte surfaces |
| 6 | [Landmark Dioramas](styles/landmark-dioramas.md) | Miniature tilt-shift architectural models of real or imaginary landmarks |
| 7 | [Miniature People in Everyday Objects](styles/miniature-people.md) | Tiny figurines interacting with full-size food and objects as landscapes |

---

## 🎬 Animation & Comics

| # | Style | Description |
|---|-------|-------------|
| 8 | [Pixar / 3D Animation](styles/pixar-3d-animation.md) | Expressive 3D animated characters with large emotive eyes and whimsical environments |
| 9 | [Superhero Comic Book](styles/superhero-comic-book.md) | Dynamic action panels with heavy ink outlines, halftone shading, and speed lines |
| 10 | [Cell Shaded Art](styles/cell-shaded-art.md) | Flat-shaded stylized 3D with thick outlines — Borderlands / Breath of the Wild aesthetic |
| 11 | [The Simpsons](styles/the-simpsons.md) | Matt Groening's iconic yellow-skin, bulging-eye, flat-color art style |
| 12 | [Studio Ghibli Anime](styles/studio-ghibli-anime.md) | Lush hand-painted watercolor environments with emotionally expressive characters |

---

## 🧵 Craft & Materials

| # | Style | Description |
|---|-------|-------------|
| 13 | [Made of Yarn / Amigurumi](styles/yarn-amigurumi.md) | Knitted and crocheted characters with visible stitches and warm lighting |
| 14 | [Paper Cutout / Kirigami](styles/paper-cutout-kirigami.md) | Multi-layered paper craft with crisp cut edges and dramatic drop shadows |
| 15 | [Claymation / Stop-Motion](styles/claymation-stop-motion.md) | Modeling clay with visible fingerprint impressions and miniature handmade sets |
| 16 | [Embroidered / Cross-Stitch](styles/embroidered-cross-stitch.md) | Thread on fabric with visible canvas weave and cross-stitch grid patterns |
| 17 | [Wooden Marquetry / Intarsia](styles/wooden-marquetry.md) | Scenes composed from contrasting wood veneers with natural grain patterns |
| 18 | [Frosted Glass / Ice Sculpture](styles/frosted-glass-ice-sculpture.md) | Crystalline subjects with internal refractions and condensation droplets |
| 19 | [Cloud / Smoke Sculpture](styles/cloud-smoke-sculpture.md) | Subjects formed from volumetric clouds, dissolving ethereally at the edges |

---

## ✏️ Design & Graphic

| # | Style | Description |
|---|-------|-------------|
| 20 | [Minimalist Notion Style](styles/minimalist-notion-style.md) | Ultra-clean black-and-white line art with bold strokes and generous negative space |
| 21 | [Art Deco Illustration](styles/art-deco-illustration.md) | Gatsby-era geometric elegance with gold leaf, sunburst patterns, and 1920s luxury |
| 22 | [Wes Anderson Symmetry](styles/wes-anderson-symmetry.md) | Perfectly centered compositions with pastel palettes and dollhouse-like interiors |
| 23 | [Brutalist Architecture](styles/brutalist-architecture.md) | Monolithic raw concrete forms with dramatic shadows and geometric repetition |
| 24 | [Vinyl Album Cover Art](styles/vinyl-album-cover.md) | Classic square-format album covers with genre-specific aesthetics and typography |
| 25 | [Concert Poster / Gig Poster](styles/concert-poster.md) | Screen-printed aesthetic with limited color palettes and hand-drawn typography |

---

## 🕹️ Retro & Digital

| # | Style | Description |
|---|-------|-------------|
| 26 | [Pixelated / 16-bit](styles/pixelated-16-bit.md) | Authentic SNES/Genesis pixel art with limited color palettes and visible pixel grids |
| 27 | [Isometric Pixel City](styles/isometric-pixel-city.md) | Top-down isometric urban grids in a SimCity/Habbo management-game aesthetic |
| 28 | [Cyberpunk Noir](styles/cyberpunk-noir.md) | Neon-soaked rain-drenched dystopian cityscapes with Blade Runner aesthetics |
| 29 | [Steampunk Contraptions](styles/steampunk-contraptions.md) | Victorian brass gears, copper pipes, leather straps, and billowing steam |
| 30 | [Glitch Art / Databending](styles/glitch-art.md) | Intentionally corrupted imagery with pixel sorting and color channel displacement |

---

## 🏛️ Historical & Cultural Art

| # | Style | Description |
|---|-------|-------------|
| 31 | [Art Nouveau / Alphonse Mucha](styles/art-nouveau-mucha.md) | Ornate decorative posters with flowing organic lines and floral borders |
| 32 | [Byzantine Mosaic](styles/byzantine-mosaic.md) | Gold-leaf tesserae tiles, hieratic frontal poses, and jewel-toned sacred art |
| 33 | [Soviet Constructivist Propaganda](styles/soviet-constructivist.md) | Bold geometric compositions with red/black/cream palettes and photomontage |
| 34 | [Illuminated Manuscript](styles/illuminated-manuscript.md) | Medieval gold-leaf pages with decorated initials and acanthus leaf borders |
| 35 | [Ukiyo-e Woodblock](styles/ukiyo-e-woodblock.md) | Traditional Japanese flat color planes with bold contour lines — Hokusai and Hiroshige |
| 36 | [Día de los Muertos](styles/dia-de-los-muertos.md) | Sugar skulls, marigolds, papel picado, and vibrant Mexican folk art patterns |
| 37 | [Aboriginal Dot Painting](styles/aboriginal-dot-painting.md) | Concentric dot patterns in earth-toned ochre palettes with dreamtime symbolism |
| 38 | [Persian Miniature Painting](styles/persian-miniature.md) | Jewel-toned flat-perspective scenes with gold leaf accents and geometric borders |
| 39 | [West African Kente / Ankara Portraits](styles/kente-ankara-portraits.md) | Bold geometric textile patterns in vivid primary colors celebrating West African heritage |

---

## 🌌 Fine Art & Surreal

| # | Style | Description |
|---|-------|-------------|
| 40 | [Double Exposure](styles/double-exposure.md) | Two images blended — a silhouette filled with a landscape, surreal and evocative |
| 41 | [Stained Glass Windows](styles/stained-glass-windows.md) | Jewel-toned glass panes with lead came lines and volumetric god rays |
| 42 | [Impossible Architecture / Escher](styles/impossible-architecture-escher.md) | Mind-bending Penrose stairs, recursive geometry, and paradoxical spatial relationships |
| 43 | [Fruit / Food Art Portraiture](styles/food-art-portraiture.md) | Arcimboldo-inspired portraits composed from arranged fruits, vegetables, and objects |
| 44 | [Bioluminescent Underwater](styles/bioluminescent-underwater.md) | Glowing deep-sea creatures and particles against the absolute black of the abyss |

---

## 📷 Photography & Imaging

| # | Style | Description |
|---|-------|-------------|
| 45 | [Cinematic Macro Photography](styles/cinematic-macro-photography.md) | Extreme close-ups revealing microscopic details with dramatic lighting and bokeh |
| 46 | [Long Exposure Light Painting](styles/long-exposure-light-painting.md) | Flowing light trails from steel wool, LEDs, and sparklers against black backgrounds |
| 47 | [Cyanotype / Sun Print](styles/cyanotype-sun-print.md) | Prussian blue and white botanical silhouettes on handmade paper |
| 48 | [Tilt-Shift Miniature Effect](styles/tilt-shift-miniature.md) | Real-world scenes made to look like tiny toy models through selective focus blur |
| 49 | [Daguerreotype / Tintype](styles/daguerreotype-tintype.md) | Antique metallic-tone photographs with oval vignettes and Victorian formal posing |
| 50 | [Infrared Thermal Photography](styles/infrared-thermal.md) | False-color FLIR heat maps — hot subjects in yellow/red against cool blue/purple |
| 51 | [X-Ray / Medical Imaging](styles/x-ray-imaging.md) | Translucent subjects revealing internal structure in silver-grey tones |

---

## 🔬 Scientific & Technical

| # | Style | Description |
|---|-------|-------------|
| 52 | [Botanical Illustration](styles/botanical-illustration.md) | Precise scientific watercolor illustrations with Latin annotations and cross-sections |
| 53 | [Blueprint / Technical Drawing](styles/blueprint-technical-drawing.md) | White-on-blue engineering schematics with exploded isometric views and dimension lines |
| 54 | [Electron Microscope / Nanoscale](styles/electron-microscope.md) | False-color SEM imagery revealing alien beauty at extreme magnification |

---

## 🪐 Speculative & Futurism

| # | Style | Description |
|---|-------|-------------|
| 55 | [Holographic / UI Sci-Fi](styles/holographic-ui-sci-fi.md) | Floating wireframe projections with HUD overlays — Minority Report / Iron Man aesthetic |
| 56 | [Solarpunk](styles/solarpunk.md) | Optimistic eco-futurism with vertical gardens, solar petals, and golden-hour warmth |
| 57 | [Retrofuturism / Raygun Gothic](styles/retrofuturism-raygun-gothic.md) | 1950s space-age chrome rockets, bubble helmets, and Jetsons-style architecture |
