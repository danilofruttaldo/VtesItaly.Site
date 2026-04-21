/* Calendar.astro static-render smoke + XSS regression on commit e731108.
 * The component embeds the server-side event list as JSON in `data-server-
 * events`. The XSS vector was: a post title containing `</script>` would
 * have closed the data-* string when rendered without escaping. The fix
 * relies on JSON.stringify + HTML attribute escaping done by Astro itself.
 * We assert the embedded JSON does not break out of the attribute. */
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Calendar from '../../src/components/Calendar.astro';

describe('Calendar', () => {
  it('renders the month nav, day headers and the data-* hydration props', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Calendar, {
      request: new Request('http://localhost/'),
    });
    expect(html).toContain('class="cal"');
    expect(html).toContain('cal__nav');
    expect(html).toContain('cal__month-title');
    // hydration props embedded as data-*
    expect(html).toContain('data-locale="it"');
    expect(html).toContain('data-server-events=');
    expect(html).toContain('data-cat-labels=');
  });

  it('exposes EN localised labels under /en/', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Calendar, {
      request: new Request('http://localhost/en/'),
    });
    expect(html).toContain('data-locale="en"');
  });

  it('XSS regression: data-server-events JSON is HTML-attribute-escaped', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Calendar, {
      request: new Request('http://localhost/'),
    });
    // Astro escapes attribute values; raw `</script>` must NOT appear inside
    // the data-server-events attribute. Either the JSON has no script tag,
    // or any script-like substring is escaped to &lt;/script&gt;.
    const match = html.match(/data-server-events="([^"]*)"/);
    expect(match, 'data-server-events attribute must be present').toBeTruthy();
    const attrValue = match![1];
    expect(attrValue.toLowerCase()).not.toContain('</script>');
    // The attribute must remain a parseable JSON array (after HTML-decoding).
    const decoded = attrValue
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#34;/g, '"');
    expect(() => JSON.parse(decoded)).not.toThrow();
  });
});
