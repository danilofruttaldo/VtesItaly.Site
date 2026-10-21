/* Pre-test warm-up: vitest reads Astro's content-collection data-store from
 * `.astro/data-store.json` (project root), but `astro check` and `astro sync`
 * write it to `node_modules/.astro/data-store.json` instead. Only `astro dev`
 * and `astro build` reliably populate the root-level path that vitest uses.
 *
 * This script:
 *  1. If `.astro/data-store.json` already exists and is newer than every file
 *     under src/content and src/data, exits 0 (warm). A stale store is
 *     deleted, so the tests never run on old content.
 *  2. Otherwise runs `astro sync` to (best-effort) populate node_modules/.astro/.
 *  3. If a file ended up at node_modules/.astro/data-store.json, copies it
 *     into .astro/data-store.json so vitest can read it.
 *  4. If the copy still didn't land, briefly starts `astro dev` (which DOES
 *     write to .astro/) and kills it once the file appears. The whole process
 *     tree goes: with shell:true on Windows, killing the npx shell alone left
 *     `astro dev` running in the background.
 *
 * Without this, `getCollection('blog')` returns 0 entries inside vitest tests,
 * and every component test that pulls real posts fails. See:
 *   https://github.com/withastro/astro/issues/7051
 */
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const ROOT_STORE = '.astro/data-store.json';
const NODE_MODULES_STORE = 'node_modules/.astro/data-store.json';
const SOURCE_DIRS = ['src/content', 'src/data'];
const IS_WIN = process.platform === 'win32';

function log(msg) {
  console.log(`[warm-content] ${msg}`);
}

// Newest mtime (ms) of any file under the content sources.
function newestSourceMtime() {
  let newest = 0;
  for (const dir of SOURCE_DIRS) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const mtime = statSync(join(entry.parentPath, entry.name)).mtimeMs;
      if (mtime > newest) newest = mtime;
    }
  }
  return newest;
}

const sourceMtime = newestSourceMtime();
const isFresh = (file) => existsSync(file) && statSync(file).mtimeMs >= sourceMtime;

// Kills the child and everything it started. On Windows with shell:true the
// child is cmd.exe running npx, so a plain kill() orphans `astro dev`.
function killTree(child, signal) {
  if (child.exitCode !== null || child.pid === undefined) return;
  try {
    if (IS_WIN) {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      // Negative pid: the whole process group (the child is spawned detached).
      process.kill(-child.pid, signal);
    }
  } catch {
    child.kill(signal);
  }
}

function tryCopyFromNodeModules() {
  // A store left over from an earlier sync would bring stale content back.
  if (!isFresh(NODE_MODULES_STORE)) return false;
  mkdirSync('.astro', { recursive: true });
  copyFileSync(NODE_MODULES_STORE, ROOT_STORE);
  return existsSync(ROOT_STORE);
}

if (isFresh(ROOT_STORE)) {
  log('.astro/data-store.json already present and up to date, skipping');
  process.exit(0);
}
if (existsSync(ROOT_STORE)) {
  log('.astro/data-store.json is older than src/content or src/data, rebuilding');
  rmSync(ROOT_STORE);
}

log('running `astro sync` …');
spawnSync('npx', ['astro', 'sync'], { stdio: 'inherit', shell: IS_WIN });

if (tryCopyFromNodeModules()) {
  log('copied data-store from node_modules/.astro into .astro/');
  process.exit(0);
}

log('sync did not produce a data-store; starting `astro dev` briefly to warm it');
const port = 14322 + Math.floor(Math.random() * 100);
const dev = spawn('npx', ['astro', 'dev', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: IS_WIN,
  // Own process group outside Windows, so killTree can signal all of it.
  detached: !IS_WIN,
});

const HARD_TIMEOUT = 30_000;
const POLL_INTERVAL = 250;
const start = Date.now();

const timer = setInterval(() => {
  if (existsSync(ROOT_STORE)) {
    clearInterval(timer);
    log(`data-store appeared after ${Date.now() - start}ms`);
    killTree(dev, 'SIGTERM');
    setTimeout(() => process.exit(0), 250);
  } else if (Date.now() - start > HARD_TIMEOUT) {
    clearInterval(timer);
    log(`timed out after ${HARD_TIMEOUT}ms waiting for .astro/data-store.json`);
    killTree(dev, 'SIGKILL');
    setTimeout(() => process.exit(1), 250);
  }
}, POLL_INTERVAL);

dev.on('exit', (code) => {
  // dev exited on its own: likely an error. If we have a store, all good.
  clearInterval(timer);
  if (existsSync(ROOT_STORE)) {
    log('astro dev exited but data-store is in place; continuing');
    process.exit(0);
  }
  log(`astro dev exited with code ${code} and no data-store appeared`);
  process.exit(1);
});
