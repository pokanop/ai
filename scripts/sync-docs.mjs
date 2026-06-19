// sync-docs.mjs - Documentation Site Generator
//
// Transforms raw .md source files into rich .mdx pages for Starlight.
// Run before `astro dev` or `astro build` via package.json scripts.
//
// Content type detection is path-based:
//   prompts/images/styles/*.md  -> image prompt parser
//   prompts/videos/styles/*.md  -> video prompt parser (stub)
//   prompts/audio/styles/*.md   -> audio prompt parser (stub)
//   prompts/text/styles/*.md    -> text prompt parser (stub)
//   skills/[name]/SKILL.md      -> skill wrapper generator
//   README.md                   -> index page generator
//   CONTRIBUTING.md             -> static page

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, statSync, rmSync } from 'fs';
import { join, dirname, basename, relative, resolve } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DOCS_OUT = join(ROOT, 'src', 'content', 'docs');
const PUBLIC_ASSETS = join(ROOT, 'public', 'assets');
const ASSETS_SRC = join(ROOT, 'assets');

// ─── Category mapping for image prompt styles ────────────────────────────
// Maps style filenames to their sidebar category subdirectory
const IMAGE_CATEGORIES = {
  'professional': [
    'cinematic-headshots',
    'professional-headshots',
    'modern-avatars',
  ],
  'toy-miniature': [
    'lego-photography',
    'minecraft-voxel',
    '3d-isometric-resin-sculptures',
    'landmark-dioramas',
    'miniature-people',
    'collectible-figurines',
    'fridge-magnet-knolling',
    'movie-diorama-cube',
  ],
  'animation-comics': [
    'pixar-3d-animation',
    'superhero-comic-book',
    'cell-shaded-art',
    'the-simpsons',
    'studio-ghibli-anime',
  ],
  'craft-materials': [
    'yarn-amigurumi',
    'paper-cutout-kirigami',
    'claymation-stop-motion',
    'embroidered-cross-stitch',
    'wooden-marquetry',
    'frosted-glass-ice-sculpture',
    'cloud-smoke-sculpture',
  ],
  'design-graphic': [
    'minimalist-notion-style',
    'art-deco-illustration',
    'wes-anderson-symmetry',
    'brutalist-architecture',
    'vinyl-album-cover',
    'concert-poster',
    'glass-embossed-3d',
    'exploded-product-view',
    'brand-concept-renders',
  ],
  'retro-digital': [
    'pixelated-16-bit',
    'isometric-pixel-city',
    'cyberpunk-noir',
    'steampunk-contraptions',
    'glitch-art',
    'vaporwave-synthwave',
  ],
  'historical-cultural': [
    'art-nouveau-mucha',
    'byzantine-mosaic',
    'soviet-constructivist',
    'illuminated-manuscript',
    'ukiyo-e-woodblock',
    'dia-de-los-muertos',
    'aboriginal-dot-painting',
    'persian-miniature',
    'kente-ankara-portraits',
  ],
  'fine-art-surreal': [
    'double-exposure',
    'stained-glass-windows',
    'impossible-architecture-escher',
    'food-art-portraiture',
    'bioluminescent-underwater',
  ],
  'traditional-art': [
    'pencil-sketch',
    'watercolor-painting',
    'oil-painting-impasto',
    'charcoal-drawing',
    'colored-pencil',
    'soft-pastel',
  ],
  'photography': [
    'cinematic-macro-photography',
    'long-exposure-light-painting',
    'cyanotype-sun-print',
    'tilt-shift-miniature',
    'daguerreotype-tintype',
    'infrared-thermal',
    'x-ray-imaging',
    'frosted-silhouette',
  ],
  'scientific-technical': [
    'botanical-illustration',
    'blueprint-technical-drawing',
    'electron-microscope',
  ],
  'speculative-futurism': [
    'holographic-ui-sci-fi',
    'solarpunk',
    'retrofuturism-raygun-gothic',
  ],
};

