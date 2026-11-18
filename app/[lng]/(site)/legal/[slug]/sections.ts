import { stripStega } from '@datocms/content-link/stega';
import {
  type Document,
  hasChildren,
  isHeading,
  type Node,
} from 'datocms-structured-text-utils';
import type { Section } from './SectionIndex';

export const textOf = (node: Node): string => {
  if ('value' in node) return node.value;
  return hasChildren(node)
    ? (node.children as Node[]).map(textOf).join('')
    : '';
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');

/** h2s become anchored entries in the section index */
export function indexSections(value: Document): {
  sections: Section[];
  anchorIds: Map<Node, string>;
} {
  const anchorIds = new Map<Node, string>();
  const sections: Section[] = [];
  for (const node of value.document.children) {
    if (!isHeading(node) || node.level !== 2) continue;
    const title = stripStega(textOf(node)).trim();
    const slug = slugify(title) || `section-${sections.length + 1}`;
    let id = slug;
    for (let n = 2; sections.some((section) => section.id === id); n++) {
      id = `${slug}-${n}`;
    }
    anchorIds.set(node, id);
    sections.push({ id, title });
  }
  return { sections, anchorIds };
}
