# VtesItaly.Site

[![coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/danilofruttaldo/VtesItaly.Site/main/.github/coverage-badge.json)](#)

Official website for the Italian VTES (Vampire: The Eternal Struggle) community.

Built with [Astro 7](https://astro.build/): static, fast, multilingual (IT/EN).

## Tech Stack

- **Astro 7**: static site generator
- **TypeScript 6**: type-safe data and utilities. ⚠️ **Pinned to 6.x on purpose: `astro check` does not run on 7.** Tried on 2026-08-15 with 7.0.2: the native Go compiler does not yet expose the programmatic API `astro check` relies on, and says so with an explicit error (see [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321)). ⚠️ The build stays green either way, so the upgrade looks successful while the typecheck is silently dead. Keep the `^6` range when updating dependencies by hand.
- **Zod**: runtime validation of post frontmatter (discriminated union on `category`) and standings JSON (per-dialect schemas)
- **Pagefind**: client-side search indexing (restricted to `<main data-pagefind-body>`)
- **Sharp**: image processing
- **ESLint + Prettier**: linting and formatting
- **Vitest 5 + @vitest/coverage-v8**: unit, component, and integration tests
- **Astro Container API**: render `.astro` components inside Vitest
- **Lighthouse CI**: accessibility/perf/SEO gating on every push to `main`
- **GitHub Actions**: single CI workflow: audit, lint, format, typecheck, tests, build, integration smoke, site-wide page and link checks, size guard, Lighthouse, release-directory deploy over SSH with automatic rollback, post-deploy smoke test, coverage badge refresh
- **Dependencies**: updated by hand (no Dependabot); `audit.yml` runs `npm audit --audit-level=high` every Monday and fails with GitHub's e-mail on a high-severity advisory

Node: `>=24.11.0` (`engines` in `package.json`). `.nvmrc` pins the major (24) for nvm/fnm and for CI, which reads it through `setup-node`.

## Scripts

| Command                 | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev`           | Dev server on port 4322                                                                       |
| `npm run build`         | `fetch-albums.mjs`, thumbnails, poster variants (`prebuild`), Astro build, stamp SW, Pagefind |
| `npm run preview`       | Preview production build                                                                      |
| `npm run check`         | Astro type checking                                                                           |
| `npm run lint`          | ESLint                                                                                        |
| `npm run format`        | Prettier (write)                                                                              |
| `npm run format:check`  | Prettier (check only)                                                                         |
| `npm test`              | Warm content cache + Vitest (unit, schemas, components)                                       |
| `npm run test:watch`    | Vitest watch mode                                                                             |
| `npm run test:coverage` | Vitest with v8 coverage                                                                       |
| `npm run test:build`    | `npm run build` + integration smoke against `dist/`                                           |
| `npm run check:pages`   | Site-wide checks on every page in `dist/` (`--list` for details)                              |
| `npm run check:links`   | Internal link check on `dist/`, no server needed                                              |
| `npm run check:dist`    | Both of the above                                                                             |
| `npm run smoke`         | Smoke test against https://vtesitaly.com (or a URL passed as argument)                        |
| `npm run ci:verify`     | Everything the `ci` job runs, in one command                                                  |
| `npm run clean`         | Remove `dist/` and `.astro/`                                                                  |
| `npm run albums`        | Refresh the committed copy of the photo archive index (CI does it after every Foto update)    |

`prebuild` (auto-run before `npm run build`) executes `scripts/fetch-albums.mjs` (event galleries come from the albums of https://foto.vtesitaly.com, repo VtesItaly.Foto: a post names one with `album:`), `scripts/build-thumbnails.mjs` and `scripts/build-poster-variants.mjs`, both idempotent via mtime checks (see [Images](#images)).

`pretest` and `pretest:coverage` (auto-run before `npm test` / `npm run test:coverage`) execute `scripts/warm-content.mjs`, which makes sure `.astro/data-store.json` exists so `getCollection('blog')` returns real entries inside Vitest. Without it, Astro + Vitest report the collection as empty (see [withastro/astro#7051](https://github.com/withastro/astro/issues/7051)). npm only fires `pre<exact-script-name>` hooks, so each test variant needs its own pre-hook entry.

## Deployment

`.github/workflows/deploy.yml` is a single workflow. Triggers: push to `main`, manual `workflow_dispatch` and the `foto-updated` `repository_dispatch` from VtesItaly.Foto. All jobs run on `ubuntu-24.04`, pinned rather than `ubuntu-latest`, which moves to a newer image without notice.

1. **`test`** and **`ci`**, in parallel on every push to `main`, so lighthouse starts as soon as `dist/` exists. `test`: `npm ci`, `npm audit --audit-level=high`, ESLint, Prettier check, `astro check`, `npm run test:coverage` (Vitest with v8 coverage gated at 90% lines/statements, 95% functions, 85% branches via `vitest.config.ts`); on `main` it uploads the coverage summary. `ci`: `npm ci`, `astro build` (with the `prebuild` image steps), integration smoke against the staged `dist/`, site-wide page checks and internal link check (see [Testing](#testing)), 80 MB size guard. Uploads `dist/` as an artifact for the next jobs to reuse.
2. **`lighthouse`**: depends on `ci`. Runs Lighthouse CI from `.github/lighthouserc.json` over 8 URLs (home IT/EN, principati, cartoline, comunita, current tour and nazionale editions, plus a long article), one matrix job per URL in parallel on the `dist/` artifact: `ci` reads the URL list from the config, and each job narrows a copy of it to its own URL (3 runs, median). In a single job the 8 URLs took ~11 min. Accessibility ≥ 0.95 (all 8 pages scored 1.0 locally on 2026-10-24), SEO ≥ 0.9, performance ≥ 0.75 are blocking errors; best-practices is a warning. The 0.75 performance gate landed after the May 2026 PostCard thumbnail + hero mobile-variant rollout dropped homepage LCP from ~3.6 s to ~3.0 s and CLS from 0.07 to 0. Bumping further would require critical-CSS inlining or deferring the Calendar bundle on the homepage. `throttlingMethod: devtools` is pinned in the LHCI config: the default `simulate` mode multiplies its CPU-slowdown factor by a `benchmarkIndex` measured at runtime, so the first URL on a cold Ubuntu runner gets a 20 %-slower benchmark than later URLs and its TBT explodes (the same `/` page that scored 0.73 on a cold run scores 0.98 as `/en/` once the runner warms up). `devtools` applies a fixed multiplier at the Chrome level, removing the variance source.
3. **`deploy`**: depends on `test`, `ci` and every `lighthouse` job, and runs only for `refs/heads/main` (`if: github.ref == 'refs/heads/main'`), in the `vtesitaly` environment. Downloads the same `dist/` artifact, uploads it over SSH into a fresh release directory and swaps it in as `public_html` (see [Releases and rollback](#releases-and-rollback)), then runs `scripts/smoke-test.sh` against https://vtesitaly.com from the runner. If the smoke test fails, the previous release is put back automatically. The host fingerprint must be pinned via the `SSH_KNOWN_HOSTS` environment secret: the job fails if it is missing, there is no runtime `ssh-keyscan` fallback (it would trust whoever answers the first connection).
4. **`coverage-badge`**: after a successful deploy on `main`, regenerates `.github/coverage-badge.json` from the coverage summary and commits it back with `[skip ci]` only when the value changes. `continue-on-error` and its own concurrency group: a rejected push never fails the pipeline, and two runs never push at the same time. It checks out the tip of `main` and retries once with a rebase if `main` moved.
5. **`albums-snapshot`**: on `main` (push, the `foto-updated` dispatch from VtesItaly.Foto, or a manual run), refreshes `src/data/albums.json` from foto.vtesitaly.com and commits it back with `[skip ci]` only when the index changed, so a post can name a new album without running `npm run albums` by hand. On a dispatch it waits for the same `albums_sha256` as the build. When a push or manual run finds the index changed, a Foto update was not absorbed (its rebuild was cancelled by the push, or never sent): it also sends the `foto-updated` dispatch itself, with the hash of the index it read. A `foto-updated` run never does, so there is no loop. `continue-on-error`, own concurrency group, checkout of the tip of `main` and one rebase retry, like `coverage-badge`.

Concurrency is per job, not per workflow. `test`, `ci` and `lighthouse` use `cancel-in-progress: true` per ref (per ref and URL for `lighthouse`), so a newer commit supersedes an in-flight check. `deploy` has a single group (`deploy-vtesitaly-production`) with `cancel-in-progress: false`: a deploy is never killed between upload, swap and confirmation, and a newer one waits for it. `permissions: contents: read` scopes the default `GITHUB_TOKEN`; only `coverage-badge` and `albums-snapshot` get `contents: write`.

Required on the `vtesitaly` environment: secrets `SSH_PRIVATE_KEY` and `SSH_KNOWN_HOSTS` (generate the latter with `ssh-keyscan -p $PORT $HOST`), variables `SSH_USER`, `SSH_HOST`, `SSH_PORT`.

### Hosting

vtesitaly.com is served by Apache on **SupportHost shared hosting** (cPanel, CloudLinux), as the privacy page states. Matomo (`stats.vtesitaly.com`) and the GP 2025 site have their own document roots outside `public_html`, so the deploy never touches them.

The `.htaccess` is versioned in [`public/.htaccess`](public/.htaccess) and published with the site: edit it there, never on the server, because the next deploy replaces the live copy. It sets the security headers with `Header always set` (so they apply to 301 and 404 responses too), a complementary CSP header, `Cache-Control` (`/_astro/` one year `immutable`, images and PDFs 7 days (`max-age=604800`), everything else `no-cache`), the real 404 pages (`/404.html`, `/en/404/index.html` under `/en/`), and the 301s for retired slugs and for paths of older site versions. Block-by-block explanation in [`docs/htaccess.md`](docs/htaccess.md).

### Releases and rollback

Each deploy is extracted into `~/releases/<sha>` on the hosting, never into the live directory. The job copies the server-only `.well-known/` (AutoSSL challenges) into it, then swaps it in with two renames: the old `public_html` becomes `~/releases/prev-<UTC timestamp>`. Files removed from the site therefore disappear with the next release. A marker (`~/releases/.ultima-precedente`) ties the swap to the commit until the smoke test confirms it; on failure, the rollback step restores that run's previous release and keeps the broken one as `~/releases/fallita-<UTC timestamp>`. The five most recent `prev-*` releases are kept. Design, manual rollback and housekeeping: [`docs/deploy-atomico.md`](docs/deploy-atomico.md).

### Smoke test

`scripts/smoke-test.sh [base-url]` runs after every deploy (and locally with `npm run smoke`). About thirty sequential requests, with a pause between them: home with retries, one page per section in IT and EN with the trailing slash (checking `<html lang>` so a soft 404 serving the home doesn't pass), `sitemap-index.xml`, `robots.txt`, the Apache trailing-slash 301 on `/principati`, and the `.htaccess` behaviour: a real 404 in IT and EN, `Cache-Control` on HTML and on a `/_astro/` asset, security headers on a 301, and the 301s for a retired slug and for legacy paths (each followed to a 200). If the hosting firewall answers with its challenge page ("One moment, please") it fails with a dedicated message. Every check is blocking.

## Security

Content-Security-Policy is generated by Astro's `security.csp` (`astro.config.mjs`) as a `<meta http-equiv>` in every page, with a `sha256` hash for each inline script. Script `'unsafe-inline'` is gone: every script is a bundled module, page data travels in `data-*` attributes, and Matomo is `src/scripts/matomo.ts`. The one inline script left is the early language redirect (`src/scripts/lang-redirect.inline.js`), which must run before first paint: Astro does not hash `is:inline` scripts, so `astro.config.mjs` hashes that file itself and passes it in `scriptDirective.hashes`. Style `'unsafe-inline'` stays (inline `style` attributes). The policy is `default-src 'self'`, with `https://stats.vtesitaly.com` (self-hosted Matomo) allowed for scripts, images and connections, `https://static.krcg.org` for card images, `data:` on `img-src` for inline SVG, `object-src 'none'` and `'wasm-unsafe-eval'` for Pagefind. `frame-ancestors` cannot be set from a meta tag: it is sent as a header by `public/.htaccess`. Adding a new external origin means changing `astro.config.mjs`. External `<a href>` navigation to maps.google.com / archon.vekn.net / social media isn't restricted because CSP doesn't gate user-initiated navigation.

`frame-ancestors` cannot live in a meta CSP (browsers ignore it there), so clickjacking protection is an HTTP header in `public/.htaccess`: `X-Frame-Options: SAMEORIGIN` plus a complementary CSP header with `frame-ancestors 'self'`, `object-src 'none'` and `base-uri 'self'`. When both a header and a meta CSP are present the browser enforces both, so the header must not repeat `script-src` without the build's hashes. Details in [`docs/htaccess.md`](docs/htaccess.md).

`npm run check:pages` verifies on every build that each inline executable script matches a hash in the page's CSP, whenever the CSP carries hashes. Defence in depth alongside the `escapeHtml` discipline in `src/utils/i18n.ts` and the `set:html` audit (`set:html` is only used on trusted compile-time-validated frontmatter, never on user input).

## Images

PostCard, CityCard and prince avatars render at 80 to 120 px but the source posters in `public/images/comunita/` and `public/images/principi/` are 1024²+. `scripts/build-thumbnails.mjs` (run as `prebuild`, idempotent via mtime check) emits `<name>-thumb.webp` at 240² for each, and `src/utils/image.ts::thumbFor()` swaps the path at render time, falling back to the original when no thumbnail exists yet, so dev iteration on a freshly added image doesn't 404.

`scripts/build-poster-variants.mjs` (also `prebuild`) emits `<name>-<w>w.webp` width variants for every image referenced by a `poster:` field in the blog content, and `responsiveImage()` in `src/utils/image.ts` builds a `srcset` from the variants that exist. The same script writes `<name>-og.jpg` (JPEG, at most 1200 px wide) for every poster and `featuredImage`, and `ogImage()` in `src/utils/og.ts` shares that file as `og:image` instead of the WebP, which some link previewers still skip. The variants are git-ignored and rebuilt on every build. `src/components/PageHero.astro` adds AVIF/WebP `<source>` sets for the section headers when the files exist.

The card images of the guides are local WebP copies in `public/images/krcg/` (committed), so the guides don't depend on static.krcg.org and the CSP allows no third-party image origin. `node scripts/fetch-guide-cards.mjs` (by hand, not in the build) downloads every card the guides reference, rewrites any `https://static.krcg.org/card/...` link to the local copy, and refreshes the existing copies from KRCG.

## PWA & Service Worker

Installable PWA. `public/sw.js` precaches the shell and serves pages network-first (cached fallback offline) and static assets cache-first. `scripts/stamp-sw.mjs` runs at build time and rewrites `CACHE_NAME = 'vtesitaly-__BUILD_TS__'` with the short git SHA, so each commit gets an isolated cache namespace (redeploying the same commit reuses it) and old CSS/JS/images can't leak across releases.

When CI publishes a new `sw.js`, the installed worker picks up the byte diff, precaches the new shell, then `skipWaiting()` + `clients.claim()` transfer control. At that point `src/scripts/sw-register.ts`, a bundled module imported by `src/layouts/Base.astro` and wired to `controllerchange`, shows a localised banner (IT/EN via `sw_update` in `src/i18n/`) with a **Reload** button. Clicking it calls `window.location.reload()`; the new cache is already active so the fresh content loads immediately. The banner is dismissible: users who skip it pick up the update on their next navigation. `sw.js` must be served with `Cache-Control: no-cache`, or browsers may keep the old worker (it is, see `public/.htaccess`). The only inline script left in the layout is the language redirect (`src/scripts/lang-redirect.inline.js`, run before the body is parsed); everything else ships as hashed modules, so the CSP needs no `'unsafe-inline'` for scripts.

## Testing

Tests live in `tests/` and split into four families:

- `tests/utils/**`: pure unit tests for `i18n`, `status`, `calendar`, `standings`, `anonymize`, `today`, `url`, `image`. Setup file pins `process.env.TZ = 'UTC'` so tests are deterministic across local (Europe/Rome) and CI (UTC) machines.
- `tests/schemas/**`: every JSON in `src/data/standings/` is parsed against the dialect-aware Zod schema in `src/schemas/standings.ts`, and every post that declares `standingsUrl` must resolve to a file the runtime resolver can find (mirrors EventEdition/LeagueEdition/TourEdition's `includes()` match against the basename). Catches typos in player names, malformed score rows, and dangling references at test time.
- `tests/components/**`: Astro Container API renders the real `.astro` components against fixture posts pulled via `getCollection('blog')`. Covers `EventEdition`, `TourEdition`, `LeagueEdition`, `Calendar`, `PostCard`, `SearchOverlay` (incl. a DOM-parser regression locking the excerpt parser away from `innerHTML` so entity-encoded payloads cannot escape).
- `tests/integration/**`: post-build smoke against `dist/` (`vitest.integration.config.ts`): homepage, EN alternate with hreflang, sitemap shards covering both locales, Pagefind, og:image, IT/EN slug remap, size budget. Run via `npm run test:build`.

### Site-wide checks on dist

Lighthouse looks at 8 URLs and the integration smoke at a few files. Two scripts walk every file in `dist/` after the build, in CI and via `npm run check:dist`:

- `scripts/check-pages.mjs`, on every page except Astro's redirect stubs. Blocking: missing title or description, not exactly one `h1`, missing `lang`, canonical missing, off-origin, without trailing slash or pointing to a missing page, hreflang alternates pointing to files that don't exist in `dist/`, `x-default` not equal to the IT version, any em dash (U+2014) in the HTML, `<img>` without `alt` (empty `alt` is fine: decorative), and inline executable scripts without a matching `sha256` in the CSP meta (only when the CSP carries hashes). Warnings only: title over 60 characters, description outside 50 to 160.
- `scripts/check-links.mjs`: every internal `href`/`src`/`srcset` (plus same-origin absolute URLs such as `og:image`) resolved the way Apache serves `public_html`. Blocking: broken targets, and links to a directory without the trailing slash (they cost a 301). Missing `#fragment` targets are warnings. External links are not checked.

Both follow the same rule: accepted cases go in a `KNOWN` list inside the script, page by page with the reason. A new page with the same defect still fails, and an entry that no longer matches any page fails too (expired exception), so the list can't silently grow or rot. Fix the template first; don't loosen the checks.

## Structure

```
src/
  components/      # Astro components (Calendar, EventEdition, TourEdition, LeagueEdition, PostCard, CityCard, PageHero, etc.)
  content/blog/    # Blog posts in Markdown (IT + EN variants)
  content.config.ts # Content collection schema: discriminated union on category
  data/            # Cities, categories, pages, twins, postcards, standings (TS/JSON)
  i18n/            # Translation files (it.json, en.json)
  layouts/         # Base layout (CSP meta lives here)
  pages/           # Page files: IT (default) + en/ for English
  styles/          # Global CSS + per-edition stylesheets (tour, league, event, calendar)
  utils/           # i18n, calendar, standings, status, today, url, image (thumbFor, responsiveImage)
public/            # Static files copied as-is, including .htaccess
  fonts/           # Self-hosted Manrope font
  images/          # Headers, prince avatars (+ -thumb.webp siblings), event images
  gp/              # Grand Prix assets (posters, galleries)
  nc/              # National Championship assets
  tour/            # Tour assets (stage images)
scripts/           # Build steps (thumbnails, poster variants, SW stamp), dist checks, smoke test
docs/              # Hosting notes: .htaccess explained, release-directory deploy
```

`Calendar.astro`, `EventEdition.astro`, `LeagueEdition.astro` and `TourEdition.astro` keep their frontmatter, template and inline `<script>` in the `.astro` file but their stylesheets live in `src/styles/`. The split happened in May 2026 to drop each component below ~530 lines; the auto-scoping the original `<style>` block provided wasn't load-bearing because every selector was already prefixed (`.gp-`, `.le-`, `.te-`, `.cal__`).

## Pages

| Section               | IT             | EN                           |
| --------------------- | -------------- | ---------------------------- |
| Home                  | `/`            | `/en/`                       |
| Principati / Domains  | `/principati/` | `/en/domains/`               |
| Italian Tour          | `/tour/`       | `/en/tour/`                  |
| Grand Prix            | `/grand-prix/` | `/en/grand-prix/`            |
| Nazionale             | `/nazionale/`  | `/en/national-championship/` |
| Cartoline / Postcards | `/cartoline/`  | `/en/postcards/`             |
| Gemelli / Twins       | `/gemelli/`    | `/en/twins/`                 |
| Comunità / Community  | `/comunita/`   | `/en/community/`             |

Italian is the default locale (no prefix). English pages live under `/en/`. Canonical URLs always end with a trailing slash.

## Content

Events are defined as Markdown blog posts with structured frontmatter (stages, events, standings, galleries). The site is the **source of truth**: the calendar component reads directly from content collections.

### Categories

Content uses a Zod discriminated union on `category` (`src/content.config.ts`). Each category has its own required/optional fields; shared fields (`venue`, `events`, `stages`, `standingsUrl`) are available as optional across all types for generic code paths (calendar, slug pages).

- `grand-prix`: Grand Prix editions (venue, events, pricing, standings)
- `nazionale`: National Championship editions (same structure as Grand Prix)
- `tour`: Tour editions with multi-stage circuits and standings
- `comunita`: Community events, leagues, and articles (flexible optional fields)
- `contest`: Contests and standalone articles (minimal fields)

### Standings

Tournament standings are stored as JSON in `src/data/standings/` organized by event type (`ev/`, `gp/`, `league/`, `nc/`, `tour/`). Three dialects are recognised by the Zod schema in `src/schemas/standings.ts`:

- **EventStanding** (`gp/`, `nc/`, `ev/`): single-tournament results: `{ rank, name, gw, vp, fvp?, tp }`.
- **TourStanding** (`tour/`): aggregate per-stage breakdown with optional `s1..sN`, `total`, `city`, `away`. Stage scores can be a number or a per-game breakdown object.
- **LeagueStanding** (`league/`): different point system: `{ rank, name, games, bp, lp, pp, fp? }`.

The Week-of-Sabbat file (`ev/standings-wos-2025.json`) is a top-level object, not an array: handled separately by `WosStandings.astro` and intentionally excluded from the schema golden tests.

### Comunita subtypes

Community posts (`category: 'comunita'`) cover three distinct subtypes determined by field presence and validated by a `superRefine` in `src/content.config.ts`:

- **Event**: has `venue` or non-empty `events` array.
- **League**: has `leagueStats`.
- **Article**: pure prose, must declare `articleOnly: true` explicitly.

A comunita post that doesn't match any of these is a build-time error (it's almost always a forgotten field, not an intentional state).

## License

See [LICENSE](LICENSE).
