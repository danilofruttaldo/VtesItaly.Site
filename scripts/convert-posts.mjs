import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const posts = JSON.parse(readFileSync('scripts/wp-export/posts.json', 'utf8'));
const categories = JSON.parse(readFileSync('scripts/wp-export/categories.json', 'utf8'));
const tags = JSON.parse(readFileSync('scripts/wp-export/tags.json', 'utf8'));

// Build category and tag maps
const catMap = {};
for (const c of categories) catMap[c.id] = c;
const tagMap = {};
for (const t of tags) tagMap[t.id] = t;

// Category slug mapping (WP category ID → URL category slug)
const catSlugMap = {
  3: 'tour',
  4: 'grand-prix',
  5: 'nazionale',
  6: 'eventi',
  9: 'community',
  10: 'contest',
};

const outDir = 'src/content/blog';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<h([1-6])[^>]*>/gi, (_, level) => '#'.repeat(parseInt(level)) + ' ')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n---\n')
    .replace(/<strong>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<em>/gi, '*')
    .replace(/<\/em>/gi, '*')
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Find the featured image URL from media.json
const media = JSON.parse(readFileSync('scripts/wp-export/media.json', 'utf8'));
const mediaMap = {};
for (const m of media) mediaMap[m.id] = m;

let count = 0;
for (const post of posts) {
  // Get category
  const catId = post.categories?.[0];
  const catSlug = catSlugMap[catId] || 'blog';

  // Get tags
  const postTags = (post.tags || []).map((id) => tagMap[id]?.slug).filter(Boolean);

  // Get featured image
  let featuredImage = '';
  if (post.featured_media && mediaMap[post.featured_media]) {
    const m = mediaMap[post.featured_media];
    const url = m.source_url || '';
    // Map to local path
    const filename = url.split('/').pop();
    featuredImage = `/images/eventi/${filename}`;
  }

  // Extract content
  let content = '';
  if (post.content?.rendered) {
    content = stripHtml(post.content.rendered);
  }

  // Get excerpt
  let excerpt = '';
  if (post.excerpt?.rendered) {
    excerpt = stripHtml(post.excerpt.rendered).substring(0, 200);
  }

  const title = post.title?.rendered || post.slug;
  const date = post.date?.substring(0, 10) || '2025-01-01';

  // Build frontmatter
  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${post.slug}"`,
    `date: ${date}`,
    `category: "${catSlug}"`,
    postTags.length ? `tags: [${postTags.map((t) => `"${t}"`).join(', ')}]` : '',
    featuredImage ? `featuredImage: "${featuredImage}"` : '',
    excerpt ? `excerpt: "${excerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"` : '',
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  const fileContent = frontmatter + '\n\n' + content;
  const filename = `${outDir}/${post.slug}.md`;
  writeFileSync(filename, fileContent);
  count++;
  console.log(`Created: ${filename}`);
}

console.log(`\nDone: ${count} posts converted`);
