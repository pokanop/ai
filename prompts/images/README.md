# Image Generation Prompts

[← Back to Main Repository](../../README.md)

Welcome to the ultimate catalog of image generation prompts! This repository contains highly optimized prompts for various styles and use-cases, tailored for the major AI platforms.

## Best Practices by Platform

- **Midjourney**: Focus on stylistic keywords, aspect ratios (`--ar 16:9`), stylization (`--s 250`), and technical photography terms. It thrives on comma-separated descriptive chunks.
- **DALL-E 3**: Highly conversational. Describe relationships, exact phrasing, and comprehensive visual details using natural language. It understands complex scenes beautifully.
- **Stable Diffusion**: Keyword-heavy, often requires specific formatting and negative prompts.
  - *Note on Negative Prompts*: Stable Diffusion requires "Negative Prompts" to explicitly tell the AI what **not** to include (e.g., "blurry, deformed, extra fingers, watermark"). This is essential for ensuring high-quality, anatomically correct outputs.
- **Nano Banana**: Quick, high-impact, and playful descriptions. Best for minimalist, fun, and extremely fast, expressive generations.

## 🖼️ Using Reference Images (Image-to-Image)

Often, you don't want to generate an image from scratch—you want to stylize a real photo (e.g., turning a photo of yourself into a Pixar character). Here is how you use reference images across platforms:

- **Midjourney**: Place the `[IMAGE_URL]` at the very beginning of your prompt. You can adjust how strongly it adheres to the original image using the image weight parameter (e.g., `--iw 1.5` or `--iw 2.0`).
- **DALL-E 3**: Upload your reference image to ChatGPT and prepend your prompt with: *"Using the attached image as a structural reference..."*
- **Stable Diffusion**: Use the **Img2Img** or **ControlNet** tab. Use the same text prompts provided below, but adjust your `Denoising Strength` (0.4 - 0.7) to control the balance between the original photo and the new style.
- **Nano Banana**: Upload your image and run the text prompt as a direct filter.

*Note: For styles perfectly suited to stylizing real photos (like avatars and anime), we've included specific **Image-to-Image Variations** below!*

## How to Use These Prompts

Replace placeholders like `[SUBJECT]`, `[ENVIRONMENT]`, `[COLORS]`, etc., with your desired content. These prompts are designed to be easily copied and pasted.

> **Contribute!** Whenever you generate a great image for one of these styles, please drop it into the designated image placeholder below the category description. Simply replace the `placeholder-[style].jpg` link with your own image!

---

## 📸 Professional & Persona

### 1. Cinematic Headshots
Professional, highly detailed, dramatic lighting. Perfect for profiles and professional avatars.

> *Image Placeholder: Drop your Cinematic Headshot image here!*  
> `![Cinematic Headshot Example](../../assets/placeholder-headshot.jpg)`

**DALL-E 3**
```text
A dramatically lit, cinematic headshot photograph of [SUBJECT]. Taken with an 85mm lens, f/1.8 aperture for a shallow depth of field. The background is a beautifully blurred [ENVIRONMENT]. Soft Rembrandt lighting, hyper-realistic, 8k resolution, highly detailed skin texture.
```

**Midjourney**
```text
Cinematic headshot photograph of [SUBJECT], [ENVIRONMENT] background, 85mm lens, f/1.8, soft Rembrandt lighting, shallow depth of field, sharp focus on eyes, hyper-realistic, 8k, photorealistic --ar 4:5 --style raw --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Raw photo of [SUBJECT], headshot, cinematic lighting, 85mm lens, f1.8, bokeh, blurred [ENVIRONMENT] background, highly detailed skin, highly detailed eyes, 8k uhd, dslr, soft lighting, high quality, masterpiece`
- **Negative Prompt:** `(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, extra limbs`

**Nano Banana**
```text
Crisp, striking professional headshot photo of [SUBJECT], dramatic light, completely blurred background.
```