// Invert: filename -> category
const STYLE_TO_CATEGORY = {};
for (const [cat, files] of Object.entries(IMAGE_CATEGORIES)) {
  for (const f of files) {
    STYLE_TO_CATEGORY[f] = cat;
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function findFiles(dir, pattern) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function escapeForJsx(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '&quot;')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\{/g, '&lbrace;')
    .replace(/\}/g, '&rbrace;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeForMdx(content) {
  let fixed = content;
  // Self-close <br> tags
  fixed = fixed.replace(/<br\s*>/gi, '<br />');
  // Self-close <img> tags that aren't already
  fixed = fixed.replace(/<img([^>]*[^/])>/gi, '<img$1 />');
  // Fix relative asset paths in HTML src attributes: src="assets/..." -> src="/ai/assets/..."
  fixed = fixed.replace(/src="assets\//g, 'src="/ai/assets/');
  // Fix relative asset paths in markdown images: (assets/...) -> (/ai/assets/...)
  fixed = fixed.replace(/\]\(assets\//g, '](/ai/assets/');
  // Fix relative asset paths with ../ traversal
  fixed = fixed.replace(/\]\(\.\.\/\.\.\/\.\.\/assets\//g, '](/ai/assets/');
  // Rewrite internal skill links: (skills/skill-name/) -> (/ai/skills/docs/skill-name/)
  fixed = fixed.replace(/\]\(skills\/([a-z0-9-]+)\/\)/g, '](/ai/skills/docs/$1/)');
  // Rewrite prompts/images/README.md -> /ai/prompts/images/
  fixed = fixed.replace(/\]\(prompts\/images\/README\.md\)/g, '](/ai/prompts/images/)');
  // Rewrite prompts/type/ links -> /ai/prompts/type/
  fixed = fixed.replace(/\]\(prompts\/(videos|audio|text)\/\)/g, '](/ai/prompts/$1/)');
  // Rewrite CONTRIBUTING.md -> /ai/contributing/
  fixed = fixed.replace(/\]\(CONTRIBUTING\.md\)/g, '](/ai/contributing/)');
  // Rewrite skills/README.md -> /ai/skills/
  fixed = fixed.replace(/\]\(skills\/README\.md\)/g, '](/ai/skills/)');
  return fixed;
}

