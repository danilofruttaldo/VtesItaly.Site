# VtesItaly.Site

Official website for the Italian VTES (Vampire: The Eternal Struggle) community.

Built with [Astro 6](https://astro.build/) — static, fast, multilingual (IT/EN).

## Tech Stack

- **Astro 6** — static site generator
- **TypeScript 5.9** — type-safe data and utilities
- **Pagefind** — client-side search indexing
- **Sharp** — image processing
- **ESLint + Prettier** — linting and formatting
- **GitHub Actions** — CI/CD (audit → lint → format check → type check → build → deploy via SCP)

## Scripts

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server on port 4322                             |
| `npm run build`   | Astro build → stamp service worker → Pagefind index |
| `npm run preview` | Preview production build                            |
| `npm run check`   | Astro type checking                                 |
| `npm run lint`    | ESLint                                              |
| `npm run format`  | Prettier                                            |
| `npm run clean`   | Remove `dist/` and `.astro/`                        |

## Deployment

On push to `main`, the GitHub Actions workflow (`.github/workflows/deploy.yml`) runs audit, lint, format check, and build, then deploys the `dist/` folder to production via SCP over SSH.

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

Tournament standings are stored as JSON in `src/data/standings/` organized by event type (`ev/`, `gp/`, `league/`, `nc/`, `tour/`). Columns: rank, name, GW, VP, FVP, TP.

## License

See [LICENSE](LICENSE).
