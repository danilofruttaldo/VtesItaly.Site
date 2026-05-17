/* PostCard emits the temporal wire format the runtime script in Base.astro
 * relies on: a `data-date` ISO attribute and an always-rendered (initially
 * hidden) highlight badge. The runtime cannot recompute "next event" against
 * the user's real today if these markers go missing, so we lock them down. */
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import PostCard from '../../src/components/PostCard.astro';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

async function render(props: Record<string, unknown>) {
  return container.renderToString(PostCard, {
    props,
    request: new Request('http://localhost/'),
  });
}

describe('PostCard temporal markers', () => {
  it('emits data-date as local-anchored YYYY-MM-DD when a date is provided', async () => {
    // Build the date from local-time components so the assertion matches what
    // PostCard derives via getFullYear/Month/Date.
    const date = new Date(2026, 4, 17); // May 17 2026 local midnight
    const html = await render({ href: '/foo/', title: 'X', date });
    expect(html).toContain('data-date="2026-05-17"');
  });

  it('omits data-date when no date is provided', async () => {
    const html = await render({ href: '/foo/', title: 'No date' });
    expect(html).not.toContain('data-date=');
  });

  it('renders the highlight badge hidden when highlightLabel is set but highlight is false', async () => {
    const html = await render({
      href: '/foo/',
      title: 'X',
      highlightLabel: 'PROSSIMO',
      highlight: false,
    });
    expect(html).toMatch(/<span class="post-card__highlight-badge"[^>]*\bhidden\b[^>]*>\s*PROSSIMO\s*<\/span>/);
  });

  it('renders the highlight badge visible when highlight is true', async () => {
    const html = await render({
      href: '/foo/',
      title: 'X',
      highlightLabel: 'PROSSIMO',
      highlight: true,
    });
    expect(html).toMatch(/<span class="post-card__highlight-badge"[^>]*>\s*PROSSIMO\s*<\/span>/);
    // No `hidden` attribute on the badge when highlight is true.
    expect(html).not.toMatch(/post-card__highlight-badge"[^>]*\bhidden\b/);
  });

  it('applies the hidden attribute on the anchor when hidden=true', async () => {
    const html = await render({
      href: '/foo/',
      title: 'Off-window card',
      date: new Date(2026, 0, 1),
      hidden: true,
    });
    expect(html).toMatch(/<a[^>]*class="post-card"[^>]*\bhidden\b/);
  });
});
