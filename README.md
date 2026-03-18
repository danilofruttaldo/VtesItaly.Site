# VtesItaly.Site

Official website for the Italian VTES (Vampire: The Eternal Struggle) community.

Built with [Astro 6](https://astro.build/) — static, fast, multilingual (IT/EN).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static site is generated in `dist/`.

## Deployment

The site is deployed via GitHub Actions (`.github/workflows/deploy.yml`).
On push to `main`, it builds and syncs to the production server via rsync over SSH.

## Structure

```
src/
  components/    # Astro components (Header, Footer, Calendar, GpEdition, TourEdition, etc.)
  content/blog/  # Blog posts in Markdown (IT + EN variants)
  data/          # Cities, pages, twins, postcards data (TypeScript)
  i18n/          # Translation files (it.json, en.json)
  layouts/       # Base layout
  pages/         # IT pages (default) + en/ for English
  styles/        # Global CSS + page-specific stylesheets
  utils/         # i18n, calendar, standings, status utilities
public/
  fonts/         # Self-hosted Manrope font
  images/        # Headers, prince avatars, event images
  gp/            # Grand Prix assets (posters, galleries)
  nc/            # National Championship assets
  tour/          # Tour assets (stage images)
```

## Design Tokens

Typography is managed through CSS custom properties defined in `src/styles/global.css`:

- **Font sizes** — `--font-size-3xs` (0.65rem) through `--font-size-xxl` (clamp), plus `--font-size-md` (1.1rem) and `--font-size-lg` (1.3rem) for display text
- **Letter spacing** — `--tracking-tight` (-0.2px), `--tracking-wide` (0.3px), `--tracking-wider` (0.5px), `--tracking-widest` (1px)
- **Line height** — `--leading-none` (1) through `--leading-relaxed` (1.7)

All components use these tokens instead of hardcoded values.

## Content

Events are defined in blog post frontmatter (stages, events, standings). The site is the **source of truth** — the calendar component reads directly from content collections.

### Categories

- `grand-prix` — Grand Prix editions
- `tour` — Tour editions with stages
- `nazionale` — National Championship editions
- `comunita` — Community events (tournaments, contests, prereleases)
- `lega` — League seasons

## License

See [LICENSE](LICENSE).
