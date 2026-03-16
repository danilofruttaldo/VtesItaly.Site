/** Builds the EN URL for a blog post, applying slug cleanup and category translation. */
export function getEnPostUrl(post: { id: string; data: { category: string } }): string {
  let cleanSlug = post.id.replace(/-en$/, '');
  let catSlug = post.data.category;
  if (catSlug === 'nazionale') { catSlug = 'national-championship'; cleanSlug = cleanSlug.replace('nazionale-', 'nc-'); }
  else if (catSlug === 'comunita') { catSlug = 'community'; }
  return `/en/${catSlug}/${cleanSlug}/`;
}

/** Returns the best card image for a post, checking tour stage images for a specific city. */
export function getCardImage(post: any, citySlug: string): { src: string | undefined; isPoster: boolean } {
  if (post.data.category === 'tour' && post.data.stages?.length > 0) {
    const stage = post.data.stages.find((s: any) => s.cities?.includes(citySlug));
    if (stage?.image) return { src: stage.image, isPoster: false };
  }
  return { src: post.data.poster || post.data.featuredImage, isPoster: !!post.data.poster };
}
