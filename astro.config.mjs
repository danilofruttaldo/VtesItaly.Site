import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkAlert } from 'remark-github-blockquote-alert';

export default defineConfig({
  site: 'https://vtesitaly.com',
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
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
