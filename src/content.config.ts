import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const LOCALES = ['it', 'en'] as const;
const DEFAULT_LOCALE = 'it';

/* ── Shared field schemas ─────────────────────────────────── */

// External address (Archon, maps, venue site, streaming).
const httpUrl = z.string().regex(/^https?:\/\//, 'must be an absolute http(s) URL');
// Link target: external, or a file/page of the site (root-relative).
const linkUrl = z.string().regex(/^(https?:\/\/|\/)/, 'must be an http(s) URL or start with /');

const linkSchema = z.object({
  label: z.string(),
  url: linkUrl,
  locale: z.enum(LOCALES).optional(),
});

const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  mapUrl: httpUrl.optional(),
  siteUrl: httpUrl.optional(),
});

const venueFullSchema = z.object({
  name: z.string(),
  address: z.string(),
  mapUrl: httpUrl,
  siteUrl: httpUrl,
});

const eventSchema = z.object({
  name: z.string(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  time: z.string(),
  // Per-day venue override: set only when a session is held somewhere other
  // than the post-level `venue` (multi-venue weekends). Rendered inline with
  // the event in the Programma row, not as a separate note.
  venue: z.string().optional(),
  location: z.string().optional(),
  format: z.string().optional(),
  proxies: z.boolean().optional(),
  rounds: z.number().optional(),
  archonUrl: httpUrl.optional(),
  // Per-event standings: set on a side event (or on each tournament of a
  // multi-tournament weekend) so EventEdition can render one table per
  // tournament. The post-level `standingsUrl` stays the single-table case.
  standingsUrl: z.string().optional(),
  // Header of the last standings column. Defaults to RtP (Archon Rating
  // Points); set to 'TP' for tournaments run outside Archon.
  tpLabel: z.string().optional(),
  period: z.string().optional(),
  type: z.string().optional(),
  // Album of this tournament on foto.vtesitaly.com when it has its own (a side
  // event): EventEdition shows a preview linking to it, apart from the
  // post-level `album` of the main event.
  album: z.string().optional(),
});

const stageSchema = z
  .object({
    name: z.string(),
    number: z.number(),
    date: z.coerce.date(),
    cities: z.array(z.string()),
    time: z.string().optional(),
    venue: z.string().optional(),
    location: z.string().optional(),
    format: z.string().optional(),
    proxies: z.boolean().optional(),
    rounds: z.number().optional(),
    archonUrl: httpUrl.optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    hideDate: z.boolean().optional(),
    // The other states (completed, upcoming, future) come from the date: see
    // stageStatusesOn in src/utils/status.ts.
    cancelled: z.boolean().optional(),
    // Album of the stage on foto.vtesitaly.com: the stage card links to it.
    album: z.string().optional(),
    // Videos of the stage (a YouTube playlist): the stage card links to it.
    videos: httpUrl.optional(),
    // Strict: a leftover key (an old `status: 'cancelled'`) stops the build
    // instead of being dropped without a word.
  })
  .strict();

const pricingSchema = z.object({
  label: z.string(),
  early: z.string().optional(),
  regular: z.string(),
});

const scheduleSchema = z.object({
  label: z.string(),
  time: z.string(),
});

const hotelSchema = z.object({
  room: z.string(),
  price: z.string(),
});

/* ── Base fields (shared by all types) ────────────────────── */

const baseFields = {
  title: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  // Search-engine overrides for <title> and meta description. The excerpt is
  // also the card text and can run long; the snippet wants 50-160 characters
  // and the title, with the " | VTES Italy" suffix, at most 60.
  seoTitle: z.string().max(47).optional(),
  seoDescription: z.string().min(50).max(160).optional(),
  tags: z.array(z.string()).optional().default([]),
  locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
  featuredImage: z.string().optional(),
  poster: z.string().optional(),
  posterCaption: z.string().optional(),
  // CSS object-position for the card thumbnail / timeline image. Use when
  // the featured/poster is a wide-landscape composition whose subject would
  // be cropped out of the default centered square. Examples: 'left center',
  // 'top center'. Omitted = browser default (`50% 50%`, i.e. centered).
  imageAnchor: z.string().optional(),
  // Slug of the event's album on foto.vtesitaly.com (repo VtesItaly.Foto):
  // the page shows its photos from src/data/albums.json.
  album: z.string().optional(),
  notes: z.array(z.string()).optional().default([]),
  // Judging staff, one entry per judge. Rendered as a bulleted list.
  judges: z.array(z.string()).optional().default([]),
  links: z.array(linkSchema).optional().default([]),
  linksAfter: z.array(linkSchema).optional().default([]),
  highlight: z.object({ id: z.string(), label: z.string() }).optional(),
  highlightHtml: z.string().optional(),
  streamingLinks: z
    .array(z.object({ url: httpUrl, label: z.string() }))
    .optional()
    .default([]),
  pageLayout: z.enum(['auto', 'article']).optional().default('auto'),
  // Page hero override for community events in cities without a principato entry.
  cityHeader: z.string().optional(),
  // Same as `events[].tpLabel`, for the post-level `standingsUrl`.
  standingsTpLabel: z.string().optional(),
};

/* ── Per-type schemas ─────────────────────────────────────── */

// `earlyDeadline` is the printed label ("10 Aprile"); the date behind it
// decides which price column is active, so one never comes without the other.
function requireEarlyDeadlineDate(data: { earlyDeadline?: string; earlyDeadlineDate?: Date }, ctx: z.RefinementCtx) {
  if (data.earlyDeadline && !data.earlyDeadlineDate) {
    ctx.addIssue({
      code: 'custom',
      path: ['earlyDeadlineDate'],
      message: 'earlyDeadline needs earlyDeadlineDate (the day it ends), or the early price never expires.',
    });
  }
}

// Grand Prix & Nazionale: full event pages, same shape
const editionSchema = <C extends 'grand-prix' | 'nazionale'>(category: C) =>
  z
    .object({
      ...baseFields,
      category: z.literal(category),
      poster: z.string(),
      venue: venueFullSchema,
      events: z.array(eventSchema).min(1),
      pricing: z.array(pricingSchema),
      payment: z.string(),
      registration: z.string().optional(),
      contact: z.string(),
      hotel: z.array(hotelSchema),
      prizes: z.union([z.string(), z.array(z.string())]),
      // Optional at post level: multi-tournament pages carry the standings on the
      // matching `events[]` entry instead, so each table is titled with its own
      // tournament. Announcement posts have no standings at all yet.
      standingsUrl: z.string().optional(),
      // optional
      earlyDeadline: z.string().optional(),
      earlyDeadlineDate: z.coerce.date().optional(),
      hotelNote: z.string().optional(),
      schedule: z.array(scheduleSchema).optional().default([]),
      streamingUrl: httpUrl.optional(),
      streamingLabel: z.string().optional(),
      stages: z.array(stageSchema).optional(),
    })
    .superRefine(requireEarlyDeadlineDate);

const grandPrixSchema = editionSchema('grand-prix');

// European Championship: a historical edition, one page per year. No events
// (they would land in the calendar and the home timeline): the dates, the host
// city and the result live in plain fields, the final table in the body.
const europeoSchema = z.object({
  ...baseFields,
  category: z.literal('europeo'),
  endDate: z.coerce.date().optional(),
  city: z.string(),
  players: z.number().optional(),
  winner: z.string().optional(),
  // Only the year is known (the earliest editions): the archive shows it alone.
  dateApprox: z.boolean().optional(),
  // An edition with a full programme (the latest ones) uses the GP/NC event
  // page: venue, events with their standings, poster and links. The older
  // editions leave them empty and read as plain text.
  venue: venueSchema.optional(),
  events: z.array(eventSchema).optional(),
  schedule: z.array(scheduleSchema).optional().default([]),
  pricing: z.array(pricingSchema).optional().default([]),
  hotel: z.array(hotelSchema).optional().default([]),
  prizes: z.union([z.string(), z.array(z.string())]).optional(),
  registration: z.string().optional(),
  contact: z.string().optional(),
  payment: z.string().optional(),
  earlyDeadline: z.string().optional(),
  earlyDeadlineDate: z.coerce.date().optional(),
  hotelNote: z.string().optional(),
  streamingUrl: httpUrl.optional(),
  streamingLabel: z.string().optional(),
  stages: z.array(stageSchema).optional(),
  standingsUrl: z.string().optional(),
});
const nazionaleSchema = editionSchema('nazionale');

// Tour: multi-stage circuit
const tourSchema = z.object({
  ...baseFields,
  category: z.literal('tour'),
  stages: z.array(stageSchema).min(1),
  // optional
  rulesUrl: z.string().optional(),
  standingsUrl: z.string().optional(),
  stagesLabel: z.string().optional(),
  stageItemLabel: z.string().optional(),
  venue: venueSchema.optional(),
  events: z.array(eventSchema).optional(),
});

// Comunita: subtypes (league, event, article) determined by field presence.
// `articleOnly: true` is the explicit opt-out for posts that are pure prose
// with no venue/events/league data - without it, the superRefine below would
// reject a comunita post that lacks all event/league markers as "incomplete".
const comunitaSchema = z
  .object({
    ...baseFields,
    category: z.literal('comunita'),
    articleOnly: z.boolean().optional(),
    // event fields (optional - present for events)
    venue: venueSchema.optional(),
    events: z.array(eventSchema).optional().default([]),
    schedule: z.array(scheduleSchema).optional().default([]),
    pricing: z.array(pricingSchema).optional().default([]),
    earlyDeadline: z.string().optional(),
    earlyDeadlineDate: z.coerce.date().optional(),
    payment: z.string().optional(),
    hotel: z.array(hotelSchema).optional().default([]),
    hotelNote: z.string().optional(),
    prizes: z.union([z.string(), z.array(z.string())]).optional(),
    registration: z.string().optional(),
    contact: z.string().optional(),
    streamingUrl: httpUrl.optional(),
    streamingLabel: z.string().optional(),
    standingsUrl: z.string().optional(),
    standingsLabel: z.string().optional(),
    // league fields
    leagueStats: z.object({ players: z.number(), games: z.number(), tables: z.number() }).optional(),
    leagueTopLists: z
      .array(z.object({ label: z.string(), items: z.array(z.object({ name: z.string(), count: z.number() })) }))
      .optional()
      .default([]),
    leagueBonusPoints: z
      .array(z.object({ name: z.string(), description: z.string() }))
      .optional()
      .default([]),
    leagueRules: z
      .array(z.object({ acronym: z.string(), label: z.string(), description: z.string() }))
      .optional()
      .default([]),
    stages: z.array(stageSchema).optional(),
  })
  .superRefine((data, ctx) => {
    requireEarlyDeadlineDate(data, ctx);
    const isEvent = !!data.venue || (data.events?.length ?? 0) > 0;
    const isLeague = !!data.leagueStats;
    const isArticle = data.articleOnly === true;
    if (!isEvent && !isLeague && !isArticle) {
      ctx.addIssue({
        code: 'custom',
        path: ['articleOnly'],
        message:
          'comunita post must declare its subtype: set venue/events (event), leagueStats (league), or articleOnly: true (article).',
      });
    }
  });

// Contest / article: minimal fields
const contestSchema = z.object({
  ...baseFields,
  category: z.literal('contest'),
  standingsUrl: z.string().optional(),
  venue: venueSchema.optional(),
  events: z.array(eventSchema).optional(),
  stages: z.array(stageSchema).optional(),
});

/* ── Collection ───────────────────────────────────────────── */

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.discriminatedUnion('category', [
    grandPrixSchema,
    nazionaleSchema,
    europeoSchema,
    tourSchema,
    comunitaSchema,
    contestSchema,
  ]),
});

/* ── Guide collection ─────────────────────────────────────── */

const guideSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoria: z.enum(['iniziare', 'piattaforme', 'regole-formati', 'organizzare']),
  audience: z.array(z.enum(['giocatore', 'principe', 'judge', 'nuovi'])).min(1),
  ordine: z.number().default(100),
  versione: z.string().optional(),
  aggiornato: z.coerce.date(),
  autore: z.string().optional(),
  correlate: z.array(z.string()).optional(),
  locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
});

const guide = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guide' }),
  schema: guideSchema,
});

export const collections = { blog, guide };
