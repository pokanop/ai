#!/usr/bin/env bun
// Offline markdown link checker: verifies that relative links in source .md
// files point at files or directories that exist on disk. External URLs,
// mailto:, anchors, and absolute /ai/ site paths are ignored so CI never
// depends on the network. Dependency-free (fs/path only), like the other
// validation scripts.

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.astro', 'public', 'src']);

function collectMarkdown(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) collectMarkdown(full, out);
    } else if (entry.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

let failures = 0;
for (const file of collectMarkdown(ROOT)) {
  // Strip fenced code blocks and inline code spans so example links inside
  // code aren't treated as real links.
  const text = readFileSync(file, 'utf8')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');
  for (const match of text.matchAll(LINK_RE)) {
    let target = match[1];
    if (/^(https?:|mailto:|#|\/)/i.test(target)) continue;
    target = target.split('#')[0];
    if (!target) continue;
    target = decodeURIComponent(target);
    const resolved = resolve(dirname(file), target);
    if (!existsSync(resolved)) {
      failures++;
      console.error(`Broken link in ${file.slice(ROOT.length + sep.length)}: ${match[1]}`);
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} broken relative link(s) found.`);
  process.exit(1);
}
console.log('All relative markdown links resolve.');
