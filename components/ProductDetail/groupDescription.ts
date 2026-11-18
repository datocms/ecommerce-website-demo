import type { Root } from 'datocms-structured-text-utils';
import { isValidElement, type ReactNode } from 'react';

export type TextRow = { key: string; text: ReactNode[]; lists: ReactNode[] };
export type TextGroup = { key: string; rows: TextRow[] };

// The renderer drops null children, so array positions don't match node.children; its
// "t-<index>" keys do
const nodeIndex = (child: ReactNode) =>
  isValidElement(child) ? Number(String(child.key).split('-').pop()) : -1;

// Text between blocks becomes one group: the copy as a lead on the left, care labels on the buy
// box's line. Copy that follows a list starts a new row, so the source order is kept.
export function groupDescriptionNodes(
  node: Root,
  children: ReactNode[] | undefined,
) {
  const parts: Array<{ block: ReactNode } | TextGroup> = [];
  for (const child of children ?? []) {
    const type = node.children[nodeIndex(child)]?.type;
    if (type === 'block') {
      parts.push({ block: child });
      continue;
    }
    const last = parts.at(-1);
    const group =
      last && 'rows' in last ? last : { key: `text-${parts.length}`, rows: [] };
    if (group !== last) parts.push(group);
    let row = group.rows.at(-1);
    if (!row || (type !== 'list' && row.lists.length > 0)) {
      row = { key: `row-${group.rows.length}`, text: [], lists: [] };
      group.rows.push(row);
    }
    (type === 'list' ? row.lists : row.text).push(child);
  }
  return parts;
}