// Reference docs are published one page per file at
//   /ai/skills/docs/<skill>/references/<file>/
// and the shared conventions under skills/_shared/references/ are published at
//   /ai/skills/docs/_shared/references/<file>/
// Several relative-link forms point at them in skill docs and must be rewritten,
// or they 404 on the live site (only SKILL.md and these generated reference
// pages exist there — the raw references/*.md sources are never published):
//   ](references/<file>.md)                 same-skill   (uses currentSkill)
//   ](../<skill>/references/<file>.md)      cross-skill  (skill named in the path)
//   ](<file>.md)                            sibling      (only inside a references/ file)
//   ](_shared/references/<file>.md)         shared, from index / top-level
//   ](../_shared/references/<file>.md)      shared, from a SKILL.md
//   ](../../_shared/references/<file>.md)   shared, from a references/*.md file
// An optional #fragment is preserved and re-attached after the trailing slash.
function rewriteReferenceLinks(content, currentSkill, { sibling = false } = {}) {
  let out = content;

  // Shared references live at a fixed route regardless of the current skill, so
  // match any depth of leading ../ (index uses none, a SKILL.md one, a
  // references/*.md file two) and rewrite to the absolute path. Run first: the
  // cross-skill rule's [a-z0-9-]+ skill segment already can't match the leading
  // underscore, but consuming these up front keeps the intent unambiguous.
  out = out.replace(
    /\]\((?:\.\.\/)*_shared\/references\/([a-z0-9-]+)\.md(#[^)]*)?\)/g,
    (_m, file, frag) => `](/ai/skills/docs/_shared/references/${file}/${frag || ''})`,
  );

  // Cross-skill: ](../<skill>/references/<file>.md[#frag])
  out = out.replace(
    /\]\(\.\.\/([a-z0-9-]+)\/references\/([a-z0-9-]+)\.md(#[^)]*)?\)/g,
    (_m, skill, file, frag) => `](/ai/skills/docs/${skill}/references/${file}/${frag || ''})`,
  );

  // Same-skill: ](references/<file>.md[#frag])
  out = out.replace(
    /\]\(references\/([a-z0-9-]+)\.md(#[^)]*)?\)/g,
    (_m, file, frag) => `](/ai/skills/docs/${currentSkill}/references/${file}/${frag || ''})`,
  );

  // Sibling references (a references/*.md file linking to one next to it):
  // ](<file>.md[#frag]) with no slashes. Run last so the slashed forms above
  // are already consumed.
  if (sibling) {
    out = out.replace(
      /\]\(([a-z0-9-]+)\.md(#[^)]*)?\)/g,
      (_m, file, frag) => `](/ai/skills/docs/${currentSkill}/references/${file}/${frag || ''})`,
    );
  }

  return out;
}

// MDX (unlike CommonMark) reads a bare `<` as the start of a JSX tag and `{`
// as a JS expression. Reference docs use `<` as a less-than sign in prose and
// tables ("< 200ms", "<2min", "S=<1hr"), which makes the MDX compiler throw.
// Escape those in ordinary text while leaving fenced code blocks and inline
// code spans alone — there `<placeholder>` samples are meant to render verbatim.
// A `<` that begins a real tag (`<br`, `</li>`, `<!-- -->`) is preserved so the
// existing <br>/<img> handling in escapeForMdx still applies.
function hardenMdxText(content) {
  const lines = content.split('\n');
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence) continue;
    lines[i] = lines[i]
      .split(/(`[^`]*`)/)                                  // keep inline code spans intact
      .map((seg, idx) => (idx % 2 === 1 ? seg : seg
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/<(?![A-Za-z/!])/g, '&lt;')))             // escape `<` unless a tag/comment
      .join('');
  }
  return lines.join('\n');
}

// Title-case a kebab slug for use as a fallback page title.
function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Parsers ──────────────────────────────────────────────────────────────

/**
 * Parse an image prompt .md file into structured data
 */
function parseImagePrompt(content, filePath) {
  const lines = content.split('\n');
  const data = {
    title: '',
    description: '',
    bestFor: [],
    heroImage: '',
    heroImageAlt: '',
    samplePrompt: '',
    platforms: {},     // { platformName: [{ title, useCase, prompt, negativePrompt? }] }
    img2img: {},       // { platformName: { prompt, pipeline?, denoising?, negativePrompt?, refinements? } }
    tips: [],
    relatedStyles: [],
  };

  // Extract title from first heading
  const titleMatch = content.match(/^# (.+)$/m);
  if (titleMatch) data.title = titleMatch[1].trim();

  // Extract description (paragraph after the nav link line)
  const descStartIdx = lines.findIndex(l => l.startsWith('[← Back'));
  if (descStartIdx !== -1) {
    let descLines = [];
    for (let i = descStartIdx + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        if (descLines.length > 0) break;
        continue;
      }
      if (line.startsWith('**Best for:**') || line.startsWith('![') || line.startsWith('#') || line.startsWith('---')) break;
      descLines.push(line);
    }
    data.description = descLines.join(' ');
  }

  // Extract "Best for" line
  const bestForMatch = content.match(/\*\*Best for:\*\*\s*(.+)/);
  if (bestForMatch) {
    data.bestFor = bestForMatch[1].split('·').map(s => s.trim()).filter(Boolean);
  }

  // Extract hero image
  const imgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  if (imgMatch) {
    data.heroImageAlt = imgMatch[1];
    // Convert relative path to /assets/ path
    const imgName = basename(imgMatch[2]);
    data.heroImage = `/ai/assets/${imgName}`;
  }

  // Extract sample prompt (blockquote with code block after image)
  const sampleMatch = content.match(/>\s*\*\*Sample prompt[^*]*\*\*[^`]*```text\n([\s\S]*?)```/);
  if (sampleMatch) {
    // Clean the blockquote markers
    data.samplePrompt = sampleMatch[1]
      .split('\n')
      .map(l => l.replace(/^>\s*/, '').trim())
      .join(' ')
      .trim();
  }

  // Extract platform sections and their prompts
  const platformSections = extractPlatformSections(content, '## Prompt Variations', '## 🔄');
  data.platforms = platformSections;

  // Extract img2img sections
  const img2imgSections = extractImg2ImgSections(content);
  data.img2img = img2imgSections;

  // Extract tips
  const tipsSection = extractSection(content, '## 💡 Tips');
  if (tipsSection) {
    data.tips = extractBulletPoints(tipsSection);
  }

  // Extract related styles from "Pairs well with:" line
  const pairsMatch = content.match(/\*\*Pairs well with:\*\*\s*(.+)/);
  if (pairsMatch) {
    const links = [...pairsMatch[1].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
    data.relatedStyles = links.map(m => ({ name: m[1], slug: basename(m[2], '.md') }));
  }

  return data;
}

function extractPlatformSections(content, startHeading, endHeading) {
  const platforms = {};
  const startIdx = content.indexOf(startHeading);
  if (startIdx === -1) return platforms;

  const endIdx = content.indexOf(endHeading, startIdx);
  const section = endIdx !== -1
    ? content.substring(startIdx, endIdx)
    : content.substring(startIdx);

  // Split by H3 headings (### Platform Name)
  const platformRegex = /### (.*?)(?=\n### |\n## |$)/gs;
  let match;
  while ((match = platformRegex.exec(section)) !== null) {
    const heading = match[1].trim();
    const block = match[0];

    let platformName = heading;
    // Normalize platform names
    if (heading.includes('Nano Banana')) platformName = 'Nano Banana 2';
    else if (heading.includes('ChatGPT')) platformName = 'ChatGPT';
    else if (heading.includes('Midjourney')) platformName = 'Midjourney';
    else if (heading.includes('Stable Diffusion')) platformName = 'Stable Diffusion';

    const variations = extractVariations(block);
    if (variations.length > 0) {
      platforms[platformName] = variations;
    }
  }

  return platforms;
}

function extractVariations(block) {
  const variations = [];

  // Pattern 1: **Variation N — Name** _(Use Case)_ followed by code block
  const varRegex = /\*\*Variation \d+\s*[—–-]\s*([^*]+)\*\*\s*(?:_\(([^)]+)\)_)?\s*\n```(?:text)?\n([\s\S]*?)```/g;
  let match;
  while ((match = varRegex.exec(block)) !== null) {
    const variation = {
      title: match[1].trim(),
      useCase: match[2] ? match[2].trim() : '',
      prompt: match[3].trim(),
    };
    variations.push(variation);
  }

  // Pattern 2: Inline prompts (shorter docs without code blocks)
  if (variations.length === 0) {
    const inlineRegex = /\*\*Variation \d+\s*[—–-]\s*([^*]+)\*\*\s*(?:_\(([^)]+)\)_)?\s*[—–-]\s*(.+)/g;
    while ((match = inlineRegex.exec(block)) !== null) {
      variations.push({
        title: match[1].trim(),
        useCase: match[2] ? match[2].trim() : '',
        prompt: match[3].trim(),
      });
    }
  }

  // Pattern 3: Stable Diffusion style with Prompt/Negative Prompt bullets
  if (variations.length === 0) {
    const sdRegex = /\*\*Variation \d+\s*[—–-]\s*([^*]+)\*\*\s*(?:_\(([^)]+)\)_)?\s*\n-\s*\*\*Prompt:\*\*\s*`([^`]+)`\s*\n-\s*\*\*Negative Prompt:\*\*\s*`([^`]+)`/g;
    while ((match = sdRegex.exec(block)) !== null) {
      variations.push({
        title: match[1].trim(),
        useCase: match[2] ? match[2].trim() : '',
        prompt: match[3].trim(),
        negativePrompt: match[4].trim(),
      });
    }
  }

  return variations;
}

