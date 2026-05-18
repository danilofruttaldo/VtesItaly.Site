/* Generates `<name>-thumb.webp` siblings (240x240, cover, top-anchored) for
 * every `<name>.webp` under the *allowed* image roots — currently
 * `public/images/comunita/` (PostCard 80–120 px slot) and
 * `public/images/principi/` (prince avatars at 120 px). Without these,
 * Lighthouse calls out `uses-responsive-images` because the full 1024x1024
 * community posters download as the card thumb (~290 KB → ~12 KB after this).
 *
 * Allow-list intentionally narrow: card art (`carte/`), twin photos
 * (`gemelli/`), the site logo, hero banners, OG covers and city headers all
 * render at sizes >= 400 px and would lose visible quality at 240 px.
 *
 * Re-run is idempotent: a thumb is regenerated only when the source is newer
 * (mtime check), so wiring this to `prebuild` adds no measurable build time
 * when nothing changed.
 */
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['public/images/comunita', 'public/images/principi'];
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

    const thumb = p.replace(/\.webp$/i, '-thumb.webp');
    const srcStat = statSync(p);
    let needsRegen = true;
    try {
      const tStat = statSync(thumb);
      if (tStat.mtimeMs >= srcStat.mtimeMs) needsRegen = false;
    } catch {
      // missing — fall through and generate
    }
    if (!needsRegen) {
      skipped++;
      continue;
    }
    await sharp(p)
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'top' })
      .webp({ quality: 78, effort: 6 })
      .toFile(thumb);
    generated++;
  }
}

for (const root of ROOTS) await walk(root);
console.log(`thumbnails: ${generated} generated, ${skipped} up to date`);
