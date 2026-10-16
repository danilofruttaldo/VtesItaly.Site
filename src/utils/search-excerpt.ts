/**
 * Pagefind excerpt split into plain text and highlighted matches.
 *
 * Pagefind emits excerpts with <mark>...</mark> only. The search overlay
 * builds the DOM from these segments (text nodes for prose, <mark> elements
 * for matches), never through innerHTML, so any other tag or an
 * entity-encoded payload is rendered as literal text. Uppercase <MARK> is not
 * a match: Pagefind only emits lowercase.
 */
export interface ExcerptSegment {
  kind: 'text' | 'mark';
  value: string;
}

export function excerptSegments(raw: string | null | undefined): ExcerptSegment[] {
  const out: ExcerptSegment[] = [];
  (raw || '').split(/<mark>([\s\S]*?)<\/mark>/g).forEach((part, i) => {
    if (i % 2 === 1) out.push({ kind: 'mark', value: part });
    else if (part) out.push({ kind: 'text', value: part });
  });
  return out;
}
