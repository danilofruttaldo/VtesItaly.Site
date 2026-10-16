/* Site-wide checks on every page of the built site (dist/).
 *
 * Lighthouse looks at eight URLs and the integration smoke at a handful of
 * files. This walks all of them, because the defects that matter here are
 * systematic: they come from a layout, a component or a content template,
 * and they show up on dozens of pages at once.
 *
 * Three outcomes, and the difference matters:
 *
 * - ERRORS block. A defect on a page that is not listed in KNOWN below.
 *
 * - KNOWN do not block, but are listed below one page at a time, each with
 *   the reason it is accepted. A new page that falls into the same category
 *   still fails, because it is not in the list: without a named list, debt
 *   piles up silently and a year later nobody knows which cases were a
 *   decision and which slipped through.
 *
 * - EXPIRED entries in KNOWN that no page matches any more (fixed, renamed
 *   or removed). They block too: an exception that lingers would silently
 *   cover the next page that falls into it.
 *
 * WARNINGS (title length, description length) are printed but never block.
 *
 * Usage:
 *   node scripts/check-pages.mjs            # on dist/
 *   node scripts/check-pages.mjs --list     # also print every known case and warning
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';
const SITE = 'https://vtesitaly.com';
const MAX_TITLE = 60;
const MIN_DESCRIPTION = 50;
const MAX_DESCRIPTION = 160;
const EM_DASH = String.fromCharCode(0x2014);

/* Accepted cases, with the reason. Adding a line here is a decision, not a
 * shortcut to get the build green: fix the template first. */
const KNOWN = {
  // Empty on purpose. Format: 'category as printed below': ['/url/path/', ...],
  // with a comment saying why each page is accepted. Example:
  //   // The error page declares noindex instead of a canonical.
  //   'missing canonical': ['/404.html'],
};

const showList = process.argv.includes('--list');

if (!existsSync(DIST)) {
  console.error(`${DIST}/ not found: run \`npm run build\` first.`);
  process.exit(2);
}

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Pagefind's UI fragments are not pages.
      if (p === join(DIST, 'pagefind')) continue;
      walk(p);
    } else if (entry.name.endsWith('.html')) pages.push(p);
  }
})(DIST);

const toUrlPath = (file) => {
  const rel = '/' + relative(DIST, file).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};

/* Would Apache serve this site URL from dist/? Directory URLs map to their
 * index.html; anything else must be a real file. */
