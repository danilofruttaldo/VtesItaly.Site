/* Pre-test warm-up: vitest reads Astro's content-collection data-store from
 * `.astro/data-store.json` (project root), but `astro check` and `astro sync`
 * write it to `node_modules/.astro/data-store.json` instead. Only `astro dev`
 * and `astro build` reliably populate the root-level path that vitest uses.
 *
 * This script:
 *  1. If `.astro/data-store.json` already exists, exits 0 (warm).
 *  2. Otherwise runs `astro sync` to (best-effort) populate node_modules/.astro/.
 *  3. If a file ended up at node_modules/.astro/data-store.json, copies it
 *     into .astro/data-store.json so vitest can read it.
 *  4. If the copy still didn't land, briefly starts `astro dev` (which DOES
 *     write to .astro/) and kills it once the file appears.
 *
 * Without this, `getCollection('blog')` returns 0 entries inside vitest tests,
 * and every component test that pulls real posts fails. See:
 *   https://github.com/withastro/astro/issues/7051
 */
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

const ROOT_STORE = '.astro/data-store.json';
const NODE_MODULES_STORE = 'node_modules/.astro/data-store.json';

function log(msg) {
  console.log(`[warm-content] ${msg}`);
}

function tryCopyFromNodeModules() {
  if (!existsSync(NODE_MODULES_STORE)) return false;
  mkdirSync('.astro', { recursive: true });
  copyFileSync(NODE_MODULES_STORE, ROOT_STORE);
  return existsSync(ROOT_STORE);
}

if (existsSync(ROOT_STORE)) {
  log('.astro/data-store.json already present, skipping');
  process.exit(0);
}

log('running `astro sync` …');
spawnSync('npx', ['astro', 'sync'], { stdio: 'inherit', shell: process.platform === 'win32' });

if (tryCopyFromNodeModules()) {
  log('copied data-store from node_modules/.astro into .astro/');
  process.exit(0);
}

log('sync did not produce a data-store; starting `astro dev` briefly to warm it');
const port = 14322 + Math.floor(Math.random() * 100);
const dev = spawn('npx', ['astro', 'dev', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: process.platform === 'win32',
});

const HARD_TIMEOUT = 30_000;
const POLL_INTERVAL = 250;
const start = Date.now();

const timer = setInterval(() => {
  if (existsSync(ROOT_STORE)) {
    clearInterval(timer);
    log(`data-store appeared after ${Date.now() - start}ms`);
    dev.kill('SIGTERM');
    setTimeout(() => process.exit(0), 250);
  } else if (Date.now() - start > HARD_TIMEOUT) {
    clearInterval(timer);
    log(`timed out after ${HARD_TIMEOUT}ms waiting for .astro/data-store.json`);
    dev.kill('SIGKILL');
    setTimeout(() => process.exit(1), 250);
  }
}, POLL_INTERVAL);

dev.on('exit', (code) => {
  // dev exited on its own — likely an error. If we have a store, all good.
  clearInterval(timer);
  if (existsSync(ROOT_STORE)) {
    log('astro dev exited but data-store is in place; continuing');
    process.exit(0);
  }
  log(`astro dev exited with code ${code} and no data-store appeared`);
  process.exit(1);
});
