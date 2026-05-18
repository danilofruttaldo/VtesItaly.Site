/* Every post that declares a `standingsUrl` must resolve to a real file in
 * src/data/standings/. The runtime resolver in EventEdition/LeagueEdition/
 * TourEdition does a lenient `includes()` substring match against the basename
 * (strips the leading path), so absolute, relative, and extension-less forms
 * all "work" — but a typo or rename produces a silent empty standings table
 * instead of a build error. This test pins the invariant. */
import { describe, it } from 'vitest';
import { getCollection } from 'astro:content';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const STANDINGS_ROOT = join(process.cwd(), 'src', 'data', 'standings');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (entry.endsWith('.json')) out.push(p);
  }
  return out;
}

const standingsBasenames = new Set(
  walk(STANDINGS_ROOT).map((p) =>
    p
      .split(/[\\/]/)
      .pop()!
      .replace(/\.json$/, ''),
  ),
);

describe('standingsUrl integrity', () => {
  it('uses the same resolution rule as the runtime template', async () => {
    const posts = await getCollection('blog');
    const failures: string[] = [];

    for (const post of posts) {
      const url = post.data.standingsUrl;
      if (!url) continue;
      // Mirror EventEdition.astro: strip any leading path, drop the .json
      // suffix, then look for the basename in the standings tree.
      const basename = url.replace(/^.*\//, '').replace(/\.json$/, '');
      if (!standingsBasenames.has(basename)) {
        failures.push(
          `${post.id}: standingsUrl='${url}' resolves to '${basename}' (no match under src/data/standings/)`,
        );
      }
    }

    if (failures.length > 0) {
      throw new Error(`Unresolved standingsUrl entries:\n  ${failures.join('\n  ')}`);
    }
  });
});
