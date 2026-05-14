import type { CollectionEntry } from 'astro:content';
import { computeStageDisplayImages } from './status';

/** Builds the EN URL for a blog post, applying slug cleanup and category translation. */
export function getEnPostUrl(post: { id: string; data: { category: string } }): string {
  let cleanSlug = post.id.replace(/-en$/, '');
  let catSlug = post.data.category;
  if (catSlug === 'nazionale') {
    catSlug = 'national-championship';
    cleanSlug = cleanSlug.replace('nazionale-', 'nc-');
  } else if (catSlug === 'comunita') {
    catSlug = 'community';
  }
  return `/en/${catSlug}/${cleanSlug}/`;
}

/** Returns the best card image for a post, checking tour stage images for a specific city. */
export function getCardImage(
  post: {
    data: {
      category: string;
      poster?: string;
      featuredImage?: string;
      stages?: { date: Date; cities?: string[]; image?: string; status?: string }[];
    };
  },
  citySlug: string,
): string | undefined {
  if (post.data.category === 'tour' && post.data.stages?.length) {
    const displayImages = computeStageDisplayImages(post.data.stages);
    const idx = post.data.stages.findIndex((s) => s.cities?.includes(citySlug));
    if (idx !== -1 && displayImages[idx]) return displayImages[idx];
  }
  return post.data.poster || post.data.featuredImage;
}

export interface CityCardEntry {
  href: string;
  title: string;
  image: string | undefined;
  date: Date;
  category: string;
  tags: string[];
  excerpt: string;
}

/**
 * Build per-city card entries: expands Tour posts so each stage in `citySlug`
 * becomes its own card with the stage date and image. Non-tour posts stay as-is.
 * Output sorted descending by date.
 */
export function buildCityCards(
  posts: CollectionEntry<'blog'>[],
  citySlug: string,
  hrefBuilder: (post: CollectionEntry<'blog'>) => string,
): CityCardEntry[] {
  const out: CityCardEntry[] = [];

  for (const post of posts) {
    if (!post.data.tags?.includes(citySlug)) continue;

    if (post.data.category === 'tour' && post.data.stages && post.data.stages.length > 0) {
      const yearShort = String(new Date(post.data.date).getFullYear()).slice(2);
      const stageImages = computeStageDisplayImages(post.data.stages);
      for (let si = 0; si < post.data.stages.length; si++) {
        const stage = post.data.stages[si];
        if (!stage.cities?.includes(citySlug)) continue;
        if (!stage.date || stage.hideDate) continue;
        const stageImg = stageImages[si];
        out.push({
          href: hrefBuilder(post),
          title: `IT${yearShort} — ${stage.name}`,
          image: stageImg || post.data.poster || post.data.featuredImage,
          date: new Date(stage.date),
          category: post.data.category,
          tags: post.data.tags,
          excerpt: stage.description || post.data.excerpt,
        });
      }
      continue;
    }

    out.push({
      href: hrefBuilder(post),
      title: post.data.title,
      image: getCardImage(post, citySlug),
      date: new Date(post.data.date),
      category: post.data.category,
      tags: post.data.tags,
      excerpt: post.data.excerpt,
    });
  }

  out.sort((a, b) => b.date.getTime() - a.date.getTime());
  return out;
}
