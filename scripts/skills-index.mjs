// skills-index.mjs - Single source of truth for the machine-readable skill catalog.
//
// Discovery used to rely on the hand-maintained markdown table in
// skills/README.md, which drifts the moment a skill is added, renamed, or its
// description changes. This module derives the catalog directly from each
// skills/<name>/SKILL.md frontmatter so it cannot drift:
//
//   - sync-docs.mjs   calls buildSkillsIndex() + serializeIndex() to WRITE
//                     skills/index.json during the build.
//   - validate-skills.mjs calls the same two functions to CHECK that the
//                     committed skills/index.json still matches the skills on
//                     disk, and fails CI if it does not.
//
// Because both the writer and the checker compute the catalog the same way
// here, the file on disk can only be correct or provably stale — never subtly
// wrong. The serialization is deterministic (sorted by name, fixed key order,
// no timestamps) so the checked-in file is byte-for-byte reproducible.
//
// Dependency-free: standard fs/path plus Bun.YAML when available (the build and
// CI runtime), with a small fallback so it still runs under plain Node.

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SKILLS_DIR = join(ROOT, 'skills');

// Where the generated catalog lives, and its repo-relative label for messages.
export const INDEX_PATH = join(SKILLS_DIR, 'index.json');
export const INDEX_REL = 'skills/index.json';

// Bumped only when the *shape* of index.json changes, so a consumer can detect
// an incompatible format. It is not a per-skill version.
const SCHEMA_VERSION = 1;

// ─── Skill discovery ─────────────────────────────────────────────────────
// The directories under skills/ that are real skills (carry a SKILL.md).
// Underscore- and dot-prefixed dirs (e.g. _shared) hold cross-skill material,
// not a skill. Sorted so the output order is stable. This is the single
// enumeration both the validator and the index builder rely on.
export function listSkillDirs() {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .filter((d) => !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .filter((name) => existsSync(join(SKILLS_DIR, name, 'SKILL.md')))
    .sort();
}

// ─── Frontmatter parsing ───────────────────────────────────────────────────
// Returns the parsed frontmatter mapping, or null when the file has no valid
// `---` fenced block. Prefers a real YAML parse under Bun (the CI/build
// runtime) and falls back to a minimal scalar extractor under plain Node.
function parseFrontmatter(content) {
  const m = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n[\s\S]*)?$/);
  if (!m) return null;
  const block = m[1];

  const yaml = globalThis.Bun?.YAML;
  if (yaml?.parse) {
    try {
      const data = yaml.parse(block);
      if (data && typeof data === 'object' && !Array.isArray(data)) return data;
    } catch {
      return null;
    }
    return null;
  }
  return fallbackParse(block);
}

// Minimal frontmatter parser for environments without Bun.YAML. Handles the
// top-level scalars we need (name, description) plus the one nested value the
// catalog reads — metadata.version. For the simple, single-line frontmatter
// these skills use, it produces the same result as the YAML parser above.
function fallbackParse(block) {
  const lines = block.split(/\r?\n/);
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) continue; // nested line; handled via its parent below
    const m = line.match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (!m) continue;
    const key = m[1];
    const rest = m[2].trim();

    // A mapping (`metadata:` with indented children) — capture its scalars.
    if (rest === '') {
      const child = {};
      let j = i + 1;
      for (; j < lines.length; j++) {
        if (lines[j].trim() === '') continue;
        if (!/^\s/.test(lines[j])) break; // dedent ends the block
        const cm = lines[j].match(/^\s+([A-Za-z0-9_-]+):(.*)$/);
        if (cm) child[cm[1]] = unquote(cm[2].trim());
      }
      i = j - 1;
      if (!(key in data)) data[key] = child;
      continue;
    }

    if (!(key in data)) data[key] = unquote(rest);
  }
  return data;
}

function unquote(s) {
  if (s.length >= 2 && ((s[0] === '"' && s.endsWith('"')) || (s[0] === "'" && s.endsWith("'")))) {
    return s.slice(1, -1);
  }
  return s;
}

// ─── Field extraction ──────────────────────────────────────────────────────
// Collapse internal whitespace so the catalog stores a single clean line even
// if a SKILL.md used a folded/multi-line description.
function normalizeDescription(desc) {
  return String(desc).replace(/\s+/g, ' ').trim();
}

// Skills are discovered by keyword-matching their description, and the quoted
// example phrases in it ("review this code", "do a code review", …) are the
// trigger phrases a caller is likely to say. Pull them out, in order, deduped,
// so the catalog carries them as a structured, queryable field. Returns [] when
// the description has no quoted phrases.
export function extractTriggers(desc) {
  const out = [];
  const seen = new Set();
  for (const m of String(desc).matchAll(/"([^"]+)"/g)) {
    const phrase = m[1].trim();
    if (phrase && !seen.has(phrase)) {
      seen.add(phrase);
      out.push(phrase);
    }
  }
  return out;
}

// Build one catalog entry from a skill's SKILL.md. The key order here is the
// serialized key order, so keep it stable: name, description, path, version,
// triggers. `version` comes from metadata.version and is null when unset.
function buildSkillEntry(name) {
  const content = readFileSync(join(SKILLS_DIR, name, 'SKILL.md'), 'utf-8');
  const fm = parseFrontmatter(content) || {};
  const description = fm.description ? normalizeDescription(fm.description) : '';
  const version = fm.metadata && fm.metadata.version != null ? String(fm.metadata.version) : null;
  return {
    name: fm.name ? String(fm.name).trim() : name,
    description,
    path: `skills/${name}`,
    version,
    triggers: extractTriggers(description),
  };
}

// ─── Index assembly ────────────────────────────────────────────────────────
// The full catalog object. Deterministic: skills are sorted by directory name
// and the wrapper carries no timestamp, so the serialized form is reproducible
// and safe to commit + diff in CI.
export function buildSkillsIndex() {
  return {
    $comment:
      'Auto-generated by scripts/sync-docs.mjs from each skills/<name>/SKILL.md frontmatter. ' +
      'Do not edit by hand — run `bun run sync`. Drift from the skills/ directory is caught in ' +
      'CI by scripts/validate-skills.mjs (`bun run validate`).',
    schemaVersion: SCHEMA_VERSION,
    skills: listSkillDirs().map(buildSkillEntry),
  };
}

// Canonical serialization: 2-space indent, trailing newline. Both the writer
// and the checker must use this so the on-disk file compares exactly.
export function serializeIndex(index) {
  return JSON.stringify(index, null, 2) + '\n';
}
