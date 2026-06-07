/* Rasterizes the rule-summary diagrams in `scripts/diagrams/*.svg` to
 * `public/guide/regole/<name>.webp` at 2x density (retina-crisp) for the
 * "Schemi riassuntivi" guide page. SVG is the editable/translatable source of
 * truth; the committed .webp is what the page serves (clickable, full-size).
 *
 * Run manually after editing an SVG:  node scripts/build-diagrams.mjs
 * Not wired to prebuild: diagrams change rarely and the .webp is tracked.
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const SRC = 'scripts/diagrams';
const OUT = 'public/guide/regole';
const DENSITY = 144; // 2x of the 72-dpi SVG baseline

mkdirSync(OUT, { recursive: true });

let n = 0;
for (const entry of readdirSync(SRC)) {
  if (!/\.svg$/i.test(entry)) continue;
  const name = basename(entry, '.svg');
  await sharp(join(SRC, entry), { density: DENSITY })
    .webp({ quality: 88, effort: 6 })
    .toFile(join(OUT, `${name}.webp`));
  n++;
  console.log(`diagram: ${name}.webp`);
}
console.log(`diagrams: ${n} generated`);
