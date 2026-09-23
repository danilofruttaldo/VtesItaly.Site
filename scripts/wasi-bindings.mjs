/* Installs on Windows the WebAssembly builds of Astro 7's native modules.
 *
 * Why: the Astro compiler (`@astrojs/compiler-binding`) and the markdown
 * processor (`satteri`) are Rust modules loaded as unsigned `.node` files.
 * Smart App Control blocks them, and `astro dev`, `astro build` and the
 * pre-push hook die with "Cannot find native binding" — the same problem that
 * already moved esbuild to esbuild-wasm.
 *
 * Both loaders fall back on their own to the `*-wasm32-wasi` package when the
 * native one fails. npm never installs those packages, though: they declare
 * `cpu: wasm32`, which matches no machine. Adding them as dependencies with
 * `--force` doesn't help either, since `npm ci` then fails with EBADPLATFORM
 * on the Linux pipeline too.
 *
 * So they are fetched and unpacked by hand, at the version pinned in
 * package-lock, and follow Astro upgrades on their own. Their dependencies
 * (`@napi-rs/wasm-runtime` and friends) npm already installs. Outside Windows
 * it does nothing. Ported from danilofruttaldo.Site (compilatore-wasi.mjs).
 *
 * Runs as postinstall, after every `npm install` or `npm ci`.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const PACKAGES = ['@astrojs/compiler-binding-wasm32-wasi', '@bruits/satteri-wasm32-wasi'];

if (process.platform !== 'win32') process.exit(0);

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));

for (const pkg of PACKAGES) {
  const version = lock.packages[`node_modules/${pkg}`]?.version;
  if (!version) {
    console.warn(`${pkg} is not in package-lock: skipped.`);
    continue;
  }

  const dir = path.join('node_modules', ...pkg.split('/'));
  const manifest = path.join(dir, 'package.json');
  if (existsSync(manifest) && JSON.parse(readFileSync(manifest, 'utf8')).version === version) continue;

  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  // Relative paths and cwd inside the folder: Git's tar, when it comes first
  // in PATH over Windows' one, reads `C:\...` as a remote host.
  const [{ filename }] = JSON.parse(
    execSync(`npm pack ${pkg}@${version} --json --pack-destination .`, { cwd: dir, encoding: 'utf8' }),
  );
  execSync(`tar -xzf ${filename} --strip-components=1`, { cwd: dir });
  rmSync(path.join(dir, filename));

  console.log(`${pkg}@${version} installed (WebAssembly fallback).`);
}