> **Image-to-Image Variation (Stylizing a Photo):**  
> * **DALL-E 3:** `[Upload Photo] Using the attached photo as a reference, enhance the lighting to be dramatic and cinematic, set against a blurred [ENVIRONMENT].`  
> * **Midjourney:** `[IMAGE_URL] Cinematic headshot photograph, [ENVIRONMENT] background, 85mm lens, f/1.8, soft Rembrandt lighting, hyper-realistic --iw 1.5 --ar 4:5 --v 6.0`

---

### 2. Modern Avatars
Versatile, clean profile pictures tailored for modern platforms, gaming, and social media.

> *Image Placeholder: Drop your Avatar image here!*  
> `![Avatar Example](../../assets/placeholder-avatar.jpg)`

**DALL-E 3**
```text
A sleek, modern 3D avatar of [SUBJECT] for a profile picture. The avatar is centered against a vibrant, glowing [COLOR] background. Clean lines, stylized but recognizable features, subtle rim lighting, high-end 3D render style.
```

**Midjourney**
```text
Modern 3D avatar of [SUBJECT], vibrant glowing [COLOR] background, clean sleek lines, stylized features, rim lighting, octane render, unreal engine 5, profile picture --ar 1:1 --niji 6
```

**Stable Diffusion**
- **Prompt:** `Masterpiece, modern 3d avatar of [SUBJECT], [COLOR] glowing background, stylized features, rim lighting, octane render, ray tracing, high quality, vibrant colors`
- **Negative Prompt:** `ugly, realistic, photography, messy, chaotic, dull colors, low resolution, bad anatomy, poorly rendered, text, watermark`

**Nano Banana**
```text
Clean modern 3D avatar profile picture of [SUBJECT] over a glowing [COLOR] background.
```

> **Image-to-Image Variation (Converting a Photo to Avatar):**  
> * **DALL-E 3:** `[Upload Photo] Transform the person in the attached photo into a sleek, modern 3D avatar against a glowing [COLOR] background.`  
> * **Midjourney:** `[IMAGE_URL] Modern 3D stylized avatar of this person, clean sleek lines, rim lighting, glowing [COLOR] background, 3D render --iw 1.5 --ar 1:1 --niji 6`

---

## 🎨 Toy & Miniature Worlds

### 3. Lego Photography
Macro photography capturing the charm and plastic textures of Lego minifigures and bricks.

> *Image Placeholder: Drop your Lego image here!*  
> `![Lego Example](../../assets/placeholder-lego.jpg)`

**DALL-E 3**
```text
Macro photography of a Lego minifigure of [SUBJECT] placed in a miniature Lego-built [ENVIRONMENT]. The lighting is cinematic, highlighting the plastic sheen, injection mold marks, and bright classic Lego colors. Shot with a macro lens, shallow depth of field.
```

**Midjourney**
```text
Macro photo of a Lego minifigure of [SUBJECT] in a Lego [ENVIRONMENT], plastic texture, injection mold lines, bright Lego colors, cinematic lighting, tilt shift lens, shallow depth of field, photorealistic --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Macro photograph, lego minifigure of [SUBJECT], lego bricks setting, [ENVIRONMENT], plastic material texture, visible mold lines, studio lighting, depth of field, sharp focus, 8k, highly detailed`
- **Negative Prompt:** `human skin, realistic, human proportions, drawn, illustration, 2d, painting, large scale, out of focus, blurry`

**Nano Banana**
```text
Close-up macro shot of a cute Lego minifigure of [SUBJECT] in a tiny Lego [ENVIRONMENT].
```

> **Image-to-Image Variation (Lego-fying a Photo):**  
> * **DALL-E 3:** `[Upload Photo] Recreate the exact composition, pose, and person in this photo completely out of Lego bricks and as a Lego minifigure.`  
> * **Midjourney:** `[IMAGE_URL] Lego minifigure version of this subject, lego bricks, plastic texture, injection mold lines, bright colors, cinematic lighting --iw 1.8 --ar 16:9 --v 6.0`

---

