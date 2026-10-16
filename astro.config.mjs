import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { sitemapDates, sitemapFilter } from './src/utils/sitemap.ts';

const lastModified = sitemapDates();

// sha256 of the one inline script left, the early language redirect in
// src/layouts/Base.astro. Astro hashes the scripts it bundles, not the
// `is:inline` ones: this one is hashed here from the same file the layout
// emits verbatim, so the two cannot drift apart.
const langRedirectHash =
  'sha256-' +
  createHash('sha256')
    .update(readFileSync(new URL('./src/scripts/lang-redirect.inline.js', import.meta.url), 'utf8'))
    .digest('base64');

export default defineConfig({
  site: 'https://vtesitaly.com',
  // The canonical form of every address has the trailing slash: canonical,
  // hreflang and sitemap already declare it, and internal links follow. Here
  // the dev server enforces it (it answers 404 to the slashless form), so a
  // link written without it shows up locally instead of costing a redirect in
  // production. The static build does not change: pages are already folders
  // with their index.html.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Out: the pages that declare noindex (community archive after page 1).
      filter: sitemapFilter,
      // <lastmod> from the content dates (see src/utils/sitemap.ts).
      serialize(item) {
        const date = lastModified.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ],
  // The four archon-* guides collapsed into one when Archon shipped its own
  // complete Italian documentation (2026-08): only the Italy-specific notes and
  // the judge guide (the one doc VEKN never translated) still earn a page.
  // The retired slugs are linked from Discord threads and indexed, so they keep
  // resolving instead of 404ing.
  redirects: {
    '/guide/archon-principi': '/guide/archon-italia/',
    '/guide/archon-giocatori': '/guide/archon-italia/',
    '/guide/archon-leghe': '/guide/archon-italia/',
    '/en/guides/archon-principi': '/en/guides/archon-italia/',
    '/en/guides/archon-giocatori': '/en/guides/archon-italia/',
    '/en/guides/archon-leghe': '/en/guides/archon-italia/',
  },
  prefetch: {
    prefetchAll: false,
    // `tap` covers both desktops (mousedown ~ 50ms head start) and mobiles
    // (touchstart fires before the click event), so touch users get a small
    // prefetch window where `hover` would give them nothing at all. We avoid
    // `viewport` because the community/event pages stack many cards above
    // the fold: viewport-prefetching them all on scroll burns mobile data.
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
    // No fenced code in the content: without Shiki there are no inline
    // styles in the HTML and no build warning about them and the CSP.
    syntaxHighlight: false,
  },
  // Content-Security-Policy written by Astro into every page as a
  // <meta http-equiv>, with the sha256 of each script it emits. Same sources
  // as the hand-written meta it replaces, minus 'unsafe-inline' for scripts:
  // every script is now a bundled module, except the early language redirect
  // whose hash is listed above. Styles keep 'unsafe-inline': components use
  // `style` attributes and the calendar builds some at runtime; with
  // 'unsafe-inline' among the resources Astro writes no style hashes, which
  // would cancel it.
  //
  // 'wasm-unsafe-eval' is for Pagefind, which runs its search index as
  // WebAssembly. static.krcg.org serves the card images in the demo guides.
  // frame-ancestors is absent because a meta CSP cannot carry it: it belongs
  // in the .htaccess header.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://stats.vtesitaly.com https://static.krcg.org",
        "font-src 'self'",
        "connect-src 'self' https://stats.vtesitaly.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'", 'https://stats.vtesitaly.com', "'wasm-unsafe-eval'"],
        hashes: [langRedirectHash],
      },
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    // Minify CSS with esbuild instead of lightningcss: lightningcss ships an
    // unsigned native module that Smart App Control blocks on the dev machine,
    // killing `astro build`. Same reason package.json aliases esbuild to
    // esbuild-wasm. Output is equivalent for these stylesheets.
    build: {
      cssMinify: 'esbuild',
      // Nothing inlined as data: URIs for scripts and fonts. Vite inlines
      // assets under 4 KB: a small module would become an inline script and a
      // small font a data: URL that `font-src 'self'` blocks, with the
      // preload in Base.astro pointing to a file the rule no longer uses.
      // Other files keep the usual Vite rule.
      assetsInlineLimit: (file) => (/\.(?:js|woff2)$/.test(file) ? false : undefined),
    },
  },
});
