# VtesItaly.Site

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
- **GitHub Actions** — single CI workflow: audit → lint → format → typecheck → tests → build → integration smoke → size guard → Lighthouse → deploy via tar-pipe over SSH

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

`pretest` (auto-runs before `npm test`) executes `scripts/warm-content.mjs`, which makes sure `.astro/data-store.json` exists so `getCollection('blog')` returns real entries inside Vitest. Without it, Astro 6 + Vitest report the collection as empty (see [withastro/astro#7051](https://github.com/withastro/astro/issues/7051)).

## Deployment

`.github/workflows/deploy.yml` is a single workflow with three sequential jobs:

1. **`ci`** — runs on every push to `main`. `npm ci` → `npm audit --omit=dev` → ESLint → Prettier check → `astro check` → Vitest (unit + schemas + components) → `astro build` → integration smoke against the staged `dist/` → 80 MB size guard. Uploads `dist/` as an artifact for the next jobs to reuse.
2. **`lighthouse`** — depends on `ci`. Downloads the `dist/` artifact and runs Lighthouse CI from `.github/lighthouserc.json`. Accessibility ≥ 0.9, performance ≥ 0.8, SEO ≥ 0.9 are blocking errors; best-practices is a warning.
3. **`deploy`** — depends on both `ci` and `lighthouse`. Downloads the same `dist/` artifact and tar-pipes it over SSH to the production VPS. No re-build.

Workflow-level `concurrency: deploy-vtesitaly` serialises overlapping pushes to protect the shared hosting; `permissions: contents: read` scopes the default `GITHUB_TOKEN` to the minimum needed. Single workflow per push: one CI gate, one Lighthouse audit, one deploy — never duplicated.

## Testing

Tests live in `tests/` and split into four families:

- `tests/utils/**` — pure unit tests for `i18n`, `status`, `calendar`, `standings`, `anonymize` (58 tests). Setup file pins `process.env.TZ = 'UTC'` so tests are deterministic across local (Europe/Rome) and CI (UTC) machines.
- `tests/schemas/**` — golden validation: every JSON in `src/data/standings/` is parsed against the dialect-aware Zod schema in `src/schemas/standings.ts` (23 tests). Catches typos in player names or malformed score rows at test time.
- `tests/components/**` — Astro Container API renders the real `.astro` components against fixture posts pulled via `getCollection('blog')`. Covers `EventEdition`, `TourEdition`, `LeagueEdition`, `Calendar`, `SearchOverlay`, plus an XSS regression test for the inline excerpt sanitiser introduced in commit `e731108` (13 tests).
- `tests/integration/**` — post-build smoke against `dist/` (`vitest.integration.config.ts`): homepage, EN alternate with hreflang, sitemap, Pagefind, og:image, IT/EN slug remap, size budget. Run via `npm run test:build`.

Total: **101 unit/component tests** (in `npm test`) + **8 integration tests** (in `npm run test:build`).

## Structure

```
src/
  components/      # 17 Astro components (Calendar, EventEdition, TourEdition, LeagueEdition, etc.)
  content/blog/    # 62 blog posts in Markdown (IT + EN variants)
  content.config.ts # Content collection schema — discriminated union on category
  data/            # Cities, categories, pages, twins, postcards, standings (TS/JSON)
  i18n/            # Translation files (it.json, en.json)
  layouts/         # Base layout
  pages/           # 21 pages — IT (default) + en/ for English
  styles/          # Global CSS + page-specific stylesheets
  utils/           # i18n, calendar, standings, status, URL utilities
public/
  fonts/           # Self-hosted Manrope font
  images/          # Headers, prince avatars, event images
  gp/              # Grand Prix assets (posters, galleries)
  nc/              # National Championship assets
  tour/            # Tour assets (stage images)
```

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