### 4. Minecraft / Voxel
Blocky, 3D pixelated voxel aesthetics reminiscent of Minecraft.

> *Image Placeholder: Drop your Minecraft/Voxel image here!*  
> `![Minecraft Example](../../assets/placeholder-minecraft.jpg)`

**DALL-E 3**
```text
A beautiful 3D voxel art landscape featuring [SUBJECT] in a [ENVIRONMENT]. Made entirely of cubic blocks in a style reminiscent of Minecraft with RTX ray tracing turned on. Glowing blocks, volumetric lighting, rich colors.
```

**Midjourney**
```text
Voxel art of [SUBJECT] in [ENVIRONMENT], minecraft style, perfect cubes, volumetric lighting, ray tracing, 8k resolution, isometric perspective, colorful --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Voxel art, 3D pixel art, [SUBJECT] in [ENVIRONMENT], minecraft style, cubic blocks, ray traced lighting, volumetric fog, beautiful colors, octane render`
- **Negative Prompt:** `smooth, round, curves, realistic, photography, 2d, flat, illustration, low resolution`

**Nano Banana**
```text
Cool 3D blocky voxel art of [SUBJECT] in a Minecraft [ENVIRONMENT].
```

---

### 5. 3D Isomorphic Resin Sculptures
Glossy, perfect mini-world dioramas encased or styled like shiny resin art.

> *Image Placeholder: Drop your Resin Sculpture image here!*  
> `![Resin Sculpture Example](../../assets/placeholder-resin.jpg)`

**DALL-E 3**
```text
A 3D isometric render of a glossy resin diorama featuring [SUBJECT] in a mini [ENVIRONMENT]. The sculpture is highly polished, reflecting studio lights, with semi-transparent resin elements and vibrant, smooth colors. Set against a solid pastel background.
```

