import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wp.vtesitaly.com',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    service: process.env.NODE_ENV !== 'production' ? passthroughImageService() : undefined,
  },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {},
});
