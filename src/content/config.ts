import { defineCollection, z } from 'astro:content';
import { LOCALES, DEFAULT_LOCALE } from '../utils/i18n';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).optional().default([]),
    featuredImage: z.string().optional(),
    excerpt: z.string().optional(),
    gallery: z.array(z.string()).optional().default([]),
    galleryFolder: z.string().optional(),
    stages: z.array(z.object({
      name: z.string(),
      number: z.number(),
      date: z.coerce.date(),
      cities: z.array(z.string()),
      archonUrl: z.string().optional(),
      image: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['completed', 'upcoming', 'future', 'cancelled']).default('future'),
    })).optional().default([]),
    rulesUrl: z.string().optional(),
    stagesLabel: z.string().optional(),
    stageItemLabel: z.string().optional(),
    gallerySections: z.array(z.object({
      title: z.string(),
      images: z.array(z.string()),
      wideImages: z.array(z.string()).optional().default([]),
    })).optional().default([]),
    poster: z.string().optional(),
    venue: z.object({
      name: z.string(),
      address: z.string(),
      mapUrl: z.string().optional(),
    }).optional(),
    events: z.array(z.object({
      name: z.string(),
      date: z.string(),
      time: z.string(),
      format: z.string(),
      archonUrl: z.string().optional(),
    })).optional().default([]),
    pricing: z.array(z.object({
      label: z.string(),
      early: z.string().optional(),
      regular: z.string(),
    })).optional().default([]),
    earlyDeadline: z.string().optional(),
    payment: z.string().optional(),
    hotel: z.array(z.object({
      room: z.string(),
      price: z.string(),
    })).optional().default([]),
    hotelNote: z.string().optional(),
    prizes: z.union([z.string(), z.array(z.string())]).optional(),
    registration: z.string().optional(),
    contact: z.string().optional(),
    standingsUrl: z.string().optional(),
    playersCount: z.number().optional(),
    streamingUrl: z.string().optional(),
    notes: z.array(z.string()).optional().default([]),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
      locale: z.enum(LOCALES).optional(),
    })).optional().default([]),
    locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
  }),
});

export const collections = { blog };
