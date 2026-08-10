import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkAlert } from 'remark-github-blockquote-alert';

export default defineConfig({
  site: 'https://vtesitaly.com',
  integrations: [sitemap()],
  // The four archon-* guides collapsed into one when Archon shipped its own
  // complete Italian documentation (2026-08): only the Italy-specific notes and
  // the judge guide — the one doc VEKN never translated — still earn a page.
  // The retired slugs are linked from Discord threads and indexed, so they keep
  // resolving instead of 404ing.
  redirects: {
    '/guide/archon-principi': '/guide/archon-italia',
    '/guide/archon-giocatori': '/guide/archon-italia',
    '/guide/archon-leghe': '/guide/archon-italia',
    '/en/guides/archon-principi': '/en/guides/archon-italia',
    '/en/guides/archon-giocatori': '/en/guides/archon-italia',
    '/en/guides/archon-leghe': '/en/guides/archon-italia',
  },
  prefetch: {
    prefetchAll: false,
    // `tap` covers both desktops (mousedown ~ 50ms head start) and mobiles
    // (touchstart fires before the click event), so touch users get a small
    // prefetch window where `hover` would give them nothing at all. We avoid
    // `viewport` because the community/event pages stack many cards above
    // the fold — viewport-prefetching them all on scroll burns mobile data.
    defaultStrategy: 'tap',
  },
  image: {
    service: process.env.NODE_ENV !== 'production' ? passthroughImageService() : undefined,
  },
  markdown: {
    // astro 7 defaults to the Sätteri processor, which does not run remark
    // plugins. Keep the unified/remark pipeline (from @astrojs/markdown-remark)
    // so `remarkAlert` still renders GitHub-style `> [!NOTE]` callouts.
    processor: unified({ remarkPlugins: [remarkAlert] }),
  },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
