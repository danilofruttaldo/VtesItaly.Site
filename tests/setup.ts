// Force the test runner to UTC so Date.toDateString() / setHours() etc. give
// the same results on a CI Ubuntu runner (UTC) and on a developer's local
// machine (often Europe/Rome). Without this, status.ts tests using late-day
// UTC instants would flip days under DST.
process.env.TZ = 'UTC';

// Pre-warm Astro's content collection so getCollection('blog') returns the
// real entries inside vitest. Without this the virtual module resolves but
// the data-store hasn't been loaded yet, and getCollection returns []. Astro
// docs (testing guide) recommend doing this in a setup file.
import { getCollection } from 'astro:content';
await getCollection('blog');
