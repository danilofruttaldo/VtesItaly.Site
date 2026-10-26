/* Runs pagefind, on Windows ARM64 through its x64 build.
 *
 * Why: Smart App Control blocks the unsigned arm64 `pagefind_extended.exe`
 * (since 2026-10-26, same file that ran before): the npm wrapper then exits 1
 * with no output and the build, the pre-push hook included, fails. The x64
 * build runs under emulation and is let through. wasi-bindings.mjs unpacks it
 * at the version in package-lock; the npm wrapper takes it from
 * PAGEFIND_EXTENDED_BINARY_PATH. Elsewhere pagefind runs as usual.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const x64 = path.resolve('node_modules/@pagefind/windows-x64/bin/pagefind_extended.exe');
const env = { ...process.env };
if (process.platform === 'win32' && process.arch === 'arm64' && existsSync(x64)) {
  env.PAGEFIND_EXTENDED_BINARY_PATH ??= x64;
}

const { status } = spawnSync(
  process.execPath,
  [path.resolve('node_modules/pagefind/lib/runner/bin.cjs'), ...process.argv.slice(2)],
  { stdio: 'inherit', env },
);
process.exit(status ?? 1);
