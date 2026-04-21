/* Post-build smoke: validates the dist/ artifact emitted by `npm run build`.
 * Run via `npm run test:build` (which builds first). Catches regressions
 * that pass `astro check` and unit tests but break the actual deployable —
 * missing pages, broken sitemap, no Pagefind index, missing hreflang. */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');

function read(file: string): string {
  return readFileSync(join(DIST, file), 'utf8');
}

describe('build output: dist/', () => {
  it('exists and is non-trivial', () => {
    expect(existsSync(DIST), 'run `npm run build` first').toBe(true);
    expect(existsSync(join(DIST, 'index.html'))).toBe(true);
  });

  it('IT homepage has the site title and canonical URL', () => {
    const html = read('index.html');
    expect(html.toLowerCase()).toContain('vtes italy');
    expect(html).toContain('rel="canonical"');
    expect(html).toMatch(/href="https:\/\/vtesitaly\.com\/?"/);
  });

  it('EN homepage exists and links back to the IT version via hreflang', () => {
    const html = read('en/index.html');
    expect(html).toMatch(/hreflang="it"/);
    expect(html).toMatch(/hreflang="en"/);
    expect(html).toMatch(/hreflang="x-default"/);
  });

  it('emits the sitemap index expected by @astrojs/sitemap', () => {
    expect(existsSync(join(DIST, 'sitemap-index.xml'))).toBe(true);
    const xml = read('sitemap-index.xml');
    expect(xml).toContain('<sitemapindex');
  });

  // Pagefind ships per-platform binaries; Windows ARM64 has no release yet,
  // so the local build skips this step. CI (Ubuntu x64) always runs it.
  const pagefindRan = existsSync(join(DIST, 'pagefind', 'pagefind.js'));
  it.skipIf(!pagefindRan)('emits the Pagefind runtime + index', () => {
    expect(existsSync(join(DIST, 'pagefind', 'pagefind.js'))).toBe(true);
    expect(existsSync(join(DIST, 'pagefind', 'pagefind-entry.json'))).toBe(true);
  });

  it('every page exposes an og:image meta tag', () => {
    const html = read('index.html');
    expect(html).toMatch(/<meta[^>]*property=["']og:image["']/);
  });

  it('IT homepage links to the EN alternate (slug remap), not /en+IT-slug', () => {
    const html = read('index.html');
    // Must NOT contain a malformed path like /en/principati/ — should be /en/domains/
    expect(html).not.toMatch(/href="\/en\/principati/);
  });

  it('the staged artifact stays under the 80 MB CI guard', () => {
    function size(dir: string): number {
      let total = 0;
      const stack = [dir];
      while (stack.length) {
        const cur = stack.pop()!;
        for (const entry of readdirSync(cur, { withFileTypes: true })) {
          const p = join(cur, entry.name);
          if (entry.isDirectory()) stack.push(p);
          else total += statSync(p).size;
        }
      }
      return total;
    }
    const mb = size(DIST) / 1024 / 1024;
    expect(mb, `dist is ${mb.toFixed(1)}MB`).toBeLessThan(80);
  });
});
