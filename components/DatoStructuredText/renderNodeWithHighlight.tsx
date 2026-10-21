import { createElement, type ReactNode } from 'react';

// Default renderNode: the CMS highlight mark renders as <mark>, padded so the marker wraps cleanly
// across lines
export function renderNodeWithHighlight(
  tag: string,
  props: { key?: string } | null,
  ...children: ReactNode[]
) {
  if (tag === 'mark')
    return (
      <mark key={props?.key} className="-mx-0.5 box-decoration-clone px-0.5">
        {children}
      </mark>
    );

  return createElement(tag, props, ...children);
}
