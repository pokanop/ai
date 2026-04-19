# Image Generation Prompts

[← Back to Main Repository](../../README.md)

A comprehensive library of **59 optimized image generation prompt styles** across 11 categories, each with multiple contextual prompt variations tailored for real-world use cases. Every style doc provides copy-paste prompts for Nano Banana 2 _(featured)_, ChatGPT, Midjourney, and Stable Diffusion — simply replace `[PLACEHOLDERS]` with your own content.

---

## ⚡ Quick Start with Nano Banana 2

If you just want to generate something great right now:

1. Pick a style from the [categories below](#-professional--persona).
2. Open the style doc and go to the **Nano Banana 2** section (listed first).
3. Choose the variation that matches your use case (e.g., "Social Media Post," "Desktop Wallpaper," "Character Portrait").
4. Copy the prompt, replace the `[PLACEHOLDERS]`, and paste into Nano Banana.
5. Iterate — use follow-up messages to refine colors, composition, lighting, or details.

> **Have a reference photo?** Jump to the [Image-to-Image Transformations](#-using-reference-images-image-to-image) section to transform existing images into any style.

---

## Platform Guide

Each prompt is provided in four platform-specific variants. Understanding their strengths will help you get the best results.

### 🔵 Nano Banana 2 _(Featured — Best Overall Quality)_

> *Nano Banana 2 (powered by Gemini 3.1 Flash Image) is a major upgrade over the original. Treat it as a full-featured creative engine, not a quick-filter tool.*

- **Style**: Detailed, structured natural language. Front-load the asset type and primary subject, then layer in style, lighting, and composition details.
- **Strengths**: Combines pro-model quality with flash-model speed. Supports multi-turn conversational refinement, search grounding (reference real-world subjects by name), accurate text rendering, character consistency (up to 5 characters), and output up to 4K resolution.
- **Why It's Featured**: NB2 consistently produces the most detailed, accurate, and stylistically faithful results across all 57 styles in this library. Its conversational refinement loop means you can iterate toward perfection without re-writing your entire prompt.
- **Key Tips**:

  | Tip | Details |
  |-----|---------|
  | **Be specific, not vague** | NB2's reasoning engine rewards precise descriptors for textures, colors, and lighting over generic adjectives |
  | **Front-load important details** | Place the asset type and primary subject at the beginning of your prompt |
  | **Specify aspect ratios** | Explicitly state the format: `16:9` for wallpapers, `4:5` for Instagram, `9:16` for stories, `1:1` for profile pictures |
  | **Iterate conversationally** | Refine with follow-ups: "Change the palette to warmer tones," "Move the subject left," "Add more texture to the background" |
  | **Leverage search grounding** | For real-world subjects, ask the model to reference accurate imagery: "Use image search to find accurate reference for [specific subject]" |
  | **Use positive framing** | Instead of "no cars," describe the scene you *do* want: "empty, deserted street" |
  | **Specify camera/lens** | For photographic styles, include lens (85mm, 35mm, macro), aperture (f/1.8, f/8), and camera angle (low, eye-level, bird's eye) |
  | **Name your lighting** | Use specific lighting terms: "Rembrandt lighting," "golden hour," "tungsten warm glow," "volumetric fog" |

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

---

## 📐 Aspect Ratio Cheat Sheet

Quick reference for common output formats:

| Use Case | Ratio | Pixels (Recommended) | Notes |
|----------|-------|----------------------|-------|
| Instagram Post | `1:1` | 1080×1080 | Square feed post |
| Instagram Portrait | `4:5` | 1080×1350 | Tallest feed format, maximum real estate |
| Instagram / TikTok Story | `9:16` | 1080×1920 | Full-screen vertical |
| LinkedIn / Twitter Header | `3:1` | 1500×500 | Wide banner |
| Desktop Wallpaper | `16:9` | 3840×2160 | Standard widescreen / 4K |
| Ultrawide Wallpaper | `21:9` | 3440×1440 | Ultrawide monitors |
| Phone Wallpaper | `9:19.5` | 1290×2796 | iPhone Pro Max |
| Profile Picture / App Icon | `1:1` | 512×512 or 1024×1024 | Square, tight crop |
| Pinterest Pin | `2:3` | 1000×1500 | Tall vertical |
| YouTube Thumbnail | `16:9` | 1280×720 | Standard video thumbnail |
| Poster / Print (A-series) | `1:1.414` | 2480×3508 | A4 at 300 DPI |
| Book Cover | `2:3` | 1600×2400 | Standard paperback |

---

## 🖼️ Using Reference Images (Image-to-Image)

When you want to stylize an existing photo (e.g., turning a portrait into a Pixar character or transforming a landscape into a watercolor), each platform handles reference images differently. Each style doc includes a dedicated **🔄 Image-to-Image Transformations** section with platform-specific prompts.

### Nano Banana 2 _(Featured)_

Upload your image to the conversation, then describe the transformation:

```text
"Using the attached image as the base, transform it into [STYLE]. Preserve the subject's appearance and pose, but apply [SPECIFIC STYLE DETAILS]. Use a [ASPECT RATIO] format."
```

**Conversational refinement** — After the initial result, iterate with follow-ups:
- "Increase the intensity of the style — push it further from photorealism"
- "Keep the subject's face more recognizable"
- "Change the background to [NEW ENVIRONMENT] while keeping the style"
- "Apply the style only to the background — keep the subject photorealistic"

### ChatGPT

Upload the image to the conversation, then prompt:

```text
"Using the attached image as a reference for the subject's appearance, create a [STYLE] version. Preserve the person's likeness, clothing, and pose. [ADDITIONAL STYLE DETAILS]."
```

### Midjourney

Place the image URL at the **start** of your prompt:

```text
[IMAGE_URL] [STYLE DESCRIPTION] --iw [WEIGHT] --ar [RATIO]
```

| Parameter | Recommended Value | Purpose |
|-----------|-------------------|---------|
| `--iw` | `1.0–1.5` for style transfer, `1.5–2.0` for close preservation | Controls how closely the output follows the reference |
| `--cref` | Use for character consistency across multiple images | Maintains identity (face, features) across generations |
| `--sref` | Use to apply a style from a separate reference | Applies the aesthetic of another image |

### Stable Diffusion

Use the **Img2Img** pipeline with these recommended settings:

| Setting | Light Stylization | Medium Transformation | Heavy Restyling |
|---------|-------------------|----------------------|-----------------|
| **Denoising Strength** | 0.3–0.45 | 0.45–0.65 | 0.65–0.85 |
| **Use Case** | Subtle filter effect | Balanced style transfer | New artwork based on composition |

- **ControlNet** alternative: For preserving exact pose/composition while completely changing style, use ControlNet with the `canny` or `openpose` preprocessor.
- **Prompt**: Describe the desired output style. The original image provides composition/structure.
- **Negative Prompt**: Target specific unwanted artifacts only.

---

## 🎯 Choosing the Right Style by Use Case

Not sure which style to pick? Start from what you need:

| Use Case | Recommended Styles |
|----------|-------------------|
| **LinkedIn / Professional headshot** | [Professional Headshots](styles/professional-headshots.md), [Cinematic Headshots](styles/cinematic-headshots.md) |
| **Social media profile picture** | [Modern Avatars](styles/modern-avatars.md), [Pixar](styles/pixar-3d-animation.md), [The Simpsons](styles/the-simpsons.md) |
| **App icon / thumbnail** | [3D Isometric Resin](styles/3d-isometric-resin-sculptures.md), [Minimalist Notion](styles/minimalist-notion-style.md), [Pixelated 16-bit](styles/pixelated-16-bit.md) |
| **Desktop wallpaper** | [Solarpunk](styles/solarpunk.md), [Cyberpunk Noir](styles/cyberpunk-noir.md), [Bioluminescent Underwater](styles/bioluminescent-underwater.md), [Double Exposure](styles/double-exposure.md) |
| **Instagram / social media post** | [Wes Anderson](styles/wes-anderson-symmetry.md), [Studio Ghibli](styles/studio-ghibli-anime.md), [Claymation](styles/claymation-stop-motion.md) |
| **Poster / print** | [Art Deco](styles/art-deco-illustration.md), [Concert Poster](styles/concert-poster.md), [Soviet Constructivist](styles/soviet-constructivist.md) |
| **Album / book cover** | [Vinyl Album Cover](styles/vinyl-album-cover.md), [Double Exposure](styles/double-exposure.md), [Glitch Art](styles/glitch-art.md) |
| **Children's content** | [Yarn / Amigurumi](styles/yarn-amigurumi.md), [Claymation](styles/claymation-stop-motion.md), [Paper Cutout](styles/paper-cutout-kirigami.md) |
| **Educational / scientific** | [Botanical Illustration](styles/botanical-illustration.md), [Blueprint](styles/blueprint-technical-drawing.md), [Electron Microscope](styles/electron-microscope.md) |
| **Holiday / greeting card** | [Stained Glass](styles/stained-glass-windows.md), [Illuminated Manuscript](styles/illuminated-manuscript.md), [Embroidered](styles/embroidered-cross-stitch.md) |
| **Game asset / concept art** | [Isometric Pixel City](styles/isometric-pixel-city.md), [Holographic UI](styles/holographic-ui-sci-fi.md), [Steampunk](styles/steampunk-contraptions.md) |
| **Brand / marketing asset** | [Art Nouveau](styles/art-nouveau-mucha.md), [Minimalist Notion](styles/minimalist-notion-style.md), [Wes Anderson](styles/wes-anderson-symmetry.md) |
| **Photo-to-character conversion** | [Pixar](styles/pixar-3d-animation.md), [The Simpsons](styles/the-simpsons.md), [Lego](styles/lego-photography.md), [Studio Ghibli](styles/studio-ghibli-anime.md) |
| **Turning a photo into fine art** | [Ukiyo-e Woodblock](styles/ukiyo-e-woodblock.md), [Art Nouveau](styles/art-nouveau-mucha.md), [Byzantine Mosaic](styles/byzantine-mosaic.md) |

---

## How to Use These Prompts

1. **Find a style** from the categories below or use the [use-case guide](#-choosing-the-right-style-by-use-case) above.
2. **Click through** to the individual style doc.
3. **Pick a variation** that matches your intended output (profile pic, wallpaper, poster, etc.).
4. **Copy the prompt** for your platform — Nano Banana 2 is listed first and recommended.
5. **Replace placeholders** — `[SUBJECT]`, `[ENVIRONMENT]`, `[COLOR]`, etc. — with your desired content.
6. **Iterate** — adjust details, swap environments, or refine lighting based on initial results.

> **Contribute!** Generated a great image with one of these prompts? Submit a PR to replace the placeholder image in the style doc with your result!

---

## 📸 Professional & Persona

| # | Style | Description |
|---|-------|-------------|
| 1 | [Cinematic Headshots](styles/cinematic-headshots.md) | Dramatic studio-quality portrait photography with Rembrandt lighting and shallow depth of field |
| 2 | [Modern Avatars](styles/modern-avatars.md) | Stylized 3D profile pictures with clean geometric surfaces and vibrant gradient backgrounds |
| 3 | [Professional Headshots](styles/professional-headshots.md) | Polished corporate-grade portraits with clean studio lighting and neutral backgrounds for business use |

---

## 🎨 Toy & Miniature Worlds

| # | Style | Description |
|---|-------|-------------|
| 4 | [Lego Photography](styles/lego-photography.md) | Macro photography of Lego minifigures with plastic textures and injection mold seams |
| 5 | [Minecraft / Voxel](styles/minecraft-voxel.md) | Blocky cubic geometry with RTX ray-traced lighting in the Minecraft visual language |
| 6 | [3D Isometric Resin Sculptures](styles/3d-isometric-resin-sculptures.md) | Open handcrafted miniature resin sculptures with richly textured matte surfaces |
| 7 | [Landmark Dioramas](styles/landmark-dioramas.md) | Miniature tilt-shift architectural models of real or imaginary landmarks |
| 8 | [Miniature People in Everyday Objects](styles/miniature-people.md) | Tiny figurines interacting with full-size food and objects as landscapes |

---

## 🎬 Animation & Comics

| # | Style | Description |
|---|-------|-------------|
| 9 | [Pixar / 3D Animation](styles/pixar-3d-animation.md) | Expressive 3D animated characters with large emotive eyes and whimsical environments |
| 10 | [Superhero Comic Book](styles/superhero-comic-book.md) | Dynamic action panels with heavy ink outlines, halftone shading, and speed lines |
| 11 | [Cell Shaded Art](styles/cell-shaded-art.md) | Flat-shaded stylized 3D with thick outlines — Borderlands / Breath of the Wild aesthetic |
| 12 | [The Simpsons](styles/the-simpsons.md) | Matt Groening's iconic yellow-skin, bulging-eye, flat-color art style |
| 13 | [Studio Ghibli Anime](styles/studio-ghibli-anime.md) | Lush hand-painted watercolor environments with emotionally expressive characters |

---

## 🧵 Craft & Materials

| # | Style | Description |
|---|-------|-------------|
| 14 | [Made of Yarn / Amigurumi](styles/yarn-amigurumi.md) | Knitted and crocheted characters with visible stitches and warm lighting |
| 15 | [Paper Cutout / Kirigami](styles/paper-cutout-kirigami.md) | Multi-layered paper craft with crisp cut edges and dramatic drop shadows |
| 16 | [Claymation / Stop-Motion](styles/claymation-stop-motion.md) | Modeling clay with visible fingerprint impressions and miniature handmade sets |
| 17 | [Embroidered / Cross-Stitch](styles/embroidered-cross-stitch.md) | Thread on fabric with visible canvas weave and cross-stitch grid patterns |
| 18 | [Wooden Marquetry / Intarsia](styles/wooden-marquetry.md) | Scenes composed from contrasting wood veneers with natural grain patterns |
| 19 | [Frosted Glass / Ice Sculpture](styles/frosted-glass-ice-sculpture.md) | Crystalline subjects with internal refractions and condensation droplets |
| 20 | [Cloud / Smoke Sculpture](styles/cloud-smoke-sculpture.md) | Subjects formed from volumetric clouds, dissolving ethereally at the edges |

---

## ✏️ Design & Graphic

| # | Style | Description |
|---|-------|-------------|
| 21 | [Minimalist Notion Style](styles/minimalist-notion-style.md) | Ultra-clean black-and-white line art with bold strokes and generous negative space |
| 22 | [Art Deco Illustration](styles/art-deco-illustration.md) | Gatsby-era geometric elegance with gold leaf, sunburst patterns, and 1920s luxury |
| 23 | [Wes Anderson Symmetry](styles/wes-anderson-symmetry.md) | Perfectly centered compositions with pastel palettes and dollhouse-like interiors |
| 24 | [Brutalist Architecture](styles/brutalist-architecture.md) | Monolithic raw concrete forms with dramatic shadows and geometric repetition |
| 25 | [Vinyl Album Cover Art](styles/vinyl-album-cover.md) | Classic square-format album covers with genre-specific aesthetics and typography |
| 26 | [Concert Poster / Gig Poster](styles/concert-poster.md) | Screen-printed aesthetic with limited color palettes and hand-drawn typography |

---

## 🕹️ Retro & Digital

| # | Style | Description |
|---|-------|-------------|
| 27 | [Pixelated / 16-bit](styles/pixelated-16-bit.md) | Authentic SNES/Genesis pixel art with limited color palettes and visible pixel grids |
| 28 | [Isometric Pixel City](styles/isometric-pixel-city.md) | Top-down isometric urban grids in a SimCity/Habbo management-game aesthetic |
| 29 | [Cyberpunk Noir](styles/cyberpunk-noir.md) | Neon-soaked rain-drenched dystopian cityscapes with Blade Runner aesthetics |
| 30 | [Steampunk Contraptions](styles/steampunk-contraptions.md) | Victorian brass gears, copper pipes, leather straps, and billowing steam |
| 31 | [Glitch Art / Databending](styles/glitch-art.md) | Intentionally corrupted imagery with pixel sorting and color channel displacement |
| 32 | [Vaporwave / Synthwave Retrowave](styles/vaporwave-synthwave.md) | Neon grids, chrome gradients, and 80s nostalgia — from ironic vaporwave to earnest retrowave |

---

## 🏛️ Historical & Cultural Art

| # | Style | Description |
|---|-------|-------------|
| 33 | [Art Nouveau / Alphonse Mucha](styles/art-nouveau-mucha.md) | Ornate decorative posters with flowing organic lines and floral borders |
| 34 | [Byzantine Mosaic](styles/byzantine-mosaic.md) | Gold-leaf tesserae tiles, hieratic frontal poses, and jewel-toned sacred art |
| 35 | [Soviet Constructivist Propaganda](styles/soviet-constructivist.md) | Bold geometric compositions with red/black/cream palettes and photomontage |
| 36 | [Illuminated Manuscript](styles/illuminated-manuscript.md) | Medieval gold-leaf pages with decorated initials and acanthus leaf borders |
| 37 | [Ukiyo-e Woodblock](styles/ukiyo-e-woodblock.md) | Traditional Japanese flat color planes with bold contour lines — Hokusai and Hiroshige |
| 38 | [Día de los Muertos](styles/dia-de-los-muertos.md) | Sugar skulls, marigolds, papel picado, and vibrant Mexican folk art patterns |
| 39 | [Aboriginal Dot Painting](styles/aboriginal-dot-painting.md) | Concentric dot patterns in earth-toned ochre palettes with dreamtime symbolism |
| 40 | [Persian Miniature Painting](styles/persian-miniature.md) | Jewel-toned flat-perspective scenes with gold leaf accents and geometric borders |
| 41 | [West African Kente / Ankara Portraits](styles/kente-ankara-portraits.md) | Bold geometric textile patterns in vivid primary colors celebrating West African heritage |

---

## 🌌 Fine Art & Surreal

| # | Style | Description |
|---|-------|-------------|
| 42 | [Double Exposure](styles/double-exposure.md) | Two images blended — a silhouette filled with a landscape, surreal and evocative |
| 43 | [Stained Glass Windows](styles/stained-glass-windows.md) | Jewel-toned glass panes with lead came lines and volumetric god rays |
| 44 | [Impossible Architecture / Escher](styles/impossible-architecture-escher.md) | Mind-bending Penrose stairs, recursive geometry, and paradoxical spatial relationships |
| 45 | [Fruit / Food Art Portraiture](styles/food-art-portraiture.md) | Arcimboldo-inspired portraits composed from arranged fruits, vegetables, and objects |
| 46 | [Bioluminescent Underwater](styles/bioluminescent-underwater.md) | Glowing deep-sea creatures and particles against the absolute black of the abyss |

---

## 📷 Photography & Imaging

| # | Style | Description |
|---|-------|-------------|
| 47 | [Cinematic Macro Photography](styles/cinematic-macro-photography.md) | Extreme close-ups revealing microscopic details with dramatic lighting and bokeh |
| 48 | [Long Exposure Light Painting](styles/long-exposure-light-painting.md) | Flowing light trails from steel wool, LEDs, and sparklers against black backgrounds |
| 49 | [Cyanotype / Sun Print](styles/cyanotype-sun-print.md) | Prussian blue and white botanical silhouettes on handmade paper |
| 50 | [Tilt-Shift Miniature Effect](styles/tilt-shift-miniature.md) | Real-world scenes made to look like tiny toy models through selective focus blur |
| 51 | [Daguerreotype / Tintype](styles/daguerreotype-tintype.md) | Antique metallic-tone photographs with oval vignettes and Victorian formal posing |
| 52 | [Infrared Thermal Photography](styles/infrared-thermal.md) | False-color FLIR heat maps — hot subjects in yellow/red against cool blue/purple |
| 53 | [X-Ray / Medical Imaging](styles/x-ray-imaging.md) | Translucent subjects revealing internal structure in silver-grey tones |

---

## 🔬 Scientific & Technical

| # | Style | Description |
|---|-------|-------------|
| 54 | [Botanical Illustration](styles/botanical-illustration.md) | Precise scientific watercolor illustrations with Latin annotations and cross-sections |
| 55 | [Blueprint / Technical Drawing](styles/blueprint-technical-drawing.md) | White-on-blue engineering schematics with exploded isometric views and dimension lines |
| 56 | [Electron Microscope / Nanoscale](styles/electron-microscope.md) | False-color SEM imagery revealing alien beauty at extreme magnification |

---

## 🪐 Speculative & Futurism

| # | Style | Description |
|---|-------|-------------|
| 57 | [Holographic / UI Sci-Fi](styles/holographic-ui-sci-fi.md) | Floating wireframe projections with HUD overlays — Minority Report / Iron Man aesthetic |
| 58 | [Solarpunk](styles/solarpunk.md) | Optimistic eco-futurism with vertical gardens, solar petals, and golden-hour warmth |
| 59 | [Retrofuturism / Raygun Gothic](styles/retrofuturism-raygun-gothic.md) | 1950s space-age chrome rockets, bubble helmets, and Jetsons-style architecture |