**Midjourney**
```text
3D isometric render, resin sculpture diorama of [SUBJECT] in [ENVIRONMENT], glossy, highly polished, semi-transparent resin, pastel background, studio lighting, octane render, tilt-shift --ar 1:1 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `3d isometric icon, glossy resin sculpture of [SUBJECT] in [ENVIRONMENT], smooth, highly reflective, subsurface scattering, pastel solid background, studio lighting, octane render, 8k`
- **Negative Prompt:** `matte, flat, illustration, drawing, noisy, photography, messy background, text`

**Nano Banana**
```text
Shiny 3D isometric resin sculpture of [SUBJECT] in a tiny [ENVIRONMENT].
```

---

### 6. Landmark Dioramas
Miniature, tilt-shift style models of famous or imaginary places.

> *Image Placeholder: Drop your Landmark Diorama image here!*  
> `![Landmark Diorama Example](../../assets/placeholder-diorama.jpg)`

**DALL-E 3**
```text
A highly detailed miniature diorama of a [SUBJECT/LANDMARK] resting on a wooden table. Tilt-shift photography effect makes it look tiny. The diorama includes miniature trees, tiny people, and [ENVIRONMENTAL DETAILS]. Studio lighting.
```

**Midjourney**
```text
Miniature diorama of [SUBJECT/LANDMARK], placed on a wooden table, tilt-shift photography, macro lens, tiny details, miniature scale, studio lighting, hyper-detailed --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Macro photography, miniature diorama of [SUBJECT/LANDMARK], tilt-shift, depth of field, resting on desk, highly detailed crafting, tiny scale, 8k`
- **Negative Prompt:** `life size, human scale, flat, illustration, painting, blurry, low resolution`

**Nano Banana**
```text
A cute, highly detailed miniature diorama of [SUBJECT] on a table.
```

---

## 🎬 Animation & Comics

### 7. Pixar / 3D Animation
Expressive characters, soft lighting, and whimsical environments.

> *Image Placeholder: Drop your Pixar image here!*  
> `![Pixar Example](../../assets/placeholder-pixar.jpg)`

**DALL-E 3**
```text
A 3D animated still of [SUBJECT] in the signature style of Pixar. Features large expressive eyes, soft textures, and vibrant colors. The character is in a whimsical [ENVIRONMENT], illuminated by warm, localized bounce lighting.
```

**Midjourney**
```text
3D animation still of [SUBJECT] in [ENVIRONMENT], Pixar style, Disney style, expressive features, soft textures, vibrant colors, warm magical lighting, octane render, 8k --ar 16:9 --niji 6
```

**Stable Diffusion**
- **Prompt:** `3D animation, [SUBJECT] in [ENVIRONMENT], pixar style, disney style, expressive, soft textures, beautiful rim lighting, volumetric lighting, highly detailed`
- **Negative Prompt:** `realistic, photo, horror, scary, 2d, anime, flat, sketch, monochrome, badly rendered`

**Nano Banana**
```text
A cute 3D animated character of [SUBJECT], Pixar style, vibrant and happy.
```

> **Image-to-Image Variation (Pixar-ifying a Photo):**  
> * **DALL-E 3:** `[Upload Photo] Turn the subjects in this photo into 3D Pixar-style animated characters, maintaining their clothing and the background but stylizing it.`  
> * **Midjourney:** `[IMAGE_URL] 3D animation still, Pixar style, Disney style, expressive features, soft textures, vibrant colors, warm magical lighting --iw 1.5 --ar 16:9 --niji 6`

---

### 8. Superhero Comic Book
Action-packed, dynamic poses with heavy ink lines and halftone dots.

> *Image Placeholder: Drop your Superhero image here!*  
> `![Superhero Example](../../assets/placeholder-superhero.jpg)`

**DALL-E 3**
```text
A dynamic comic book panel featuring [SUBJECT] in a powerful superhero action pose. Vibrant comic colors, heavy ink outlines, deep shadows, and subtle halftone dot textures. An explosive [ENVIRONMENT] in the background.
```

**Midjourney**
```text
Comic book panel, [SUBJECT] in superhero action pose, [ENVIRONMENT] background, dynamic angle, heavy ink lines, halftone texture, vibrant pop colors, marvel comics style --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Comic book illustration, [SUBJECT], dynamic superhero pose, heavy black ink lines, halftone dots, vibrant colors, action scene, [ENVIRONMENT] background, masterpiece`
- **Negative Prompt:** `photo, 3d, realistic, soft, blurry, painting, ugly, deformed, text, speech bubble`

**Nano Banana**
```text
Action-packed superhero comic book panel of [SUBJECT] with bright colors and ink lines.
```

---

### 9. Cell Shaded Art
Flat shaded, stylized art like Borderlands or classic Zelda.

> *Image Placeholder: Drop your Cell Shaded image here!*  
> `![Cell Shaded Example](../../assets/placeholder-cell-shaded.jpg)`

**DALL-E 3**
```text
Cell-shaded 3D video game art of [SUBJECT]. Thick black outlines, flat vibrant colors without soft gradients, striking sharp shadows. Set in a [ENVIRONMENT] that perfectly matches the stylized aesthetic.
```

**Midjourney**
```text
Cell-shaded art of [SUBJECT] in [ENVIRONMENT], thick black outlines, flat colors, hard shadows, video game concept art, borderlands style, zelda breath of the wild style --ar 16:9 --niji 6
```

**Stable Diffusion**
- **Prompt:** `Cell shaded 3D, [SUBJECT], thick outlines, flat colors, hard shadows, anime aesthetic, video game art, [ENVIRONMENT], high quality`
- **Negative Prompt:** `realistic, gradient shadows, soft lighting, photo, messy, complex texture, messy lines`

**Nano Banana**
```text
Cool cell-shaded video game art of [SUBJECT] with thick outlines and flat colors.
```

---

### 10. The Simpsons
Matt Groening's iconic yellow characters and overbites.

> *Image Placeholder: Drop your Simpsons image here!*  
> `![Simpsons Example](../../assets/placeholder-simpsons.jpg)`

**DALL-E 3**
```text
A 2D cartoon illustration of [SUBJECT] drawn in the exact style of The Simpsons. Featuring yellow skin, large circular eyes, distinct overbites, and simple flat colors, set against a classic Springfield [ENVIRONMENT].
```

**Midjourney**
```text
2D cartoon illustration of [SUBJECT], the simpsons style, matt groening, yellow skin, simple flat coloring, springfield [ENVIRONMENT] background --ar 16:9 --niji 6
```

**Stable Diffusion**
- **Prompt:** `The simpsons style cartoon, [SUBJECT], yellow skin, matt groening art style, flat colors, 2d animation still, springfield [ENVIRONMENT]`
- **Negative Prompt:** `3d, realistic, human proportions, shading, shadows, anime, different art style`

**Nano Banana**
```text
A funny cartoon of [SUBJECT] drawn in early 90s Simpsons yellow character style.
```

> **Image-to-Image Variation (Simpsonize Me!):**  
> * **DALL-E 3:** `[Upload Photo] Draw the person in this photo exactly in the style of The Simpsons, complete with yellow skin, overbite, and flat colors.`  
> * **Midjourney:** `[IMAGE_URL] The simpsons style, matt groening, yellow skin, simple flat coloring, cartoon version of this person --iw 1.5 --ar 1:1 --niji 6`

---

### 11. Studio Ghibli Anime
Lush, painted backgrounds with highly emotive character designs.

> *Image Placeholder: Drop your Anime image here!*  
> `![Anime Example](../../assets/placeholder-anime.jpg)`

**DALL-E 3**
```text
An anime movie still of [SUBJECT] in the style of Studio Ghibli. Lush, hand-painted watercolor-style [ENVIRONMENT] with beautiful floating clouds and a gentle breeze. Expressive character, soft magical lighting, highly detailed.
```

**Midjourney**
```text
Anime movie still, [SUBJECT] in [ENVIRONMENT], studio ghibli style, hayao miyazaki, lush painted background, beautiful fluffy clouds, magical lighting, watercolor textures --ar 16:9 --niji 6
```

**Stable Diffusion**
- **Prompt:** `Studio ghibli anime, [SUBJECT], beautiful hand painted watercolor background, [ENVIRONMENT], magical atmosphere, detailed clouds, masterpiece, high quality, 4k`
- **Negative Prompt:** `3d, photo, realistic, chaotic, messy, dark, horror, text, poorly drawn`

**Nano Banana**
```text
Beautiful Studio Ghibli anime style illustration of [SUBJECT] in a lush landscape.
```

> **Image-to-Image Variation (Anime Filter):**  
> * **DALL-E 3:** `[Upload Photo] Transform this photo into an anime movie still in the style of Studio Ghibli, converting the background into a lush watercolor painting.`  
> * **Midjourney:** `[IMAGE_URL] Studio ghibli style, anime movie still, lush painted background, magical lighting, watercolor textures --iw 1.5 --ar 16:9 --niji 6`

---

## 🧵 Craft & Design

### 12. Made of Yarn / Amigurumi
Cozy, tactile knitted and crocheted textures.

> *Image Placeholder: Drop your Yarn image here!*  
> `![Yarn Example](../../assets/placeholder-yarn.jpg)`

**DALL-E 3**
```text
A macro photograph of an adorable amigurumi crochet doll of [SUBJECT]. It is made entirely of soft yarn with visible stitches, fuzz, and texture. It sits in a cozy [ENVIRONMENT] made of knitted fabrics. Soft, warm lighting.
```

**Midjourney**
```text
Macro photography, amigurumi crochet doll of [SUBJECT], made entirely of yarn, visible stitches, fluffy yarn texture, [ENVIRONMENT] background made of knitted fabrics, cozy warm lighting, photorealistic --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Macro photo, amigurumi crochet figure of [SUBJECT], yarn texture, visible stitches, soft lighting, cozy knitted [ENVIRONMENT], highly detailed, 8k`
- **Negative Prompt:** `plastic, smooth, real, living, photo of human, ugly, blurry, flat`

**Nano Banana**
```text
A cute, knitted amigurumi yarn doll of [SUBJECT] in a cozy room.
```

---

### 13. Minimalist Notion Style
Clean, stark black-and-white line art with highly stylized simplicity.

> *Image Placeholder: Drop your Notion Style image here!*  
> `![Notion Style Example](../../assets/placeholder-notion.jpg)`

**DALL-E 3**
```text
A minimalist, black-and-white line art illustration of [SUBJECT]. It uses the clean, modern aesthetic of Notion app avatars—simple distinct lines, abstraction, no shading, and lots of negative space.
```

**Midjourney**
```text
Minimalist black and white line art of [SUBJECT], notion app style, simple thick lines, abstract, no shading, clean white background, modern corporate memphis --ar 1:1 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Minimalist line art, notion style, [SUBJECT], black and white, simple lines, clean white background, flat, abstract`
- **Negative Prompt:** `color, shading, 3d, realistic, gradients, complex details, messy lines`

**Nano Banana**
```text
Simple black and white minimalist line art drawing of [SUBJECT] on white background.
```

---

### 14. Paper Cutout / Kirigami
Multi-layered, textured paper crafts with deep, crisp shadows.

> *Image Placeholder: Drop your Paper Cutout image here!*  
> `![Paper Cutout Example](../../assets/placeholder-paper.jpg)`

**DALL-E 3**
```text
A beautiful 3D layered paper-cut illustration of [SUBJECT] in a [ENVIRONMENT]. The scene is composed of thick textured paper. Deep, harsh shadows separate each layer, creating a profound sense of depth. Soft, warm directional light.
```

**Midjourney**
```text
Layered paper-cut illustration of [SUBJECT] in [ENVIRONMENT], papercraft, kirigami, thick colored paper textures, distinct drop shadows, 3D depth, directional lighting --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Papercraft, layered paper cut illustration, [SUBJECT], [ENVIRONMENT], distinct drop shadows, 3d depth, paper texture, vibrant colors, studio lighting, high quality`
- **Negative Prompt:** `drawing, painting, realistic, photo, smooth, 2d, messy`

**Nano Banana**
```text
Beautiful multi-layered paper cutout craft of [SUBJECT] with 3D shadows.
```

---

## 🕹️ Retrowave & Stylized

### 15. Pixelated / 16-bit
Retro SNES/Genesis era pixel art with a limited color palette.

> *Image Placeholder: Drop your Pixelated image here!*  
> `![Pixelated Example](../../assets/placeholder-pixelated.jpg)`

**DALL-E 3**
```text
High-quality 16-bit pixel art of [SUBJECT] in a [ENVIRONMENT]. Authentic retro video game style with a limited crisp color palette, clear pixel boundaries, and no blurry gradients.
```

**Midjourney**
```text
16-bit pixel art of [SUBJECT] in [ENVIRONMENT], retro video game style, SNES graphics, crisp pixels, limited color palette, isometric perspective --ar 16:9 --niji 6
```

**Stable Diffusion**
- **Prompt:** `16-bit pixel art, [SUBJECT], retro game graphics, [ENVIRONMENT], crisp pixels, pixel perfect, masterpiece`
- **Negative Prompt:** `3d, realistic, smooth, gradients, blur, messy pixels, high resolution texture`

**Nano Banana**
```text
Retro 16-bit pixel art sprite of [SUBJECT] in a pixelated [ENVIRONMENT].
```

---

### 16. Cyberpunk Noir
Neon lights, rain, reflections, and gritty futuristic aesthetics.

> *Image Placeholder: Drop your Cyberpunk image here!*  
> `![Cyberpunk Example](../../assets/placeholder-cyberpunk.jpg)`

**DALL-E 3**
```text
A cinematic, gritty Cyberpunk Noir photograph of [SUBJECT]. Set in a futuristic, dystopian [ENVIRONMENT] filled with glowing neon signs at night. It is raining heavily, with beautiful reflections in puddles on the ground. High contrast.
```

**Midjourney**
```text
Cyberpunk noir, cinematic shot of [SUBJECT] in futuristic [ENVIRONMENT], night time, heavy rain, glowing neon signs, puddle reflections, gritty, blade runner style, photorealistic --ar 16:9 --style raw --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Cyberpunk noir, [SUBJECT], futuristic city, night, rain, neon lights, reflections, gritty, cinematic lighting, 8k, highly detailed photography`
- **Negative Prompt:** `daytime, bright, sunny, happy, simple, cartoon, anime, low quality`

**Nano Banana**
```text
Awesome cyberpunk sci-fi shot of [SUBJECT] at night with neon lights and rain.
```

> **Image-to-Image Variation (Cyberpunking a Photo):**  
> * **DALL-E 3:** `[Upload Photo] Transform the environment in this photo into a dystopian glowing cyberpunk city at night with neon lights.`  
> * **Midjourney:** `[IMAGE_URL] Cyberpunk noir style, futuristic city, night, heavy rain, glowing neon signs, puddle reflections, gritty --iw 1.5 --ar 16:9 --style raw --v 6.0`

---

### 17. Steampunk Contraptions
Victorian fashion mixed with brass, gears, and steam-powered technology.

> *Image Placeholder: Drop your Steampunk image here!*  
> `![Steampunk Example](../../assets/placeholder-steampunk.jpg)`

**DALL-E 3**
```text
An intricate Steampunk portrait of [SUBJECT]. The scene involves [ENVIRONMENT], adorned with shiny brass gears, leather, copper pipes, and venting steam. Victorian aesthetics mixed with retro-futuristic mechanical design.
```

**Midjourney**
```text
Steampunk aesthetics, [SUBJECT] in [ENVIRONMENT], intricate brass gears, leather, copper pipes, Victorian style, venting steam, rich sepia and gold tones, cinematic lighting --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Steampunk style, [SUBJECT], intricate mechanical details, brass, copper, leather, [ENVIRONMENT], victorian era, steam, high detail, masterpiece`
- **Negative Prompt:** `modern, futuristic, cyberpunk, messy, blurry, low res`

**Nano Banana**
```text
A highly detailed steampunk style version of [SUBJECT] made of brass gears and leather.
```

---

## 🌌 Fine Art & Surreal

### 18. Ukiyo-e Woodblock
Traditional Japanese art style with flat colors, stylized weather, and bold outlines.

> *Image Placeholder: Drop your Ukiyo-e image here!*  
> `![Ukiyo-e Example](../../assets/placeholder-ukiyoe.jpg)`

**DALL-E 3**
```text
A traditional Japanese Ukiyo-e woodblock print featuring [SUBJECT] in a [ENVIRONMENT]. It utilizes muted, historical ink colors, stylized waves, and bold contour lines, reminiscent of Hokusai's works.
```

**Midjourney**
```text
Traditional Japanese Ukiyo-e woodblock print of [SUBJECT] in [ENVIRONMENT], Hokusai style, historical ink colors, bold contours, stylized nature, vintage paper texture --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Ukiyo-e woodblock print, traditional Japanese art, [SUBJECT], [ENVIRONMENT], flat colors, bold outlines, vintage aesthetic, high quality`
- **Negative Prompt:** `3d, photography, modern, realistic, manga, messy`

**Nano Banana**
```text
Traditional ancient Japanese woodblock painting of [SUBJECT] with Mount Fuji.
```

---

### 19. Double Exposure
Blending two images into a striking, surreal combination (e.g., a face and a forest).

> *Image Placeholder: Drop your Double Exposure image here!*  
> `![Double Exposure Example](../../assets/placeholder-double-exposure.jpg)`

**DALL-E 3**
```text
A beautiful double exposure photograph. The silhouette of [SUBJECT] is filled with a stunning [ENVIRONMENT]. The background is bright white, allowing the intricate blend of the subject and landscape to create a surreal, emotional effect.
```

**Midjourney**
```text
Double exposure photography, silhouette of [SUBJECT] blended with [ENVIRONMENT], surrealism, bright white background, highly detailed blend, artistic, photorealistic --ar 4:5 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Double exposure photo, silhouette of [SUBJECT] containing [ENVIRONMENT], surreal art, white background, highly detailed, expressive, 8k`
- **Negative Prompt:** `messy composite, bad blending, text, border, realistic setting, chaotic background`

**Nano Banana**
```text
Artistic double exposure photo mixing the shape of [SUBJECT] with a cool [ENVIRONMENT].
```

---

### 20. Bioluminescent Underwater
Deep, glowing colors contrasting with pitch-black backgrounds.

> *Image Placeholder: Drop your Bioluminescent image here!*  
> `![Bioluminescent Example](../../assets/placeholder-bioluminescent.jpg)`

**DALL-E 3**
```text
A breathtaking underwater photograph of [SUBJECT] made of glowing bioluminescent lights. The environment is pitch black, making the vibrant neon blue and green organic lights pop brilliantly. Floating particles and subtle caustics.
```

**Midjourney**
```text
Bioluminescent underwater photography of [SUBJECT], glowing neon blue and green organic lights, pitch black deep sea background, floating glowing particles, cinematic --ar 16:9 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Bioluminescent [SUBJECT], deep underwater, dark background, glowing neon blue and green, organic light, floating particles, magical, highly detailed 8k photography`
- **Negative Prompt:** `daylight, surface, bright background, illustration, non-glowing`

**Nano Banana**
```text
Glowing bioluminescent shot of [SUBJECT] in a dark deep sea underwater environment.
```

---

### 21. Stained Glass Windows
Fractured arrays of vibrant glass lit from behind.

> *Image Placeholder: Drop your Stained Glass image here!*  
> `![Stained Glass Example](../../assets/placeholder-stained-glass.jpg)`

**DALL-E 3**
```text
A magnificent stained glass window depicting [SUBJECT] in a [ENVIRONMENT]. The image is built entirely from vibrant, colorful glass shards separated by thick black lead lines. Brilliant volumetric light rays shine through the glass, casting colorful shadows.
```

**Midjourney**
```text
Stained glass window depicting [SUBJECT], vivid colorful glass shards, thick black lead lines, intricate pattern, beautiful god rays shining through, church lighting --ar 4:5 --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Stained glass window, [SUBJECT], vivid colorful panes, thick black lead lines, light rays passing through, highly detailed religious art style, masterpiece`
- **Negative Prompt:** `realistic, photo, 3d, messy lines, missing lines, blurred`

**Nano Banana**
```text
A beautiful, colorful church stained glass window showing [SUBJECT] with light shining through.
```

---

### 22. Cinematic Macro Photography
Extreme close-ups highlighting imperceptible details.

> *Image Placeholder: Drop your Macro image here!*  
> `![Macro Example](../../assets/placeholder-macro.jpg)`

**DALL-E 3**
```text
Extreme cinematic macro photography of [SUBJECT]. Incredible, hyper-realistic attention to microscopic details like [SPECIFIC DETAIL]. Taken with a 100mm macro lens, featuring intense bokeh in the [ENVIRONMENT] background.
```

**Midjourney**
```text
Extreme macro photography of [SUBJECT], highlighting microscopic details, 100mm macro lens, extreme bokeh, blurred [ENVIRONMENT] background, photorealistic, 8k --ar 16:9 --style raw --v 6.0
```

**Stable Diffusion**
- **Prompt:** `Extreme macro photography, [SUBJECT], hyper detailed close up, 100mm macro lens, extreme bokeh, blurred [ENVIRONMENT], highly detailed, 8k UHD`
- **Negative Prompt:** `wide shot, landscape, blurry subject, low detail, out of focus`

**Nano Banana**
```text
Extreme high detail close-up macro shot of [SUBJECT] with a blurry background.
```