function extractImg2ImgSections(content) {
  const img2img = {};
  const startIdx = content.indexOf('## 🔄');
  if (startIdx === -1) return img2img;

  const endIdx = content.indexOf('\n## ', startIdx + 5);
  const section = endIdx !== -1
    ? content.substring(startIdx, endIdx)
    : content.substring(startIdx);

  // Extract platform blocks within img2img
  const platforms = [
    { name: 'Nano Banana 2', pattern: /\*\*Nano Banana 2\*\*[^`]*```(?:text)?\n([\s\S]*?)```/s },
    { name: 'ChatGPT', pattern: /\*\*ChatGPT\*\*[^`]*```(?:text)?\n([\s\S]*?)```/s },
    { name: 'Midjourney', pattern: /\*\*Midjourney\*\*[^`]*```(?:text)?\n([\s\S]*?)```/s },
    { name: 'Stable Diffusion', pattern: /\*\*Stable Diffusion\*\*[\s\S]*?(?:-\s*\*\*Pipeline:\*\*\s*(.+)\n)?(?:-\s*\*\*Prompt:\*\*\s*`([^`]+)`\n)?(?:-\s*\*\*Negative Prompt:\*\*\s*`([^`]+)`)?/s },
  ];

  for (const { name, pattern } of platforms) {
    const match = section.match(pattern);
    if (match) {
      if (name === 'Stable Diffusion') {
        img2img[name] = {
          pipeline: match[1] ? match[1].trim() : '',
          prompt: match[2] ? match[2].trim() : '',
          negativePrompt: match[3] ? match[3].trim() : '',
        };
      } else {
        img2img[name] = {
          prompt: match[1].trim(),
        };
      }
    }
  }

  // Extract follow-up refinements for NB2
  const refinementsMatch = section.match(/>\s*💡\s*\*\*Follow-up refinements:\*\*([\s\S]*?)(?=\n\*\*|\n---|\n##|$)/);
  if (refinementsMatch && img2img['Nano Banana 2']) {
    const refinements = [...refinementsMatch[1].matchAll(/>\s*-\s*"([^"]+)"/g)].map(m => m[1]);
    img2img['Nano Banana 2'].refinements = refinements;
  }

  return img2img;
}

function extractSection(content, heading) {
  const startIdx = content.indexOf(heading);
  if (startIdx === -1) return null;
  const endIdx = content.indexOf('\n## ', startIdx + heading.length);
  return endIdx !== -1
    ? content.substring(startIdx, endIdx)
    : content.substring(startIdx);
}

function extractBulletPoints(section) {
  return section
    .split('\n')
    .filter(l => l.match(/^-\s+/))
    .map(l => l.replace(/^-\s+/, '').trim());
}

// ─── MDX Generators ──────────────────────────────────────────────────────

function generateImagePromptMdx(data) {
  const lines = [];

  // Frontmatter
  lines.push('---');
  lines.push(`title: "${escapeForJsx(data.title)}"`);
  if (data.description) {
    const desc = data.description.substring(0, 160).replace(/"/g, '\\"');
    lines.push(`description: "${desc}"`);
  }
  if (data.sidebarOrder) {
    lines.push('sidebar:');
    lines.push(`  order: ${data.sidebarOrder}`);
  }
  lines.push('---');
  lines.push('');
  lines.push("import { Tabs, TabItem, Card, LinkCard } from '@astrojs/starlight/components';");
  lines.push("import PromptBlock from '@components/PromptBlock.astro';");
  lines.push("import StyleHero from '@components/StyleHero.astro';");
  lines.push('');

  // Hero section
  lines.push('<StyleHero');
  if (data.heroImage) lines.push(`  image="${data.heroImage}"`);
  if (data.bestFor.length > 0) {
    lines.push(`  bestFor={${JSON.stringify(data.bestFor)}}`);
  }
  if (data.samplePrompt) {
    lines.push(`  samplePrompt="${escapeForJsx(data.samplePrompt)}"`);
  }
  lines.push('/>');
  lines.push('');

  // Platform prompt variations
  const platformOrder = ['Nano Banana 2', 'ChatGPT', 'Midjourney', 'Stable Diffusion'];
  const hasPlatforms = platformOrder.some(p => data.platforms[p]?.length > 0);

  if (hasPlatforms) {
    lines.push('## Prompt Variations');
    lines.push('');
    lines.push('<Tabs>');

    for (const platform of platformOrder) {
      const variations = data.platforms[platform];
      if (!variations || variations.length === 0) continue;

      const icon = platform === 'Nano Banana 2' ? ' icon="star"' : '';
      lines.push(`  <TabItem label="${platform}"${icon}>`);

      for (const v of variations) {
        const useCaseAttr = v.useCase ? ` useCase="${escapeForJsx(v.useCase)}"` : '';
        const negPromptAttr = v.negativePrompt ? ` negativePrompt="${escapeForJsx(v.negativePrompt)}"` : '';
        lines.push(`    <PromptBlock title="${escapeForJsx(v.title)}"${useCaseAttr} prompt="${escapeForJsx(v.prompt)}"${negPromptAttr} platform="${platform}" />`);
      }

      lines.push('  </TabItem>');
    }

    lines.push('</Tabs>');
    lines.push('');
  }

  // Image-to-Image section
  const hasImg2Img = Object.keys(data.img2img).length > 0;
  if (hasImg2Img) {
    lines.push('## Image-to-Image Transformations');
    lines.push('');
    lines.push('<Tabs>');

    for (const platform of platformOrder) {
      const i2i = data.img2img[platform];
      if (!i2i) continue;

      const icon = platform === 'Nano Banana 2' ? ' icon="star"' : '';
      lines.push(`  <TabItem label="${platform}"${icon}>`);

      if (platform === 'Stable Diffusion' && i2i.pipeline) {
        lines.push(`    <PromptBlock prompt="${escapeForJsx(i2i.prompt)}" negativePrompt="${escapeForJsx(i2i.negativePrompt || '')}" platform="${platform}" useCase="${escapeForJsx(i2i.pipeline)}" />`);
      } else {
        lines.push(`    <PromptBlock prompt="${escapeForJsx(i2i.prompt || '')}" platform="${platform}" />`);
      }

      if (i2i.refinements && i2i.refinements.length > 0) {
        lines.push('');
        lines.push('    :::tip[Follow-up refinements]');
        for (const r of i2i.refinements) {
          lines.push(`    - "${r}"`);
        }
        lines.push('    :::');
      }

      lines.push('  </TabItem>');
    }

    lines.push('</Tabs>');
    lines.push('');
  }

  // Tips section
  if (data.tips.length > 0) {
    lines.push('## Tips & Best Practices');
    lines.push('');
    for (let tip of data.tips) {
      // Rewrite internal .md links to Starlight paths
      tip = tip.replace(/\[([^\]]+)\]\(([a-z0-9-]+)\.md\)/g, (match, text, slug) => {
        const cat = STYLE_TO_CATEGORY[slug];
        if (cat) return `[${text}](/ai/prompts/images/styles/${cat}/${slug}/)`;
        return match;
      });
      lines.push(`- ${tip}`);
    }
    lines.push('');
  }

  // Related styles
  if (data.relatedStyles.length > 0) {
    lines.push('## Related Styles');
    lines.push('');
    for (const rs of data.relatedStyles) {
      const category = STYLE_TO_CATEGORY[rs.slug] || 'professional';
      lines.push(`<LinkCard title="${escapeForJsx(rs.name)}" href="/ai/prompts/images/styles/${category}/${rs.slug}/" />`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function generateSkillMdx(content, skillName) {
  // Parse existing frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return null;

  const frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // Extract name and description from YAML frontmatter
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const descMatch = frontmatter.match(/description:\s*>?\s*\n?\s*([\s\S]*?)(?=\n\w|\n---)/);

  const title = nameMatch ? nameMatch[1].trim() : skillName;
  const description = descMatch ? descMatch[1].trim().replace(/\n\s*/g, ' ') : '';

  const lines = [];
  lines.push('---');
  lines.push(`title: "${title}"`);
  if (description) {
    lines.push(`description: "${escapeForJsx(description.substring(0, 160))}"`);
  }
  lines.push('---');
  lines.push('');
  // Pass through the body as-is (it's standard markdown), rewriting links to
  // references/ docs into their published Starlight routes first.
  body = rewriteReferenceLinks(body, skillName);
  lines.push(escapeForMdx(body));

  return lines.join('\n');
}

// Generate an MDX page for a single references/<file>.md. Published at
// /ai/skills/docs/<skillName>/references/<refSlug>/ so the links in SKILL.md
// (and between reference files) resolve on the live site.
function generateReferenceMdx(content, skillName, refSlug) {
  // Title from a leading H1 if present, else a title-cased slug. A leading H1
  // is stripped so it isn't duplicated under Starlight's frontmatter title.
  let title = titleFromSlug(refSlug);
  let body = content;
  const lead = body.match(/^#\s+(.+?)[ \t]*\r?\n/);
  if (lead) {
    title = lead[1].trim();
    body = body.slice(lead[0].length);
  }

  body = rewriteReferenceLinks(body, skillName, { sibling: true });
  body = hardenMdxText(body);
  body = escapeForMdx(body);

  const lines = [];
  lines.push('---');
  lines.push(`title: "${escapeForJsx(title)}"`);
  lines.push('---');
  lines.push('');
  lines.push(body);

  return lines.join('\n');
}

function generateGenericMdx(content, title) {
  const lines = [];
  lines.push('---');
  lines.push(`title: "${escapeForJsx(title)}"`);
  lines.push('---');
  lines.push('');

  // Strip the first heading if it matches the title
  let body = content;
  const headingMatch = body.match(/^# .+\n/);
  if (headingMatch) {
    body = body.substring(headingMatch[0].length);
  }

  // Strip nav links
  body = body.replace(/\[← Back[^\]]*\]\([^)]*\)\s*\n*/g, '');

  // Fix HTML for MDX
  body = escapeForMdx(body);

  lines.push(body);

  return lines.join('\n');
}

function generateCategoryIndexMdx(content, title, allStyles) {
  const lines = [];
  lines.push('---');
  lines.push(`title: "${escapeForJsx(title)}"`);
  lines.push('---');
  lines.push('');
  lines.push("import { CardGrid } from '@astrojs/starlight/components';");
  lines.push("import GalleryCard from '@components/GalleryCard.astro';");
  lines.push('');

  let body = content;

  // Strip first heading
  body = body.replace(/^# .+\n/, '');
  // Strip nav links
  body = body.replace(/\[← Back[^\]]*\]\([^)]*\)\s*\n*/g, '');

  // Find all category markdown tables and replace them with CardGrid components
  body = body.replace(/\| # \| Style \| Description \|\r?\n(?:\|[^\n]*\r?\n?)+/g, (match) => {
    // Extract the style slugs from the table rows
    const slugs = [...match.matchAll(/\]\(styles\/([a-z0-9-]+)\.md\)/g)].map(m => m[1]);
    if (slugs.length === 0) return match;
    
    // We already know the category by checking the first slug
    const category = STYLE_TO_CATEGORY[slugs[0]];
    if (!category) return match;
    
    let gridHtml = '<CardGrid>\n';
    for (const slug of slugs) {
      const style = allStyles?.find(s => s.slug === slug);
      if (!style) continue;
      
      let shortDesc = style.description || '';
      if (shortDesc.length > 100) shortDesc = shortDesc.substring(0, 97) + '...';
      
      let attrs = `title="${escapeForJsx(style.title)}" href="/ai/prompts/images/styles/${category}/${style.slug}/" description="${escapeForJsx(shortDesc)}"`;
      if (style.heroImage) {
        attrs += ` image="${escapeForJsx(style.heroImage)}"`;
      }
      gridHtml += `  <GalleryCard ${attrs} />\n`;
    }
    gridHtml += '</CardGrid>\n\n';
    return gridHtml;
  });

  // Rewrite remaining internal links to .md files to use Starlight slug routing
  body = body.replace(/\(styles\/([^)]+)\.md\)/g, (match, slug) => {
    const category = STYLE_TO_CATEGORY[slug];
    if (category) {
      return `(/ai/prompts/images/styles/${category}/${slug}/)`;
    }
    return match;
  });

  // Fix HTML for MDX
  body = escapeForMdx(body);

  lines.push(body);
  return lines.join('\n');
}

function generatePlaceholderMdx(title, description) {
  return `---
title: "${title}"
---

${description}

:::note
This section is coming soon. Check back for updates!
:::
`;
}

// ─── Main Pipeline ────────────────────────────────────────────────────────

function main() {
  console.log('🔄 sync-docs: Starting documentation sync...');

  // Clean output directory
  if (existsSync(DOCS_OUT)) {
    rmSync(DOCS_OUT, { recursive: true });
  }
  ensureDir(DOCS_OUT);

  // Copy assets to public/
  console.log('  📁 Copying assets to public/assets/...');
  if (existsSync(ASSETS_SRC)) {
    ensureDir(PUBLIC_ASSETS);
    cpSync(ASSETS_SRC, PUBLIC_ASSETS, { recursive: true });
  }

  let pageCount = 0;

  // ── 1. Root pages ────────────────────────────────────────────────────
  console.log('  📄 Generating root pages...');

  // Homepage from README.md
  const readmeContent = readFileSync(join(ROOT, 'README.md'), 'utf-8');
  const homeMdx = generateGenericMdx(readmeContent, 'AI Prompts & Skills');
  writeOut(join(DOCS_OUT, 'index.mdx'), homeMdx);
  pageCount++;

  // Contributing
  const contribContent = readFileSync(join(ROOT, 'CONTRIBUTING.md'), 'utf-8');
  const contribMdx = generateGenericMdx(contribContent, 'Contributing');
  writeOut(join(DOCS_OUT, 'contributing.mdx'), contribMdx);
  pageCount++;

  // Platform Guide (extracted from images README or standalone)
  const imagesReadme = readFileSync(join(ROOT, 'prompts', 'images', 'README.md'), 'utf-8');
  const platformGuideSection = extractSection(imagesReadme, '## Platform Guide');
  if (platformGuideSection) {
    const guideMdx = generateGenericMdx(platformGuideSection, 'Platform Guide');
    ensureDir(join(DOCS_OUT, 'guides'));
    writeOut(join(DOCS_OUT, 'guides', 'platform-guide.mdx'), guideMdx);
    pageCount++;
  }

  // ── 2. Image Prompts ────────────────────────────────────────────────
  console.log('  🖼️  Generating image prompt pages...');

  // Image prompts index moved below

  // Individual style pages
  const stylesDir = join(ROOT, 'prompts', 'images', 'styles');
  const styleFiles = findFiles(stylesDir, /\.md$/);

  const allStyles = [];

  for (const styleFile of styleFiles) {
    const slug = basename(styleFile, '.md');
    const category = STYLE_TO_CATEGORY[slug] || 'uncategorized';
    const content = readFileSync(styleFile, 'utf-8');

    const parsed = parseImagePrompt(content, styleFile);

    allStyles.push({
      slug,
      category,
      title: parsed.title,
      description: parsed.description,
      heroImage: parsed.heroImage
    });

    const categoryArray = IMAGE_CATEGORIES[category] || [];
    const sortOrder = categoryArray.indexOf(slug) + 1;
    if (sortOrder > 0) {
      parsed.sidebarOrder = sortOrder;
    }

    const mdx = generateImagePromptMdx(parsed);

    const outDir = join(DOCS_OUT, 'prompts', 'images', 'styles', category);
    ensureDir(outDir);
    writeOut(join(outDir, `${slug}.mdx`), mdx);
    pageCount++;
  }

  // Image prompts index (Overview page with dynamic gallery injection)
  const imgIndexMdx = generateCategoryIndexMdx(imagesReadme, 'Image Generation Prompts', allStyles);
  ensureDir(join(DOCS_OUT, 'prompts', 'images'));
  writeOut(join(DOCS_OUT, 'prompts', 'images', 'index.mdx'), imgIndexMdx);
  pageCount++;

  // ── 3. Video/Audio/Text Prompt placeholders ─────────────────────────
  console.log('  📋 Generating placeholder sections...');

  for (const [type, title, desc] of [
    ['videos', 'Video Prompts', 'Master prompts for Veo, Runway Gen-3, Pika Labs, Sora, and more. Video prompt styles will be added here with platform-specific variations and motion control techniques.'],
    ['audio', 'Audio Prompts', 'Prompts for music generation, voice synthesis, sound effects, and podcast content. Audio prompt styles will be added here with platform-specific variations for Suno, Udio, ElevenLabs, and more.'],
    ['text', 'Text Prompts', 'Expert prompts for creative writing, technical documentation, marketing copy, and research synthesis. Text prompt templates will be added here with variations for Claude, ChatGPT, Gemini, and Llama.'],
  ]) {
    const dir = join(DOCS_OUT, 'prompts', type);
    ensureDir(dir);

    // Check if a README exists for this type
    const readmePath = join(ROOT, 'prompts', type, 'README.md');
    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      writeOut(join(dir, 'index.mdx'), generateGenericMdx(readmeContent, title));
    } else {
      writeOut(join(dir, 'index.mdx'), generatePlaceholderMdx(title, desc));
    }
    pageCount++;

    // Process any existing style files in this type
    const typeStylesDir = join(ROOT, 'prompts', type, 'styles');
    if (existsSync(typeStylesDir)) {
      const typeStyleFiles = findFiles(typeStylesDir, /\.md$/);
      for (const f of typeStyleFiles) {
        const slug = basename(f, '.md');
        const content = readFileSync(f, 'utf-8');
        const titleMatch = content.match(/^# (.+)$/m);
        const docTitle = titleMatch ? titleMatch[1] : slug;
        const mdx = generateGenericMdx(content, docTitle);
        ensureDir(join(dir, 'styles'));
        writeOut(join(dir, 'styles', `${slug}.mdx`), mdx);
        pageCount++;
      }
    }
  }

  // ── 4. Agent Skills ─────────────────────────────────────────────────
  console.log('  🤖 Generating skill pages...');

  // Skills index (with link rewriting)
  const skillsReadme = readFileSync(join(ROOT, 'skills', 'README.md'), 'utf-8');
  let skillsBody = skillsReadme;
  // Rewrite skill directory links: (create-a-prd/) -> (/ai/skills/docs/create-a-prd/)
  skillsBody = skillsBody.replace(/\]\(([a-z0-9-]+)\/\)/g, '](/ai/skills/docs/$1/)');
  // Rewrite shared-reference links (the index links to _shared/references/*). It
  // sits in no skill, so only the _shared forms apply; null currentSkill is fine
  // because the index has no same-skill/sibling references/ links.
  skillsBody = rewriteReferenceLinks(skillsBody, null);
  const skillsIndexMdx = generateGenericMdx(skillsBody, 'Agent Skills');
  ensureDir(join(DOCS_OUT, 'skills'));
  writeOut(join(DOCS_OUT, 'skills', 'index.mdx'), skillsIndexMdx);
  pageCount++;

  // Individual skill pages
  const skillDirs = readdirSync(join(ROOT, 'skills'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const skillDocsDir = join(DOCS_OUT, 'skills', 'docs');
  ensureDir(skillDocsDir);

  for (const skillName of skillDirs) {
    const skillMdPath = join(ROOT, 'skills', skillName, 'SKILL.md');
    if (!existsSync(skillMdPath)) continue;

    const content = readFileSync(skillMdPath, 'utf-8');
    const mdx = generateSkillMdx(content, skillName);
    if (mdx) {
      writeOut(join(skillDocsDir, `${skillName}.mdx`), mdx);
      pageCount++;
    }

    // Publish a page per references/*.md so links in SKILL.md resolve instead
    // of 404ing. Output: skills/docs/<skill>/references/<file>.mdx
    //   -> route /ai/skills/docs/<skill>/references/<file>/
    const refDir = join(ROOT, 'skills', skillName, 'references');
    if (existsSync(refDir)) {
      for (const refFile of findFiles(refDir, /\.md$/)) {
        const refSlug = basename(refFile, '.md');
        const refContent = readFileSync(refFile, 'utf-8');
        const refMdx = generateReferenceMdx(refContent, skillName, refSlug);
        const outDir = join(skillDocsDir, skillName, 'references');
        ensureDir(outDir);
        writeOut(join(outDir, `${refSlug}.mdx`), refMdx);
        pageCount++;
      }
    }
  }

  // Shared references (skills/_shared/references/*.md). This dir has no SKILL.md
  // so the loop above skips it, but many skills link to its conventions via the
  // _shared/ forms — publish a page per file so those links resolve. Output:
  // skills/docs/_shared/references/<file>.mdx -> /ai/skills/docs/_shared/references/<file>/
  const sharedRefDir = join(ROOT, 'skills', '_shared', 'references');
  if (existsSync(sharedRefDir)) {
    console.log('  📚 Generating shared reference pages...');
    for (const refFile of findFiles(sharedRefDir, /\.md$/)) {
      const refSlug = basename(refFile, '.md');
      const refContent = readFileSync(refFile, 'utf-8');
      const refMdx = generateReferenceMdx(refContent, '_shared', refSlug);
      const outDir = join(skillDocsDir, '_shared', 'references');
      ensureDir(outDir);
      writeOut(join(outDir, `${refSlug}.mdx`), refMdx);
      pageCount++;
    }
  }

  console.log(`✅ sync-docs: Generated ${pageCount} pages in src/content/docs/`);

  // Build-time guard: fail if any unrewritten relative .md link survived in the
  // generated MDX. Such a link 404s on the published site. This runs as part of
  // `bun run build` (and the CI validate job) so a missing rewrite rule breaks
  // the build loudly instead of shipping dead links.
  const brokenLinks = findUnrewrittenMdLinks(DOCS_OUT);
  if (brokenLinks.length > 0) {
    console.error(`\n❌ sync-docs: ${brokenLinks.length} unrewritten relative .md link(s) in generated MDX:`);
    for (const b of brokenLinks) {
      console.error(`   ${b.file}:${b.line}  →  ${b.target}`);
    }
    console.error('\nThese would 404 on the published site. Add a rewrite rule in sync-docs.mjs');
    console.error('(see rewriteReferenceLinks) or point the link at an absolute https:// URL.');
    process.exit(1);
  }
  console.log('🔗 sync-docs: link check passed — no unrewritten relative .md links.');
}

// Scan generated MDX for relative links whose target ends in .md — these never
// resolve on the site (the source .md files are not published). Absolute
// http(s) links ending in .md (e.g. a GitHub source URL) are allowed. Targets
// inside fenced code blocks are skipped: they are literal text, not live links.
function findUnrewrittenMdLinks(dir) {
  const offenders = [];
  for (const file of findFiles(dir, /\.mdx$/)) {
    const lines = readFileSync(file, 'utf-8').split('\n');
    let inFence = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;

      const targets = [];
      // Markdown links: ](target) — target runs up to whitespace or ')'
      for (const m of line.matchAll(/\]\(\s*([^)\s]+)/g)) targets.push(m[1]);
      // HTML attributes: href="target" / src="target"
      for (const m of line.matchAll(/\b(?:href|src)\s*=\s*"([^"]+)"/g)) targets.push(m[1]);

      for (const raw of targets) {
        const path = raw.replace(/[#?].*$/, '');       // drop #fragment / ?query
        if (!/\.md$/i.test(path)) continue;            // not a .md link
        if (/^https?:\/\//i.test(raw)) continue;       // external URL is fine
        offenders.push({ file: relative(DOCS_OUT, file), line: i + 1, target: raw });
      }
    }
  }
  return offenders;
}


function writeOut(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content, 'utf-8');
}

main();
