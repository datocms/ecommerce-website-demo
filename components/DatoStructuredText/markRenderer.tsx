import { createElement, type ReactElement, type ReactNode } from 'react';

// A renderNode that draws `mark` nodes with renderMark and leaves every other tag as it is
export function markRenderer(
  renderMark: (key: string | undefined, children: ReactNode[]) => ReactElement,
) {
  return (
    tag: string,
    props: { key?: string } | null,
    ...children: ReactNode[]
  ) =>
    tag === 'mark'
      ? renderMark(props?.key, children)
      : createElement(tag, props, ...children);
}
