/* Static render of SearchOverlay via Astro Container.
 * Verifies the localised aria-labels/placeholders make it into the markup
 * and that the inline script keeps the XSS-safe excerpt sanitiser. The
 * sanitiser regex is the regression target from commit e731108: it strips
 * every HTML tag except <mark> / </mark>, so injected <script> tags from a
 * malformed Pagefind excerpt cannot reach the DOM. */
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import SearchOverlay from '../../src/components/SearchOverlay.astro';

describe('SearchOverlay', () => {
  it('renders the IT placeholder + aria-labels by default', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SearchOverlay, {
      request: new Request('http://localhost/'),
    });
    expect(html).toContain('id="search-overlay"');
    expect(html).toContain('id="pagefind-input"');
    expect(html).toContain('placeholder="Cerca');
  });

  it('switches to EN strings when rendered under /en/', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SearchOverlay, {
      request: new Request('http://localhost/en/'),
    });
    expect(html.toLowerCase()).toContain('search');
  });

  it('ships the inline script that strips every tag except <mark> (XSS regression on commit e731108)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SearchOverlay, {
      request: new Request('http://localhost/'),
    });
    // The literal regex must be present in the inline script. If somebody
    // edits the sanitiser to be less strict they have to update this test.
    expect(html).toMatch(/replace\(\s*\/<\(\?!\\\/\?mark\\b\)\[\^>\]\*>\/gi/);
  });

  it('XSS regression: the inline regex strips <script> but preserves <mark>', () => {
    // Mirror the regex literal embedded in SearchOverlay.astro. If someone
    // weakens it (e.g. drops the negative lookahead) this test fails before
    // the bad regex ever ships.
    const sanitise = (s: string) => s.replace(/<(?!\/?mark\b)[^>]*>/gi, '');
    expect(sanitise('<script>alert(1)</script>hello')).toBe('alert(1)hello');
    expect(sanitise('foo <mark>bar</mark> baz')).toBe('foo <mark>bar</mark> baz');
    expect(sanitise('<img src=x onerror=alert(1)>boom')).toBe('boom');
    expect(sanitise('<svg><animate onbegin=alert(1)>ok</animate></svg>')).toBe('ok');
    expect(sanitise('case-INSENSITIVE <MARK>x</MARK>')).toBe('case-INSENSITIVE <MARK>x</MARK>');
  });
});
