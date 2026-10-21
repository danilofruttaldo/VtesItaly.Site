/* Internal link checker on the built site (dist/), no server needed.
 *
 * Every href/src/srcset (plus data-src, data-reveal-src, data-real-image:
 * lazy and stage cover images) in every HTML file, plus absolute URLs on the
 * site origin (og:image, canonical, hreflang), is resolved the way Apache would
 * serve it from public_html:
 *
 * - `/path/`          needs dist/path/index.html
 * - `/file.ext`       needs dist/file.ext
 * - `/path` (no ext)  works only through a 301 to `/path/` (mod_dir), so it
 *                     is reported: the canonical form has the trailing slash
 *                     and the extra hop costs a round trip on every click.
 *
 * Fragments (`#id`) pointing at a page are checked against its ids and
 * reported as warnings only: some anchors are created by scripts at runtime.
 *
 * External links are not checked here: they fail for reasons unrelated to
 * the commit (rate limits, outages) and would make the gate flaky.
 *
 * Accepted broken targets go in KNOWN with the reason, like
 * scripts/check-pages.mjs; entries that no longer match anything fail.
 *
 * Usage: node scripts/check-links.mjs [--list]
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { URL } from 'node:url';

const DIST = 'dist';
const SITE = 'https://vtesitaly.com';
const ORIGIN = new URL(SITE).origin;

/* Accepted cases by category, keyed by the target path. Empty on purpose. */
const KNOWN = {};

const showList = process.argv.includes('--list');

if (!existsSync(DIST)) {
  console.error(`${DIST}/ not found: run \`npm run build\` first.`);
  process.exit(2);
}

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) files.push(p);
  }
})(DIST);

const toUrlPath = (file) => {
  const rel = '/' + relative(DIST, file).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};

const decode = (s) =>
  s.replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&#x27;', "'").replaceAll('&amp;', '&');

const isFile = (p) => existsSync(p) && statSync(p).isFile();

/* Resolve a decoded URL path to a dist file, or explain why it fails. */
function resolve(pathname) {
  const target = join(DIST, ...pathname.split('/').filter(Boolean));
  if (pathname.endsWith('/')) {
    const index = join(target, 'index.html');
    return isFile(index) ? { file: index } : { problem: 'broken link' };
  }
  if (isFile(target)) return { file: target };
  if (isFile(join(target, 'index.html'))) return { problem: 'link without trailing slash (301 on Apache)' };
  return { problem: 'broken link' };
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\s(?:id|name)=["']([^"']+)["']/g)].map((m) => decode(m[1]))));
  }
  return idCache.get(file);
}

const errors = [];
const known = [];
const warnings = [];
const used = new Set();
let checked = 0;

function flag(category, from, target) {
  const row = { category, from, target };
  if (KNOWN[category]?.includes(target)) {
    known.push(row);
    used.add(`${category}|${target}`);
  } else errors.push(row);
}

const ATTR_RE =
  /\s(href|src|srcset|content|poster|data-src|data-reveal-src|data-real-image)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

for (const file of files) {
  const html = readFileSync(file, 'utf8')
    // Script bodies and JSON-LD contain strings that look like URLs but are
    // not links (templates, regexes, schema.org ids).
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');
  const page = toUrlPath(file);
  const base = new URL(page, SITE);

  for (const tag of html.match(/<[a-z][a-z0-9-]*\s[^>]*>/gi) || []) {
    const name = tag.slice(1).split(/\s/)[0].toLowerCase();
    for (const m of tag.matchAll(ATTR_RE)) {
      const kind = m[1].toLowerCase();
      const raw = decode(m[2] ?? m[3] ?? '').trim();
      if (!raw) continue;
      // `content` is a URL only on og/twitter image and url metas.
      if (kind === 'content' && !(name === 'meta' && /^https?:\/\//.test(raw))) continue;
      const candidates = kind === 'srcset' ? raw.split(',').map((c) => c.trim().split(/\s+/)[0]) : [raw];
      for (const c of candidates) {
        if (!c || /^(mailto:|tel:|javascript:|data:|blob:|#$)/i.test(c)) continue;
        let u;
        try {
          u = new URL(c, base);
        } catch {
          flag('malformed URL', page, c);
          continue;
        }
        if (u.origin !== ORIGIN) continue;
        let pathname;
        try {
          pathname = decodeURIComponent(u.pathname);
        } catch {
          flag('malformed URL', page, c);
          continue;
        }
        checked++;
        const r = resolve(pathname);
        if (r.problem) {
          flag(r.problem, page, u.pathname);
          continue;
        }
        if (u.hash && u.hash.length > 1 && r.file.endsWith('.html')) {
          const id = decodeURIComponent(u.hash.slice(1));
          if (!idsOf(r.file).has(id)) warnings.push({ category: 'fragment not found', from: page, target: c });
        }
      }
    }
  }
}

console.log(`${files.length} HTML files scanned, ${checked} internal references checked`);

function grouped(rows) {
  const out = {};
  for (const r of rows) (out[r.category] ||= []).push(r);
  return Object.entries(out).sort((a, b) => b[1].length - a[1].length);
}

function print(rows, limit) {
  for (const [c, list] of grouped(rows)) {
    // Many pages usually share one bad link (a layout): group by target.
    const byTarget = {};
    for (const r of list) (byTarget[r.target] ||= []).push(r.from);
    const targets = Object.entries(byTarget).sort((a, b) => b[1].length - a[1].length);
    console.log(`\n  ${c} (${list.length} references, ${targets.length} targets)`);
    for (const [t, froms] of targets.slice(0, limit))
      console.log(`    ${t}  from ${froms.length} page(s), e.g. ${froms[0]}`);
    if (targets.length > limit) console.log(`    ... and ${targets.length - limit} more targets`);
  }
}

if (warnings.length) {
  console.log(`\n${warnings.length} warnings (not blocking):`);
  print(warnings, showList ? Infinity : 5);
}

if (known.length) console.log(`\n${known.length} known cases, accepted and listed in scripts/check-links.mjs`);

const expired = Object.entries(KNOWN).flatMap(([category, list]) =>
  list.filter((t) => !used.has(`${category}|${t}`)).map((t) => ({ category, t })),
);
if (expired.length) {
  console.log(`\n${expired.length} expired exceptions in KNOWN, remove them:`);
  for (const e of expired) console.log(`    ${e.category}: ${e.t}`);
}

if (errors.length) {
  console.log(`\n${errors.length} defects to fix:`);
  print(errors, showList ? Infinity : 10);
}

if (errors.length || expired.length) process.exit(1);
console.log('\nNo broken internal links.');
