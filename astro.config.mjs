import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkAlert } from 'remark-github-blockquote-alert';

export default defineConfig({
  site: 'https://vtesitaly.com',
  integrations: [sitemap()],
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
    remarkPlugins: [remarkAlert],
  },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
