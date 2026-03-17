// Replaces __BUILD_TS__ in dist/sw.js with the current build timestamp.
import { readFileSync, writeFileSync } from 'node:fs';

const file = 'dist/sw.js';
const ts = Date.now().toString(36);
const src = readFileSync(file, 'utf8');
writeFileSync(file, src.replace('__BUILD_TS__', ts));
console.log(`sw.js stamped with cache version: vtesitaly-${ts}`);
