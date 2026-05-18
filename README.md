# VtesItaly.Site

[![coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/danilofruttaldo/VtesItaly.Site/main/.github/coverage-badge.json)](#)

Official website for the Italian VTES (Vampire: The Eternal Struggle) community.

Built with [Astro 6](https://astro.build/) — static, fast, multilingual (IT/EN).

## Tech Stack

- **Astro 6** — static site generator
- **TypeScript 5.9** — type-safe data and utilities
- **Zod** — runtime validation of post frontmatter (discriminated union on `category`) and standings JSON (per-dialect schemas)
- **Pagefind** — client-side search indexing (restricted to `<main data-pagefind-body>`)
- **Sharp** — image processing
- **ESLint + Prettier** — linting and formatting
- **Vitest 3 + @vitest/coverage-v8** — unit, component, and integration tests
- **Astro Container API** — render `.astro` components inside Vitest
- **Lighthouse CI** — accessibility/perf/SEO gating on every push to `main`
- **GitHub Actions** — single CI workflow: audit → lint → format → typecheck → tests → coverage badge refresh → build → integration smoke → size guard → Lighthouse → deploy via tar-pipe over SSH

## Scripts

| Command                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Dev server on port 4322                                 |
| `npm run build`         | Astro build → stamp service worker → Pagefind index     |
| `npm run preview`       | Preview production build                                |
| `npm run check`         | Astro type checking                                     |
| `npm run lint`          | ESLint                                                  |
| `npm run format`        | Prettier (write)                                        |
| `npm run format:check`  | Prettier (check only)                                   |
| `npm test`              | Warm content cache + Vitest (unit, schemas, components) |
| `npm run test:watch`    | Vitest watch mode                                       |
| `npm run test:coverage` | Vitest with v8 coverage                                 |
| `npm run test:build`    | `npm run build` + integration smoke against `dist/`     |
| `npm run clean`         | Remove `dist/` and `.astro/`                            |

`pretest` and `pretest:coverage` (auto-run before `npm test` / `npm run test:coverage`) execute `scripts/warm-content.mjs`, which makes sure `.astro/data-store.json` exists so `getCollection('blog')` returns real entries inside Vitest. Without it, Astro 6 + Vitest report the collection as empty (see [withastro/astro#7051](https://github.com/withastro/astro/issues/7051)). npm only fires `pre<exact-script-name>` hooks, so each test variant needs its own pre-hook entry.

## Deployment

`.github/workflows/deploy.yml` is a single workflow with three sequential jobs:

1. **`ci`** — runs on every push to `main` and on PRs. `npm ci` → `npm audit --omit=dev` → ESLint → Prettier check → `astro check` → `npm run test:coverage` (Vitest with v8 coverage gated at 90% lines/statements, 95% functions, 85% branches via `vitest.config.ts`) → on `main` pushes refreshes `.github/coverage-badge.json` from the `json-summary` reporter and commits back with `[skip ci]` only when the value changes → `astro build` (runs `scripts/build-thumbnails.mjs` as `prebuild` to emit 240² thumbnails for community/prince images that PostCard/CityCard serve at ≤120 px) → integration smoke against the staged `dist/` → 80 MB size guard. Uploads `dist/` as an artifact for the next jobs to reuse.
2. **`lighthouse`** — depends on `ci`. Downloads the `dist/` artifact and runs Lighthouse CI from `.github/lighthouserc.json` over 8 URLs (home IT/EN, principati, cartoline, comunita, current tour and nazionale editions, plus a long article). Accessibility ≥ 0.89, SEO ≥ 0.9, performance ≥ 0.75 are blocking errors; best-practices is a warning. The 0.75 performance gate landed after the November 2026 PostCard thumbnail + hero mobile-variant rollout dropped homepage LCP from ~3.6 s to ~3.0 s and CLS from 0.07 to 0 — bumping further would require critical-CSS inlining (Base.css + Calendar.css still block ~810 ms of render).
3. **`deploy`** — depends on both `ci` and `lighthouse`, and only on push (not on PR). Downloads the same `dist/` artifact and tar-pipes it over SSH to the production VPS. The host fingerprint is pinned via the `SSH_KNOWN_HOSTS` environment secret — no runtime `ssh-keyscan` MITM window.

Workflow-level `concurrency: deploy-vtesitaly-${{ github.ref }}` is per-ref so a Dependabot burst of PRs doesn't cancel each other in the queue; pushes to `main` collapse to a single group and the deploy job is the only thing that needs serialisation. `permissions: contents: read` scopes the default `GITHUB_TOKEN` to the minimum needed. Single workflow per push: one CI gate, one Lighthouse audit, one deploy — never duplicated.

## Security

Content-Security-Policy is set via a `<meta http-equiv>` in `src/layouts/Base.astro`. The policy is `default-src 'self'` with `'unsafe-inline'` carved out for scripts and styles (Astro injects inline scripts for view transitions, prefetch, and `define:vars` in several `is:inline` components) and `data:` allowed on `img-src` for inline SVG. External `<a href>` navigation to maps.google.com / archon.vekn.net / social media isn't restricted because CSP doesn't gate user-initiated navigation. `frame-ancestors` is intentionally absent — meta-tag CSP doesn't honour it, so clickjacking protection has to live in `.htaccess` on the VPS (out of repo, manually managed).

Even with `'unsafe-inline'`, the policy still blocks the most common stored-XSS payload vectors: loading external scripts, fonts, images and stylesheets, and form submissions to attacker-controlled origins. Defence in depth alongside the `escapeHtml` discipline in `src/utils/i18n.ts` and the `set:html` audit (`set:html` is only used on trusted compile-time-validated frontmatter, never on user input).

## Images

PostCard, CityCard and prince avatars render at 80–120 px but the source posters in `public/images/comunita/` and `public/images/principi/` are 1024²+. `scripts/build-thumbnails.mjs` (run as `prebuild` and idempotent via mtime check) emits `<name>-thumb.webp` at 240² for each, and `src/utils/image.ts::thumbFor()` swaps the path at render time, falling back to the original when no thumbnail exists yet — so dev iteration on a freshly-added image doesn't 404. Hero banners have a mirror system: `src/components/Hero.astro` picks up `header-home-m.{avif,webp}` (800w) and `-m-2x` (1600w) via `<source media="(max-width: 760px)">` when present, so mobile gets a 12 KB AVIF instead of a 84 KB desktop crop.

## PWA & Service Worker

Installable PWA. `public/sw.js` precaches the shell and serves pages network-first (cached fallback offline) and static assets cache-first. `scripts/stamp-sw.mjs` runs at build time and rewrites `CACHE_NAME = 'vtesitaly-__BUILD_TS__'` to a unique hash per build, so each deploy gets an isolated cache namespace and old CSS/JS/images can't leak across releases.

When CI publishes a new `sw.js`, the installed worker picks up the byte diff, precaches the new shell, then `skipWaiting()` + `clients.claim()` transfer control. At that point the inline script in `src/layouts/Base.astro` — wired to `updatefound` and `controllerchange` — shows a localised banner (IT/EN via `sw_update` in `src/i18n/`) with a **Reload** button. Clicking it calls `window.location.reload()`; the new cache is already active so the fresh content loads immediately. The banner is dismissible — users who skip it pick up the update on their next navigation.

## Testing

Tests live in `tests/` and split into four families:

- `tests/utils/**` — pure unit tests for `i18n`, `status`, `calendar`, `standings`, `anonymize`, `today`, `url` (97 tests). Setup file pins `process.env.TZ = 'UTC'` so tests are deterministic across local (Europe/Rome) and CI (UTC) machines.
- `tests/schemas/**` — every JSON in `src/data/standings/` is parsed against the dialect-aware Zod schema in `src/schemas/standings.ts`, and every post that declares `standingsUrl` must resolve to a file the runtime resolver can find (mirrors EventEdition/LeagueEdition/TourEdition's `includes()` match against the basename). Catches typos in player names, malformed score rows, and dangling references at test time.
- `tests/components/**` — Astro Container API renders the real `.astro` components against fixture posts pulled via `getCollection('blog')`. Covers `EventEdition`, `TourEdition`, `LeagueEdition`, `Calendar`, `PostCard`, `SearchOverlay` (incl. a DOM-parser regression locking the excerpt parser away from `innerHTML` so entity-encoded payloads cannot escape).
- `tests/integration/**` — post-build smoke against `dist/` (`vitest.integration.config.ts`): homepage, EN alternate with hreflang, sitemap shards covering both locales, Pagefind, og:image, IT/EN slug remap, size budget. Run via `npm run test:build`.

Total: **149 unit/component/schema tests** (in `npm run test:coverage` and `npm test`) + integration tests in `npm run test:build`.

## Structure

```
src/
  components/      # 20 Astro components (Calendar, EventEdition, TourEdition, LeagueEdition, PostCard, CityCard, Hero, etc.)
  content/blog/    # 64 blog posts in Markdown (IT + EN variants)
  content.config.ts # Content collection schema — discriminated union on category
  data/            # Cities, categories, pages, twins, postcards, standings (TS/JSON)
  i18n/            # Translation files (it.json, en.json)
  layouts/         # Base layout (CSP meta lives here)
  pages/           # 25 page files — IT (default) + en/ for English
  styles/          # Global CSS + per-edition stylesheets (tour, league, event, calendar)
  utils/           # i18n, calendar, standings, status, today, url, image (thumbFor)
public/
  fonts/           # Self-hosted Manrope font
  images/          # Headers, prince avatars (+ -thumb.webp siblings), event images
  gp/              # Grand Prix assets (posters, galleries)
  nc/              # National Championship assets
  tour/            # Tour assets (stage images)
```

`Calendar.astro`, `EventEdition.astro`, `LeagueEdition.astro` and `TourEdition.astro` keep their frontmatter, template and inline `<script>` in the `.astro` file but their stylesheets live in `src/styles/<edition>.css`. The split happened in November 2026 to drop each component below ~530 lines; the auto-scoping the original `<style>` block provided wasn't load-bearing because every selector was already prefixed (`.gp-`, `.le-`, `.te-`, `.cal__`).

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

Italian is the default locale (no prefix). English pages live under `/en/`.

## Content

Events are defined as Markdown blog posts with structured frontmatter (stages, events, standings, galleries). The site is the **source of truth** — the calendar component reads directly from content collections.

### Categories

Content uses a Zod discriminated union on `category` (`src/content.config.ts`). Each category has its own required/optional fields; shared fields (`venue`, `events`, `stages`, `standingsUrl`) are available as optional across all types for generic code paths (calendar, slug pages).

- `grand-prix` — Grand Prix editions (venue, events, pricing, standings)
- `nazionale` — National Championship editions (same structure as Grand Prix)
- `tour` — Tour editions with multi-stage circuits and standings
- `comunita` — Community events, leagues, and articles (flexible optional fields)
- `contest` — Contests and standalone articles (minimal fields)

### Standings

Tournament standings are stored as JSON in `src/data/standings/` organized by event type (`ev/`, `gp/`, `league/`, `nc/`, `tour/`). Three dialects are recognised by the Zod schema in `src/schemas/standings.ts`:

- **EventStanding** (`gp/`, `nc/`, `ev/`) — single-tournament results: `{ rank, name, gw, vp, fvp?, tp }`.
- **TourStanding** (`tour/`) — aggregate per-stage breakdown with optional `s1..sN`, `total`, `city`, `away`. Stage scores can be a number or a per-game breakdown object.
- **LeagueStanding** (`league/`) — different point system: `{ rank, name, games, bp, lp, pp, fp? }`.

The Week-of-Sabbat file (`ev/standings-wos-2025.json`) is a top-level object, not an array — handled separately by `WosStandings.astro` and intentionally excluded from the schema golden tests.

### Comunita subtypes

Community posts (`category: 'comunita'`) cover three distinct subtypes determined by field presence and validated by a `superRefine` in `src/content.config.ts`:

- **Event** — has `venue` or non-empty `events` array.
- **League** — has `leagueStats`.
- **Article** — pure prose, must declare `articleOnly: true` explicitly.

A comunita post that doesn't match any of these is a build-time error (it's almost always a forgotten field, not an intentional state).

## License

See [LICENSE](LICENSE).
