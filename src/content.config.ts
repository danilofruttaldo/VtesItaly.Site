import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const LOCALES = ['it', 'en'] as const;
const DEFAULT_LOCALE = 'it';

/* ── Shared field schemas ─────────────────────────────────── */

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
  locale: z.enum(LOCALES).optional(),
});

const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  mapUrl: z.string().optional(),
  siteUrl: z.string().optional(),
});

const venueFullSchema = z.object({
  name: z.string(),
  address: z.string(),
  mapUrl: z.string(),
  siteUrl: z.string(),
});

const eventSchema = z.object({
  name: z.string(),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  time: z.string(),
  format: z.string().optional(),
  proxies: z.boolean().optional(),
  rounds: z.number().optional(),
  archonUrl: z.string().optional(),
  period: z.string().optional(),
  type: z.string().optional(),
});

const stageSchema = z.object({
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
  archonUrl: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['completed', 'upcoming', 'future', 'cancelled']).default('future'),
});

const pricingSchema = z.object({
  label: z.string(),
  early: z.string().optional(),
  regular: z.string(),
});

const gallerySectionSchema = z.object({
  title: z.string(),
  images: z.array(z.string()),
  wideImages: z.array(z.string()).optional().default([]),
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
  tags: z.array(z.string()).optional().default([]),
  locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
  featuredImage: z.string().optional(),
  poster: z.string().optional(),
  posterCaption: z.string().optional(),
  gallery: z.array(z.string()).optional().default([]),
  galleryFolder: z.string().optional(),
  gallerySections: z.array(gallerySectionSchema).optional().default([]),
  notes: z.array(z.string()).optional().default([]),
  links: z.array(linkSchema).optional().default([]),
  linksAfter: z.array(linkSchema).optional().default([]),
  highlight: z.object({ id: z.string(), label: z.string() }).optional(),
  pageLayout: z.enum(['auto', 'article']).optional().default('auto'),
  cardHidden: z.boolean().optional().default(false),
};

/* ── Per-type schemas ─────────────────────────────────────── */

// Grand Prix & Nazionale: full event pages
const grandPrixSchema = z.object({
  ...baseFields,
  category: z.literal('grand-prix'),
  poster: z.string(),
  venue: venueFullSchema,
  events: z.array(eventSchema).min(1),
  pricing: z.array(pricingSchema),
  payment: z.string(),
  registration: z.string(),
  contact: z.string(),
  hotel: z.array(hotelSchema),
  prizes: z.union([z.string(), z.array(z.string())]),
  standingsUrl: z.string(),
  // optional
  earlyDeadline: z.string().optional(),
  earlyDeadlineDate: z.coerce.date().optional(),
  hotelNote: z.string().optional(),
  schedule: z.array(scheduleSchema).optional().default([]),
  streamingUrl: z.string().optional(),
  stages: z.array(stageSchema).optional(),
});

const nazionaleSchema = z.object({
  ...baseFields,
  category: z.literal('nazionale'),
  poster: z.string(),
  venue: venueFullSchema,
  events: z.array(eventSchema).min(1),
  pricing: z.array(pricingSchema),
  payment: z.string(),
  registration: z.string(),
  contact: z.string(),
  hotel: z.array(hotelSchema),
  prizes: z.union([z.string(), z.array(z.string())]),
  standingsUrl: z.string(),
  // optional
  earlyDeadline: z.string().optional(),
  earlyDeadlineDate: z.coerce.date().optional(),
  hotelNote: z.string().optional(),
  schedule: z.array(scheduleSchema).optional().default([]),
  streamingUrl: z.string().optional(),
  stages: z.array(stageSchema).optional(),
});

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
// with no venue/events/league data — without it, the superRefine below would
// reject a comunita post that lacks all event/league markers as "incomplete".
const comunitaSchema = z
  .object({
    ...baseFields,
    category: z.literal('comunita'),
    articleOnly: z.boolean().optional(),
    // event fields (optional — present for events)
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
    streamingUrl: z.string().optional(),
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
    tourSchema,
    comunitaSchema,
    contestSchema,
  ]),
});

export const collections = { blog };