function existsInDist(href) {
  if (!href.startsWith(SITE + '/') && href !== SITE) return false;
  let path = href.slice(SITE.length).split(/[?#]/)[0] || '/';
  try {
    path = decodeURIComponent(path);
  } catch {
    return false;
  }
  const target = join(DIST, ...path.split('/').filter(Boolean));
  if (path.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) && statSync(target).isFile();
}

const decode = (s) =>
  s
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decode(m[1] ?? m[2] ?? m[3]) : null;
};

const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

const errors = [];
const known = [];
const warnings = [];
const used = new Set();
let redirects = 0;
let cspWithHashes = 0;
let cspUnsafeInline = 0;

function flag(category, url, detail = '') {
  const row = { category, url, detail };
  if (KNOWN[category]?.includes(url)) {
    known.push(row);
    used.add(`${category}|${url}`);
  } else errors.push(row);
}

const warn = (category, url, detail = '') => warnings.push({ category, url, detail });

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  // Astro's `redirects` emit a meta-refresh stub, not a page.
  if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) {
    redirects++;
    continue;
  }
  const url = toUrlPath(file);

  // The site's own typography rule: never the em dash, anywhere in the HTML
  // (visible text, attributes, JSON-LD).
  const dashes = html.split(EM_DASH).length - 1;
  if (dashes > 0) {
    const i = html.indexOf(EM_DASH);
    const around = html
      .slice(Math.max(0, i - 40), i + 40)
      .replace(/\s+/g, ' ')
      .trim();
    flag('em dash (U+2014) in HTML', url, `${dashes}x, e.g. "${around}"`);
  }

  if (!/<html[^>]*\slang=/i.test(html)) flag('missing lang on <html>', url);

  const title = decode((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '').trim();
  if (!title) flag('missing title', url);
  else if (title.length > MAX_TITLE) warn(`title over ${MAX_TITLE} characters`, url, `${title.length}`);

  const descTag = (html.match(/<meta[^>]+name=["']description["'][^>]*>/i) || [])[0];
  const desc = descTag ? (attr(descTag, 'content') || '').trim() : '';
  if (!desc) flag('missing description', url);
  else if (desc.length < MIN_DESCRIPTION || desc.length > MAX_DESCRIPTION)
    warn(`description outside ${MIN_DESCRIPTION}-${MAX_DESCRIPTION} characters`, url, `${desc.length}`);

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1) flag('not exactly one h1', url, `${h1} found`);

  const links = (html.match(/<link\s[^>]*>/gi) || []).map((tag) => ({
    rel: (attr(tag, 'rel') || '').toLowerCase(),
    href: attr(tag, 'href') || '',
    hreflang: attr(tag, 'hreflang'),
  }));

  // Pages that ask not to be indexed (the 404s, archive pages after the first)
  // must declare neither a canonical nor alternates: the two signals contradict
  // each other. For them the rule is reversed.
  const robotsTag = (html.match(/<meta\s[^>]*name=["']robots["'][^>]*>/i) || [])[0];
  const noindex = robotsTag ? /noindex/i.test(attr(robotsTag, 'content') || '') : false;
  const canonical = links.find((l) => l.rel === 'canonical');
  const hasAlternates = links.some((l) => l.rel === 'alternate' && l.hreflang);
  if (noindex) {
    if (canonical) flag('noindex page with a canonical', url, canonical.href);
    if (hasAlternates) flag('noindex page with hreflang alternates', url);
  } else if (!canonical) flag('missing canonical', url);
  else {
    const path = canonical.href.startsWith(SITE) ? canonical.href.slice(SITE.length) || '/' : null;
    if (path === null) flag('canonical not on the site origin', url, canonical.href);
    else if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path))
      flag('canonical without trailing slash', url, canonical.href);
    else if (!existsInDist(canonical.href)) flag('canonical points to a missing page', url, canonical.href);
  }

  const alternates = links.filter((l) => l.rel === 'alternate' && l.hreflang);
  if (noindex) {
    // Already checked above.
  } else if (alternates.length === 0) flag('missing hreflang alternates', url);
  else {
    const broken = alternates.filter((a) => !existsInDist(a.href));
    if (broken.length) flag('hreflang points to a missing page', url, broken.map((b) => b.href).join(' '));
    const it = alternates.find((a) => a.hreflang === 'it');
    const xDefault = alternates.find((a) => a.hreflang === 'x-default');
    if (!xDefault) flag('missing x-default', url);
    else if (!it) flag('x-default without an it alternate', url, xDefault.href);
    else if (xDefault.href !== it.href) flag('x-default not pointing to the IT version', url, xDefault.href);
  }

  // Images: a missing alt is a defect; alt="" (or a bare `alt`, as Astro's
  // <Image> serialises it) is a valid choice that marks the image decorative.
  const imgs = html.match(/<img\s[^>]*>/gi) || [];
  const noAlt = imgs.filter((i) => !/\salt(?=[\s=/>])/i.test(i));
  if (noAlt.length) flag('img without alt', url, `${noAlt.length}x, e.g. ${attr(noAlt[0], 'src')}`);

  // CSP: when the policy carries script hashes (Astro `security.csp`), every
  // inline executable script must match one, or the browser blocks it.
  const cspTag = (html.match(/<meta[^>]+http-equiv=["']?content-security-policy["']?[^>]*>/i) || [])[0];
  const csp = cspTag ? attr(cspTag, 'content') || '' : '';
  const scriptSrc = (csp.match(/(?:^|;)\s*script-src\s+([^;]*)/i) || [])[1] || '';
  const hashes = new Set([...scriptSrc.matchAll(/'sha256-([^']+)'/g)].map((m) => m[1]));
  if (hashes.size) {
    cspWithHashes++;
    const missing = [];
    for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
      const attrs = m[1] || '';
      if (/\ssrc\s*=/i.test(attrs)) continue;
      const type = (attr(`<x${attrs}>`, 'type') || '').toLowerCase();
      if (!EXECUTABLE_TYPES.has(type)) continue;
      const digest = createHash('sha256').update(m[2], 'utf8').digest('base64');
      if (!hashes.has(digest)) missing.push(digest);
    }
    if (missing.length)
      flag('inline script without a CSP sha256', url, `${missing.length}x, e.g. sha256-${missing[0]}`);
  } else if (/'unsafe-inline'/.test(scriptSrc)) cspUnsafeInline++;
}

const real = pages.length - redirects;
console.log(`${real} pages checked (plus ${redirects} redirect stubs, skipped)`);
if (cspWithHashes)
  console.log(`CSP: ${cspWithHashes} pages carry script hashes, inline scripts verified against them.`);
if (cspUnsafeInline)
  console.log(
    `CSP: ${cspUnsafeInline} pages still allow script 'unsafe-inline' with no hashes: inline script check skipped.`,
  );

function grouped(rows) {
  const out = {};
  for (const r of rows) (out[r.category] ||= []).push(r);
  return Object.entries(out).sort((a, b) => b[1].length - a[1].length);
}

if (warnings.length) {
  console.log(`\n${warnings.length} warnings (not blocking):`);
  for (const [c, rows] of grouped(warnings)) {
    console.log(`  ${String(rows.length).padStart(3)}  ${c}`);
    if (showList) for (const r of rows) console.log(`       ${r.url}  (${r.detail})`);
  }
}

if (known.length) {
  console.log(`\n${known.length} known cases, accepted and listed in scripts/check-pages.mjs:`);
  for (const [c, rows] of grouped(known)) {
    console.log(`  ${String(rows.length).padStart(3)}  ${c}`);
    if (showList) for (const r of rows) console.log(`       ${r.url}`);
  }
}

const expired = Object.entries(KNOWN).flatMap(([category, list]) =>
  list.filter((u) => !used.has(`${category}|${u}`)).map((u) => ({ category, u })),
);
if (expired.length) {
  console.log(`\n${expired.length} expired exceptions in KNOWN: no page matches them any more, remove them:`);
  for (const e of expired) console.log(`    ${e.category}: ${e.u}`);
}

if (errors.length) {
  console.log(`\n${errors.length} defects to fix:`);
  for (const [c, rows] of grouped(errors)) {
    console.log(`\n  ${c} (${rows.length})`);
    for (const r of rows.slice(0, 8)) console.log(`    ${r.url}${r.detail ? '  (' + r.detail + ')' : ''}`);
    if (rows.length > 8) console.log(`    ... and ${rows.length - 8} more`);
  }
  console.log(
    '\nIf one of these cases is fine as it is, add it to KNOWN in scripts/check-pages.mjs' +
      '\nwith the reason. Do not loosen the checks.',
  );
}

if (errors.length || expired.length) process.exit(1);
console.log('\nNo new defects.');
