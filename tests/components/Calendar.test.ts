/* Calendar.astro static-render smoke. The event list is no longer embedded
 * in the page (it was the `data-server-events` attribute, XSS-tested since
 * commit e731108): the script fetches it from /api/calendar-events-<locale>.json,
 * whose content is checked in tests/utils/calendar.test.ts. */
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
    expect(html).toContain('data-events-url=');
    expect(html).toContain('data-cat-labels=');
  });

  it('exposes EN localised labels under /en/', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Calendar, {
      request: new Request('http://localhost/en/'),
    });
    expect(html).toContain('data-locale="en"');
  });

  it('points the script at the per-locale JSON endpoint instead of embedding the events', async () => {
    const container = await AstroContainer.create();
    const itHtml = await container.renderToString(Calendar, { request: new Request('http://localhost/') });
    const en = await container.renderToString(Calendar, { request: new Request('http://localhost/en/') });
    expect(itHtml).toContain('data-events-url="/api/calendar-events-it.json"');
    expect(en).toContain('data-events-url="/api/calendar-events-en.json"');
    expect(itHtml).not.toContain('data-server-events=');
  });

  it('declares no grid roles it cannot honour', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Calendar, { request: new Request('http://localhost/') });
    expect(html).not.toMatch(/role="(grid|row|columnheader|gridcell)"/);
  });
});
