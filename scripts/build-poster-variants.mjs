/* Generates downscaled width variants `<name>-<w>w.webp` for every poster image
 * referenced by a `poster:` field in `src/content/blog/*.md`, so the event
 * pages can ship a `srcset` sized to the ~360 px display slot instead of the
 * full 600–1600 px source (often 100–280 KB). Pairs with `responsiveImage()`
 * in `src/utils/image.ts`, which emits `srcset` only for the variants that
 * actually exist, so a missing variant degrades to the plain `<img>`.
 *
 * Every poster, and every `featuredImage:` (the og:image fallback when a post
 * has no poster), also gets `<name>-og.jpg`: a JPEG at most 1200 px wide that
 * `ogImage()` in `src/utils/og.ts` uses as og:image. Some link previewers
 * (WhatsApp, older Facebook crawlers) still skip WebP; JPEG is read everywhere.
 *
 * Page hero headers (`public/images/headers/*.webp`, 1920 px wide) get
 * `<name>-768w.webp` and `<name>-1280w.webp` the same way: `PageHero` lists
 * them in a width `srcset`, so a phone no longer downloads the 1920 px banner.
 *
 * Source of truth is the content itself (the frontmatter), so adding an event
 * needs no edit here: its poster is picked up automatically. Only poster and
 * featured images are touched: gallery/header art used elsewhere is left alone.
 *
 * Generated files are git-ignored and rebuilt by `prebuild` (locally and in
 * CI): no derivative binaries are committed. Re-run is idempotent (a variant
 * is regenerated only when the source is newer, by mtime) and never upscales
 * (widths >= the source width are skipped), so the source stays the top srcset
 * candidate.
 */
import sharp from 'sharp';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const WIDTHS = [400, 800, 1200];
const HERO_WIDTHS = [768, 1280];
const HEADERS_DIR = 'public/images/headers';
const OG_WIDTH = 1200;
const CONTENT_DIR = 'src/content/blog';
const PUBLIC_DIR = 'public';

/** Unique WebP paths of one frontmatter field across all blog markdown files. */
function collectField(field) {
  const found = new Set();
  const re = new RegExp(`^${field}:\\s*['"]?([^'"\\n]+?)['"]?\\s*$`, 'm');
  for (const name of readdirSync(CONTENT_DIR)) {
    if (!name.endsWith('.md')) continue;
    const text = readFileSync(join(CONTENT_DIR, name), 'utf8');
    const m = text.match(re);
    if (m && /\.webp$/i.test(m[1])) found.add(m[1].trim());
  }
  return [...found];
}

/** True when `out` is missing or older than the source. */
function isStale(out, srcStat) {
  try {
    return statSync(out).mtimeMs < srcStat.mtimeMs;
  } catch {
    return true;
  }
}

const posters = collectField('poster');
const ogSources = new Set([...posters, ...collectField('featuredImage')]);

let generated = 0;
let skipped = 0;
let missing = 0;

for (const poster of posters) {
  const srcFile = resolve(PUBLIC_DIR, poster.replace(/^\//, ''));
  let srcStat;
  try {
    srcStat = statSync(srcFile);
  } catch {
    missing++;
    console.warn(`  poster source not found: ${poster}`);
    continue;
  }
  const srcWidth = (await sharp(srcFile).metadata()).width ?? 0;
  const base = srcFile.replace(/\.webp$/i, '');
  for (const w of WIDTHS) {
    if (w >= srcWidth) continue; // never upscale; source stays the largest candidate
    const out = `${base}-${w}w.webp`;
    if (!isStale(out, srcStat)) {
      skipped++;
      continue;
    }
    await sharp(srcFile).resize(w).webp({ quality: 80, effort: 6 }).toFile(out);
    generated++;
  }
}

// og:image in JPEG. Never upscaled; transparency flattened on white, since
// JPEG has no alpha channel.
for (const image of ogSources) {
  const srcFile = resolve(PUBLIC_DIR, image.replace(/^\//, ''));
  let srcStat;
  try {
    srcStat = statSync(srcFile);
  } catch {
    // A missing poster has already been reported above.
    if (!posters.includes(image)) {
      missing++;
      console.warn(`  featured image not found: ${image}`);
    }
    continue;
  }
  const out = srcFile.replace(/\.webp$/i, '-og.jpg');
  if (!isStale(out, srcStat)) {
    skipped++;
    continue;
  }
  await sharp(srcFile)
    .resize({ width: OG_WIDTH, withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  generated++;
}

// Hero header width variants
for (const name of readdirSync(HEADERS_DIR)) {
  if (!/\.webp$/i.test(name) || /-(thumb|2x|\d+w)\.webp$/i.test(name)) continue;
  const srcFile = join(HEADERS_DIR, name);
  const srcStat = statSync(srcFile);
  const srcWidth = (await sharp(srcFile).metadata()).width ?? 0;
  for (const w of HERO_WIDTHS) {
    if (w >= srcWidth) continue;
    const out = srcFile.replace(/\.webp$/i, `-${w}w.webp`);
    if (!isStale(out, srcStat)) {
      skipped++;
      continue;
    }
    await sharp(srcFile).resize(w).webp({ quality: 78, effort: 6 }).toFile(out);
    generated++;
  }
}

console.log(
  `poster variants: ${generated} generated, ${skipped} up to date${missing ? `, ${missing} source(s) missing` : ''}`,
);
