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
    standingsUrl: z.string().optional(),
    locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
  }),
});

export const collections = { blog };
