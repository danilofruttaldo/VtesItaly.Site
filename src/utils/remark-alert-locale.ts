/**
 * Remark plugin, run after `remarkAlert`: the callout titles it writes are the
 * English type names ("NOTE", "TIP"…), so Italian pages get them translated.
 * The page language is the `locale` frontmatter field, else the file name
 * (`-en.md` twins are English), else Italian, the site default.
 */
const IT_TITLES: Record<string, string> = {
  NOTE: 'NOTA',
  TIP: 'SUGGERIMENTO',
  IMPORTANT: 'IMPORTANTE',
  WARNING: 'ATTENZIONE',
  CAUTION: 'CAUTELA',
};

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hProperties?: { className?: unknown } };
}

interface MdFile {
  path?: string;
  history?: string[];
  data?: { astro?: { frontmatter?: { locale?: string } } };
}

export function pageLocale(file: MdFile): 'it' | 'en' {
  const declared = file.data?.astro?.frontmatter?.locale;
  if (declared === 'en' || declared === 'it') return declared;
  const path = file.path || file.history?.[0] || '';
  return /-en\.mdx?$/.test(path) ? 'en' : 'it';
}

function translateTitles(node: MdNode): void {
  if (node.data?.hProperties?.className === 'markdown-alert-title') {
    for (const child of node.children ?? []) {
      if (child.type === 'text' && child.value && IT_TITLES[child.value]) child.value = IT_TITLES[child.value];
    }
    return;
  }
  for (const child of node.children ?? []) translateTitles(child);
}

export function remarkAlertLocale() {
  return (tree: MdNode, file: MdFile) => {
    if (pageLocale(file) === 'it') translateTitles(tree);
  };
}
