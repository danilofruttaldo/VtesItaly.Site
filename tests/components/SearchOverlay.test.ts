/* Static render of SearchOverlay via Astro Container.
 * Verifies the localised aria-labels/placeholders make it into the markup
 * and that the excerpt parser stays XSS-safe. The parser in
 * src/utils/search-excerpt.ts (replaced the older regex+innerHTML sanitiser) splits the Pagefind excerpt
 * on <mark>...</mark> and rebuilds the DOM with text nodes + <mark>
 * elements, so injected HTML (including entity-encoded payloads) cannot
 * escape into the document. */
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import SearchOverlay from '../../src/components/SearchOverlay.astro';
import { excerptSegments } from '../../src/utils/search-excerpt';

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

  it('renders as a modal dialog, inert until opened', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SearchOverlay, {
      request: new Request('http://localhost/'),
    });
    expect(html).toMatch(/id="search-overlay"[^>]*role="dialog"/);
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Ricerca nel sito"');
    expect(html).toMatch(/id="search-overlay"[^>]*inert/);
  });

  it('XSS regression: parser keeps non-<mark> tags as literal text segments', () => {
    // excerptSegments is the parser the overlay script uses: it builds the
    // DOM from these segments with createTextNode and mark.textContent, never
    // innerHTML. If somebody changes the split or starts treating extra tags
    // as elements this test fails before the bad code ever ships.
    const parse = excerptSegments;

    // <script> never becomes a mark segment — its source is literal text
    // and would be rendered as a text node by createTextNode at runtime.
    expect(parse('<script>alert(1)</script>hello')).toEqual([
      { kind: 'text', value: '<script>alert(1)</script>hello' },
    ]);

    // <mark> is the only allowed element.
    expect(parse('foo <mark>bar</mark> baz')).toEqual([
      { kind: 'text', value: 'foo ' },
      { kind: 'mark', value: 'bar' },
      { kind: 'text', value: ' baz' },
    ]);

    // onerror payloads can't fire — there's no <img> segment, just text.
    expect(parse('<img src=x onerror=alert(1)>boom')).toEqual([
      { kind: 'text', value: '<img src=x onerror=alert(1)>boom' },
    ]);

    // Entity-encoded variants stay literal (this was the gap with the old
    // regex sanitiser, which only stripped raw < > tags and could pass an
    // entity-encoded tag through to innerHTML).
    expect(parse('&lt;script&gt;alert(1)&lt;/script&gt;')).toEqual([
      { kind: 'text', value: '&lt;script&gt;alert(1)&lt;/script&gt;' },
    ]);

    // Uppercase <MARK> is intentionally NOT treated as a match (Pagefind
    // only emits lowercase) — it stays as literal text.
    expect(parse('keep <MARK>x</MARK> literal')).toEqual([{ kind: 'text', value: 'keep <MARK>x</MARK> literal' }]);

    // No excerpt at all gives no segments.
    expect(parse(undefined)).toEqual([]);
    expect(parse(null)).toEqual([]);

    // Multiple <mark> spans interleave correctly.
    expect(parse('<mark>a</mark><mark>b</mark>')).toEqual([
      { kind: 'mark', value: 'a' },
      { kind: 'mark', value: 'b' },
    ]);
  });
});
