import { describe, it, expect } from 'vitest';
import { parseGitLog } from '../../src/utils/git-dates';

describe('git-dates: parseGitLog', () => {
  it('takes the newest commit as modified and the oldest as created', () => {
    const log = [
      '@2026-10-21',
      '',
      'src/content/blog/a.md',
      'src/content/blog/b.md',
      '@2026-09-01',
      '',
      'src/content/blog/a.md',
      '@2026-05-17',
      '',
      'src/content/blog/a.md',
    ].join('\n');
    const dates = parseGitLog(log);
    expect(dates.get('src/content/blog/a.md')).toEqual({ created: '2026-05-17', modified: '2026-10-21' });
    expect(dates.get('src/content/blog/b.md')).toEqual({ created: '2026-10-21', modified: '2026-10-21' });
  });
});
