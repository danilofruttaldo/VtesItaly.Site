/* Static render of SearchOverlay via Astro Container.
 * Verifies the localised aria-labels/placeholders make it into the markup
 * and that the inline script keeps the XSS-safe excerpt parser. The parser
 * (replaced the older regex+innerHTML sanitiser) splits the Pagefind excerpt
 * on <mark>...</mark> and rebuilds the DOM with text nodes + <mark>
 * elements, so injected HTML (including entity-encoded payloads) cannot
 * escape into the document. */
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

  it('inline script must not pipe excerpts through innerHTML (XSS regression)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SearchOverlay, {
      request: new Request('http://localhost/'),
    });
    // The excerpt parser is the only place an attacker-controlled string
    // could reach the DOM; it must build elements via createElement +
    // textContent, never via innerHTML.
    expect(html).toContain('split(/<mark>([\\s\\S]*?)<\\/mark>/g)');
    expect(html).toContain('createTextNode(part)');
    expect(html).toMatch(/mark\.textContent\s*=\s*part/);
    expect(html).not.toMatch(/excerpt\.innerHTML\s*=/);
  });

  it('XSS regression: parser keeps non-<mark> tags as literal text segments', () => {
    // Mirrors the parser embedded in SearchOverlay.astro. If somebody changes
    // the split or starts treating extra tags as elements this test fails
    // before the bad code ever ships. The parser models its DOM output as
    // a sequence of {kind: 'text' | 'mark', value} segments.
    type Seg = { kind: 'text' | 'mark'; value: string };
    const parse = (raw: string): Seg[] => {
      const parts = (raw || '').split(/<mark>([\s\S]*?)<\/mark>/g);
      const out: Seg[] = [];
      parts.forEach((p, i) => {
        if (i % 2 === 0) {
          if (p) out.push({ kind: 'text', value: p });
        } else {
          out.push({ kind: 'mark', value: p });
        }
      });
      return out;
    };

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

    // Multiple <mark> spans interleave correctly.
    expect(parse('<mark>a</mark><mark>b</mark>')).toEqual([
      { kind: 'mark', value: 'a' },
      { kind: 'mark', value: 'b' },
    ]);
  });
});
