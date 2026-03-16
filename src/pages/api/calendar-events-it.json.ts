import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { filterByLocale } from '../../utils/i18n';
import { extractCalendarEvents } from '../../utils/calendar';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const posts = filterByLocale(allPosts, 'it');
  const events = extractCalendarEvents(posts, 'it');

  return new Response(JSON.stringify(events), {
    headers: { 'Content-Type': 'application/json' },
  });
};
