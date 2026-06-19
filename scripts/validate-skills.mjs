// validate-skills.mjs - SKILL.md spec compliance validator
//
// Enforces the agentskills.io-style contract that AGENTS.md documents but
// nothing checked before. `sync-docs.mjs` silently drops a skill whose
// frontmatter won't parse; this script turns that silent gap into a loud,
// CI-failing error.
//
// For every skills/<name>/SKILL.md it verifies:
//   - the file exists and its YAML frontmatter parses
//   - name: present, matches ^[a-z0-9]+(-[a-z0-9]+)*$, 1-64 chars, and
//     exactly matches the directory name
//   - description: present, 1-1024 chars
//   - (warn) description contains trigger keywords used for skill discovery
//   - (warn) every file under references/ is linked from some skill doc
//   - relative links in skill docs resolve to a file that exists on disk
//
// Exit code is 1 when any ERROR is found (the CI gate). Warnings are reported
// but do not fail the build unless --strict is passed, which promotes every
// warning to an error.
//
// Runtime: run with Bun (`bun run validate`). Uses Bun.YAML for a real YAML
// parse when available, with a dependency-free fallback so it still runs under
// plain Node during local development.

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve, relative } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SKILLS_DIR = join(ROOT, 'skills');

// agentskills.io name rule: lowercase alphanumerics, single hyphens between,
// no leading/trailing/consecutive hyphens.
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NAME_MAX = 64;
const DESC_MIN = 1;
const DESC_MAX = 1024;

const STRICT = process.argv.includes('--strict');

// ─── Collected findings ──────────────────────────────────────────────────
const errors = [];
const warnings = [];

function error(file, msg) {
  errors.push({ file, msg });
}
function warn(file, msg) {
  warnings.push({ file, msg });
}

// ─── Frontmatter parsing ───────────────────────────────────────────────────
// Returns { ok, data?, error? }. `data` is the parsed frontmatter object.
function parseFrontmatter(content, relPath) {
  const m = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n[\s\S]*)?$/);
  if (!m) {
    return { ok: false, error: 'missing or unterminated YAML frontmatter (expected a `---` fenced block at the top of the file)' };
  }
  const block = m[1];

  // Prefer a real YAML parse when running under Bun (the CI runtime).
  const yaml = globalThis.Bun?.YAML;
  if (yaml?.parse) {
    let data;
    try {
      data = yaml.parse(block);
    } catch (e) {
      return { ok: false, error: `frontmatter is not valid YAML: ${String(e?.message || e).replace(/\s+/g, ' ').trim()}` };
    }
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return { ok: false, error: 'frontmatter must be a YAML mapping of key: value pairs' };
    }
    return { ok: true, data };
  }

  // Fallback (plain Node): extract the top-level scalar keys we validate.
  return { ok: true, data: fallbackParse(block) };
}

// Minimal top-level scalar extractor for environments without Bun.YAML.
// Handles `key: value`, quoted scalars, and `>`/`|` block scalars. Nested
// maps and sequences are skipped — we only need name/description/license.
function fallbackParse(block) {
  const lines = block.split(/\r?\n/);
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (/^\s/.test(line)) continue; // nested line; we don't need its value
    const m = line.match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (/^[>|][+-]?$/.test(val)) {
      const folded = val[0] === '>';
      const buf = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        if (lines[j].trim() === '') { buf.push(''); continue; }
        if (/^\s/.test(lines[j])) buf.push(lines[j].replace(/^\s+/, ''));
        else break;
      }
      i = j - 1;
      val = (folded ? buf.join(' ') : buf.join('\n')).trim();
    } else {
      val = unquote(val);
    }
    if (!(key in data)) data[key] = val;
  }
  return data;
}

function unquote(s) {
  if (s.length >= 2 && ((s[0] === '"' && s.endsWith('"')) || (s[0] === "'" && s.endsWith("'")))) {
    return s.slice(1, -1);
  }
  return s;
}

// ─── Link extraction ───────────────────────────────────────────────────────
// Returns markdown link targets that look like local file paths, paired with
// the 1-based line they appear on. External, anchor, and site-absolute links
// are skipped — only relative filesystem links are validated.
function extractFileLinks(content) {
  const out = [];
  const lines = content.split(/\r?\n/);
  const linkRe = /\]\(\s*([^)]+?)\s*\)/g;
  for (let i = 0; i < lines.length; i++) {
    let m;
    linkRe.lastIndex = 0;
    while ((m = linkRe.exec(lines[i])) !== null) {
      const target = cleanLinkTarget(m[1]);
      if (target && isLocalFileLink(target)) {
        out.push({ target, line: i + 1 });
      }
    }
  }
  return out;
}

