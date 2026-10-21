import { describe, it, expect } from 'vitest';
import { pageLocale, remarkAlertLocale } from '../../src/utils/remark-alert-locale';

const callout = () => ({
  type: 'root',
  children: [
    {
      type: 'blockquote',
      children: [
        {
          type: 'paragraph',
          data: { hProperties: { className: 'markdown-alert-title' } },
          children: [{ type: 'emphasis' }, { type: 'text', value: 'NOTE' }],
        },
      ],
    },
  ],
});
const titleOf = (tree: ReturnType<typeof callout>) => tree.children[0].children[0].children[1].value;

describe('remark-alert-locale', () => {
  it('translates the callout title on Italian pages only', () => {
    const it_ = callout();
    remarkAlertLocale()(it_, { path: 'src/content/blog/play-bologna-2027.md' });
    expect(titleOf(it_)).toBe('NOTA');
    const en = callout();
    remarkAlertLocale()(en, { path: 'src/content/blog/play-bologna-2027-en.md' });
    expect(titleOf(en)).toBe('NOTE');
  });

  it('reads the page language from the frontmatter first', () => {
    expect(pageLocale({ data: { astro: { frontmatter: { locale: 'en' } } }, path: 'x.md' })).toBe('en');
    expect(pageLocale({ history: ['guide/archon-judge-en.md'] })).toBe('en');
    expect(pageLocale({})).toBe('it');
  });
});
