import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

/* Regola tipografica del sito: mai il trattino lungo (U+2014). check-pages lo
 * cerca nell'HTML di dist/, ma non vede i commenti, gli script, i sorgenti
 * delle immagini (scripts/diagrams/*.svg finisce dentro un .webp) e i
 * documenti. Questo controllo guarda i file di testo del repo. */

const EM_DASH = String.fromCharCode(0x2014);
const ROOTS = ['src', 'scripts', 'tests', 'docs', '.github', 'README.md', 'public/.htaccess'];
// Solo file di testo: immagini, font e PDF restano fuori.
const TEXT = new Set([
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.sh',
  '.svg',
  '.ts',
  '.txt',
  '.yml',
  '.yaml',
]);

function* walk(path: string): Generator<string> {
  let stat;
  try {
    stat = statSync(path);
  } catch {
    return;
  }
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) yield* walk(join(path, entry));
  } else if (TEXT.has(extname(path).toLowerCase()) || path.endsWith('.htaccess')) {
    yield path;
  }
}

describe('typography: no em dash in the repository text files', () => {
  it('finds no U+2014 in src/, scripts/, tests/, docs/ and the deployed .htaccess', () => {
    const hits: string[] = [];
    for (const root of ROOTS) {
      for (const file of walk(root)) {
        const lines = readFileSync(file, 'utf8').split('\n');
        lines.forEach((line, i) => {
          if (line.includes(EM_DASH)) hits.push(`${relative('.', file)}:${i + 1}`);
        });
      }
    }
    expect(hits).toEqual([]);
  });
});