// Strip an optional markdown title, angle brackets, and any #fragment/?query.
function cleanLinkTarget(raw) {
  let t = raw.trim();
  const titled = t.match(/^(.*?)\s+(?:"[^"]*"|'[^']*'|\([^)]*\))$/);
  if (titled) t = titled[1].trim();
  if (t.startsWith('<') && t.endsWith('>')) t = t.slice(1, -1).trim();
  t = t.replace(/[#?].*$/, '');
  return t.trim();
}

function isLocalFileLink(t) {
  if (!t) return false;
  if (t.startsWith('#')) return false;          // pure anchor
  if (t.startsWith('//')) return false;         // protocol-relative
  if (t.startsWith('/')) return false;          // site-absolute (e.g. /ai/...)
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return false; // has a scheme (http:, mailto:, ...)
  return true;
}

// ─── Skill discovery ─────────────────────────────────────────────────────
function listSkillDirs() {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    // Skip shared / non-skill dirs (e.g. _shared holds cross-skill references,
    // not a SKILL.md). Underscore- and dot-prefixed dirs are not skills.
    .filter((d) => !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();
}

// All .md files under a directory (recursive).
function listMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

// Every file under a skill's references/ directory (recursive).
function listReferenceFiles(skillDir) {
  const refDir = join(skillDir, 'references');
  if (!existsSync(refDir) || !statSync(refDir).isDirectory()) return [];
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) out.push(full);
    }
  };
  walk(refDir);
  return out;
}

// ─── Field checks ──────────────────────────────────────────────────────────
function hasTriggerKeywords(desc) {
  // Skills are matched by keyword on their description. A good description
  // says *when* to reach for the skill — signalled by a "use when" clause or
  // quoted example trigger phrases.
  if (/\buse when\b/i.test(desc)) return true;
  if (/\bwhen the user\b/i.test(desc)) return true;
  if (/(["'])[^"']{3,}\1/.test(desc)) return true; // at least one quoted phrase
  return false;
}

function rel(p) {
  return relative(ROOT, p) || p;
}

// ─── Main ────────────────────────────────────────────────────────────────
function main() {
  if (!existsSync(SKILLS_DIR)) {
    console.error(`✗ skills directory not found at ${rel(SKILLS_DIR)}`);
    process.exit(1);
  }

  const skillDirs = listSkillDirs();
  console.log(`🔍 Validating ${skillDirs.length} skill${skillDirs.length === 1 ? '' : 's'} in ${rel(SKILLS_DIR)}/\n`);

  // First pass: collect every local file link across all skill docs so we can
  // resolve broken links and detect reference files that nothing links to.
  // A reference may be shared across skills (e.g. via ../other-skill/...), so
  // orphan detection must consider links from *every* doc, not just the owner.
  const linkedTargets = new Set();
  const allDocs = listMarkdown(SKILLS_DIR);
  for (const file of allDocs) {
    const content = readFileSync(file, 'utf-8');
    for (const { target, line } of extractFileLinks(content)) {
      const abs = resolve(dirname(file), target);
      if (existsSync(abs)) {
        linkedTargets.add(abs);
      } else {
        error(rel(file), `broken link on line ${line}: "${target}" does not resolve to an existing file`);
      }
    }
  }

  // Second pass: per-skill frontmatter and reference-orphan checks.
  for (const name of skillDirs) {
    const skillDir = join(SKILLS_DIR, name);
    const skillMd = join(skillDir, 'SKILL.md');
    const relMd = rel(skillMd);

    if (!existsSync(skillMd)) {
      error(rel(skillDir), 'missing SKILL.md');
      continue;
    }

    const content = readFileSync(skillMd, 'utf-8');
    const parsed = parseFrontmatter(content, relMd);
    if (!parsed.ok) {
      error(relMd, parsed.error);
      continue;
    }
    const fm = parsed.data;

    // name
    const rawName = fm.name;
    if (rawName === undefined || rawName === null || String(rawName).trim() === '') {
      error(relMd, 'frontmatter is missing a "name" field');
    } else {
      const nm = String(rawName).trim();
      if (nm.length > NAME_MAX) {
        error(relMd, `name "${nm}" is ${nm.length} chars; must be 1-${NAME_MAX}`);
      }
      if (!NAME_RE.test(nm)) {
        error(relMd, `name "${nm}" must match ${NAME_RE.source} (lowercase letters/digits, single hyphens, no leading/trailing/consecutive hyphens)`);
      } else if (nm !== name) {
        error(relMd, `name "${nm}" does not match its directory name "${name}" (the sync script and agentskills.io spec require them to match)`);
      }
    }

    // description
    const rawDesc = fm.description;
    if (rawDesc === undefined || rawDesc === null || String(rawDesc).trim() === '') {
      error(relMd, 'frontmatter is missing a "description" field');
    } else {
      const desc = String(rawDesc).trim();
      if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
        error(relMd, `description is ${desc.length} chars; must be ${DESC_MIN}-${DESC_MAX}`);
      }
      if (!hasTriggerKeywords(desc)) {
        warn(relMd, 'description has no obvious trigger keywords (a "use when …" clause or quoted example phrases); skills are discovered by keyword matching');
      }
    }

    // orphaned reference files
    for (const refFile of listReferenceFiles(skillDir)) {
      if (!linkedTargets.has(resolve(refFile))) {
        warn(rel(refFile), 'reference file is not linked from any skill doc (orphaned)');
      }
    }
  }

  report();
}

function report() {
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All skills pass spec validation.');
    process.exit(0);
  }

  for (const w of warnings) {
    console.log(`  ⚠ WARN   ${w.file}: ${w.msg}`);
  }
  for (const e of errors) {
    console.log(`  ✗ ERROR  ${e.file}: ${e.msg}`);
  }

  const failing = errors.length + (STRICT ? warnings.length : 0);
  console.log(
    `\n${failing > 0 ? '❌' : '⚠️ '} ${errors.length} error${errors.length === 1 ? '' : 's'}, ` +
    `${warnings.length} warning${warnings.length === 1 ? '' : 's'}` +
    `${STRICT ? ' (--strict: warnings fail too)' : ''}.`
  );

  process.exit(failing > 0 ? 1 : 0);
}

main();
