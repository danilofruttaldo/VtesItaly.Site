/* Generates downscaled width variants `<name>-<w>w.webp` for every poster image
 * referenced by a `poster:` field in `src/content/blog/*.md`, so the event
 * pages can ship a `srcset` sized to the ~360 px display slot instead of the
 * full 600–1600 px source (often 100–280 KB). Pairs with `responsiveImage()`
 * in `src/utils/image.ts`, which emits `srcset` only for the variants that
 * actually exist — so a missing variant degrades to the plain `<img>`.
 *
 * Source of truth is the content itself (the `poster:` frontmatter), so adding
 * an event needs no edit here: its poster is picked up automatically. Only
 * poster images are touched — gallery/header art is left alone.
 *
 * Generated files are git-ignored and rebuilt by `prebuild` (locally and in
 * CI): no derivative binaries are committed. Re-run is idempotent — a variant
 * is regenerated only when the source is newer (mtime) — and never upscales
 * (widths >= the source width are skipped), so the source stays the top srcset
 * candidate.
 */
import sharp from 'sharp';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const WIDTHS = [400, 800, 1200];
const CONTENT_DIR = 'src/content/blog';
const PUBLIC_DIR = 'public';

/** Collect unique `poster:` image paths across all blog markdown files. */
function collectPosters() {
  const posters = new Set();
  for (const name of readdirSync(CONTENT_DIR)) {
    if (!name.endsWith('.md')) continue;
    const text = readFileSync(join(CONTENT_DIR, name), 'utf8');
    const m = text.match(/^poster:\s*['"]?([^'"\n]+?)['"]?\s*$/m);
    if (m && /\.webp$/i.test(m[1])) posters.add(m[1].trim());
  }
  return [...posters];
}

let generated = 0;
let skipped = 0;
let missing = 0;

for (const poster of collectPosters()) {
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
    let needsRegen = true;
    try {
      if (statSync(out).mtimeMs >= srcStat.mtimeMs) needsRegen = false;
    } catch {
      // missing — generate
    }
    if (!needsRegen) {
      skipped++;
      continue;
    }
    await sharp(srcFile).resize(w).webp({ quality: 80, effort: 6 }).toFile(out);
    generated++;
  }
}

console.log(
  `poster variants: ${generated} generated, ${skipped} up to date${missing ? `, ${missing} source(s) missing` : ''}`,
);
