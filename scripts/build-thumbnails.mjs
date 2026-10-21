/* Generates `<name>-thumb.webp` siblings (240x240, cover, top-anchored) for
 * every `<name>.webp` under the *allowed* image roots, currently
 * `public/images/comunita/` (PostCard 80–120 px slot),
 * `public/images/principi/` (prince avatars at 120 px) and
 * `public/images/headers/` (city headers, the card image of calendar-only
 * events), plus every poster, featured or stage image a post names under
 * `public/{tour,nc,gp,ev}/`: the tournament covers on the home and principato
 * cards. Without these, Lighthouse calls out `uses-responsive-images` because
 * the full posters download as the card thumb (~290 KB → ~12 KB after this).
 *
 * Allow-list intentionally narrow: card art (`carte/`), twin photos
 * (`gemelli/`), gallery photos, the site logo and OG covers render at sizes
 * >= 400 px or never in a card.
 *
 * Re-run is idempotent: a thumb is regenerated only when the source is newer
 * (mtime check), so wiring this to `prebuild` adds no measurable build time
 * when nothing changed.
 */
import sharp from 'sharp';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['public/images/comunita', 'public/images/principi', 'public/images/headers'];

// Card images named in the posts' frontmatter (poster, featuredImage, stage
// `image`) that live outside the roots above.
const BLOG = 'src/content/blog';
const NAMED = new Set();
for (const f of readdirSync(BLOG)) {
  if (!f.endsWith('.md')) continue;
  const text = readFileSync(join(BLOG, f), 'utf8');
  for (const m of text.matchAll(/^\s*(?:poster|featuredImage|image):\s*['"]?(\/(?:tour|nc|gp|ev)\/[^'"\s]+\.webp)/gm)) {
    NAMED.add(join('public', m[1]));
    // A tour stage also needs its placeholder cover (`…-000.webp`) as a thumb.
    if (m[1].startsWith('/tour/')) NAMED.add(join('public', m[1].replace(/\d{3}\.webp$/, '000.webp')));
  }
}

const THUMB_SIZE = 240;

let generated = 0;
let skipped = 0;

async function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(p);
      continue;
    }
    if (!/\.webp$/i.test(entry.name)) continue;
    if (/-thumb\.webp$/i.test(entry.name)) continue;
    if (/-2x\.webp$/i.test(entry.name)) continue;
    // Responsive width variants from build-poster-variants.mjs are already
    // downscaled display images: don't thumbnail them.
    if (/-\d+w\.webp$/i.test(entry.name)) continue;
    await makeThumb(p);
  }
}

async function makeThumb(p) {
  const thumb = p.replace(/\.webp$/i, '-thumb.webp');
  try {
    if (statSync(thumb).mtimeMs >= statSync(p).mtimeMs) {
      skipped++;
      return;
    }
  } catch {
    // missing: fall through and generate
  }
  await sharp(p)
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'top' })
    .webp({ quality: 78, effort: 6 })
    .toFile(thumb);
  generated++;
}

for (const root of ROOTS) await walk(root);
for (const p of NAMED) {
  try {
    statSync(p);
  } catch {
    continue; // a missing image is the link checker's to report
  }
  await makeThumb(p);
}
console.log(`thumbnails: ${generated} generated, ${skipped} up to date`);
