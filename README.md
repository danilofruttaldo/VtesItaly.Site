# VtesItaly.Site

Official website for the Italian VTES (Vampire: The Eternal Struggle) community.

Built with [Astro](https://astro.build/) — static, fast, multilingual (IT/EN).

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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_GOOGLE_CALENDAR_API_KEY` | Google Calendar API key (restricted to Calendar API + referrer) |

## Structure

```
src/
  components/    # Astro components (Header, Footer, Calendar, etc.)
  content/blog/  # Blog posts (MDX/MD)
  data/          # Cities and pages data (TypeScript)
  i18n/          # Translation files (IT/EN)
  layouts/       # Base layout
  pages/         # IT pages (default) + en/ for English
  styles/        # Global CSS with design tokens
  utils/         # i18n utilities
public/images/   # Static assets (headers, prince avatars, event images)
```

## License

See [LICENSE](LICENSE).
