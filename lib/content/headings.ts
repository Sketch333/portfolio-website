import type { Root, RootContent } from 'mdast';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

export type ArticleHeading = { level: 2 | 3; text: string; id: string };

function textOf(node: RootContent): string {
  if ('children' in node) return node.children.map((child) => textOf(child as RootContent)).join('');
  if ('value' in node) return node.value;
  if (node.type === 'image') return node.alt ?? '';
  return '';
}

// Both extraction and MDX rendering walk the same Markdown tree. Each document
// owns its collision set; repeated headings never share an anchor.
function assignHeadingIds(tree: Root): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const used = new Set<string>();
  function walk(nodes: RootContent[]) {
    for (const node of nodes) {
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const text = textOf(node);
        const base = text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
        let id = base;
        let suffix = 2;
        while (used.has(id)) id = `${base}-${suffix++}`;
        used.add(id);
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
        headings.push({ level: node.depth, text, id });
      }
      if ('children' in node) walk(node.children as RootContent[]);
    }
  }
  walk(tree.children);
  return headings;
}

export function extractHeadings(source: string): ArticleHeading[] {
  return assignHeadingIds(unified().use(remarkParse).use(remarkMdx).parse(source));
}

export function articleHeadingIds() {
  return (tree: Root) => { assignHeadingIds(tree); };
}

export function readingMinutes(source: string): number {
  return Math.max(1, Math.ceil(source.trim().split(/\s+/).filter(Boolean).length / 200));
}
