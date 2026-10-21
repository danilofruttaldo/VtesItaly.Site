// Replaces __BUILD_TS__ in dist/sw.js with the current git SHA so the
// cache name is stable per commit (redeploying the same artifact reuses
// the same cache namespace instead of churning clients with a fresh one).
// Falls back to a timestamp when not in a git repo (rare: shouldn't happen
// in CI, but keeps local builds working outside a clone).
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const file = 'dist/sw.js';
let stamp;
try {
  stamp = execSync('git rev-parse --short=8 HEAD', { encoding: 'utf8' }).trim();
} catch {
  stamp = Date.now().toString(36);
}
const src = readFileSync(file, 'utf8');
if (!src.includes('__BUILD_TS__')) {
  console.error(
    `stamp-sw: placeholder __BUILD_TS__ not found in ${file}. Already stamped, or public/sw.js lost the CACHE_NAME placeholder: the cache name would not change per deploy.`,
  );
  process.exit(1);
}
writeFileSync(file, src.replace('__BUILD_TS__', stamp));
console.log(`sw.js stamped with cache version: vtesitaly-${stamp}`);
