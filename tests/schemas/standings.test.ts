/* Golden test: every JSON in src/data/standings/ MUST validate against the
 * dialect-appropriate Zod schema. Catches typos in player names (empty
 * strings, NaN points, malformed rows) at test time instead of waiting for
 * the build to silently render a broken table. */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { z } from 'zod';
import { rowSchemaForPath, isStructuralEdgeCase } from '../../src/schemas/standings';

const STANDINGS_ROOT = join(process.cwd(), 'src', 'data', 'standings');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      out.push(...walk(p));
    } else if (entry.endsWith('.json')) {
      out.push(p);
    }
  }
  return out;
}

const files = walk(STANDINGS_ROOT);

describe('standings golden validation', () => {
  it('discovers at least one standings file', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const rel = relative(process.cwd(), file).split(sep).join('/');
    const skip = isStructuralEdgeCase(rel);

    it(`${skip ? 'skips' : 'validates'} ${rel}`, () => {
      const raw = readFileSync(file, 'utf8');
      const parsed = JSON.parse(raw);

      if (skip) {
        // WoS edge case: assert it's still a non-null object so we don't
        // silently lose an entire dataset on a bad refactor.
        expect(parsed).toBeTypeOf('object');
        expect(parsed).not.toBeNull();
        return;
      }

      expect(Array.isArray(parsed), `${rel} must be a JSON array`).toBe(true);
      const schema = z.array(rowSchemaForPath(rel));
      const result = schema.safeParse(parsed);
      if (!result.success) {
        // Surface the first 5 issues so a CI failure is actionable.
        const issues = result.error.issues
          .slice(0, 5)
          .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
          .join('\n');
        throw new Error(`${rel} failed schema validation:\n${issues}`);
      }
    });
  }
});
