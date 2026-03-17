import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const LOCALES = ['it', 'en'] as const;
const DEFAULT_LOCALE = 'it';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).optional().default([]),
    featuredImage: z.string().optional(),
    excerpt: z.string().optional(),
    gallery: z.array(z.string()).optional().default([]),
    galleryFolder: z.string().optional(),
    stages: z
      .array(
        z.object({
          name: z.string(),
          number: z.number(),
          date: z.coerce.date(),
          cities: z.array(z.string()),
          time: z.string().optional(),
          venue: z.string().optional(),
          location: z.string().optional(),
          format: z.string().optional(),
          archonUrl: z.string().optional(),
          image: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(['completed', 'upcoming', 'future', 'cancelled']).default('future'),
        }),
      )
      .optional()
      .default([]),
    rulesUrl: z.string().optional(),
    stagesLabel: z.string().optional(),
    stageItemLabel: z.string().optional(),
    gallerySections: z
      .array(
        z.object({
          title: z.string(),
          images: z.array(z.string()),
          wideImages: z.array(z.string()).optional().default([]),
        }),
      )
      .optional()
      .default([]),
    poster: z.string().optional(),
    posterCaption: z.string().optional(),
    venue: z
      .object({
        name: z.string(),
        address: z.string(),
        mapUrl: z.string().optional(),
        siteUrl: z.string().optional(),
      })
      .optional(),
    events: z
      .array(
        z.object({
          name: z.string(),
          date: z.coerce.date(),
          endDate: z.coerce.date().optional(),
          time: z.string(),
          format: z.string(),
          archonUrl: z.string().optional(),
          period: z.string().optional(),
        }),
      )
      .optional()
      .default([]),
    schedule: z
      .array(
        z.object({
          label: z.string(),
          time: z.string(),
        }),
      )
      .optional()
      .default([]),
    pricing: z
      .array(
        z.object({
          label: z.string(),
          early: z.string().optional(),
          regular: z.string(),
        }),
      )
      .optional()
      .default([]),
    earlyDeadline: z.string().optional(),
    payment: z.string().optional(),
    hotel: z
      .array(
        z.object({
          room: z.string(),
          price: z.string(),
        }),
      )
      .optional()
      .default([]),
    hotelNote: z.string().optional(),
    prizes: z.union([z.string(), z.array(z.string())]).optional(),
    registration: z.string().optional(),
    contact: z.string().optional(),
    standingsUrl: z.string().optional(),
    playersCount: z.number().optional(),
    streamingUrl: z.string().optional(),
    leagueStats: z
      .object({
        players: z.number(),
        games: z.number(),
        tables: z.number(),
      })
      .optional(),
    leagueTopLists: z
      .array(
        z.object({
          label: z.string(),
          items: z.array(
            z.object({
              name: z.string(),
              count: z.number(),
            }),
          ),
        }),
      )
      .optional()
      .default([]),
    leagueBonusPoints: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
        }),
      )
      .optional()
      .default([]),
    leagueRules: z
      .array(
        z.object({
          acronym: z.string(),
          label: z.string(),
          description: z.string(),
        }),
      )
      .optional()
      .default([]),
    notes: z.array(z.string()).optional().default([]),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
          locale: z.enum(LOCALES).optional(),
        }),
      )
      .optional()
      .default([]),
    linksAfter: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
          locale: z.enum(LOCALES).optional(),
        }),
      )
      .optional()
      .default([]),
    pageLayout: z.enum(['auto', 'article']).optional().default('auto'),
    cardHidden: z.boolean().optional().default(false),
    locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
  }),
});

export const collections = { blog };
