import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://pokanop.github.io',
  base: '/ai',
  // Every docs page is generated as .mdx (see scripts/sync-docs.mjs). Astro's
  // GFM default (tables, strikethrough, task lists, autolinks) is applied as a
  // parameter default inside the .md-only markdown processor, so it never
  // reaches @astrojs/mdx — which reads config.markdown.gfm directly and finds it
  // unset. The result is GFM tables rendering as literal "| ... |" text on the
  // live site. Setting it explicitly makes remark-gfm run for the .mdx pipeline.
  //
  // Astro warns that markdown.gfm is deprecated in favour of a markdown.processor
  // (`unified({ gfm: true })`), but @astrojs/mdx 5.x does not yet honour that
  // processor option — it only fixes .md files, not the .mdx pages this site is
  // built from (verified: with the processor API the tables still render as raw
  // text). Revisit once a future @astrojs/mdx reads markdown.processor.
  markdown: {
    gfm: true,
  },
  integrations: [
    starlight({
      title: 'AI Prompts & Skills',
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/ai/favicon.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/ai/apple-touch-icon.png' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://pokanop.github.io/ai/assets/og-image.png' } },
        { tag: 'meta', attrs: { property: 'twitter:image', content: 'https://pokanop.github.io/ai/assets/og-image.png' } },
        { tag: 'meta', attrs: { property: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'AI Prompts & Skills' } },
      ],
      logo: {
        src: './src/assets/logo.svg',
        alt: 'AI Prompts Logo',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/pokanop/ai' },
      ],
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'index' },
            { label: 'Platform Guide', slug: 'guides/platform-guide' },
            { label: 'Contributing', slug: 'contributing' },
          ],
        },
        {
          label: 'Image Prompts',
          items: [
            { label: 'Overview & Quick Start', slug: 'prompts/images' },
            {
              label: 'Professional & Persona',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/professional' },
            },
            {
              label: 'Toy & Miniature Worlds',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/toy-miniature' },
            },
            {
              label: 'Animation & Comics',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/animation-comics' },
            },
            {
              label: 'Craft & Materials',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/craft-materials' },
            },
            {
              label: 'Design & Graphic',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/design-graphic' },
            },
            {
              label: 'Retro & Digital',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/retro-digital' },
            },
            {
              label: 'Historical & Cultural Art',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/historical-cultural' },
            },
            {
              label: 'Fine Art & Surreal',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/fine-art-surreal' },
            },
            {
              label: 'Traditional Art & Sketch',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/traditional-art' },
            },
            {
              label: 'Photography & Imaging',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/photography' },
            },
            {
              label: 'Scientific & Technical',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/scientific-technical' },
            },
            {
              label: 'Speculative & Futurism',
              collapsed: true,
              autogenerate: { directory: 'prompts/images/styles/speculative-futurism' },
            },
          ],
        },
        {
          label: 'Video Prompts',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'prompts/videos' },
          ],
        },
        {
          label: 'Audio Prompts',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'prompts/audio' },
          ],
        },
        {
          label: 'Text Prompts',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'prompts/text' },
          ],
        },
        {
          label: 'Agent Skills',
          items: [
            { label: 'Overview & Workflow', slug: 'skills' },
            {
              label: 'Skills',
              collapsed: true,
              autogenerate: { directory: 'skills/docs' },
            },
          ],
        },
      ],
    }),
    react(),
  ],
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
});
