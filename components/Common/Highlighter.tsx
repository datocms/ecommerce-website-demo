/**
 * Structured-text renderer helper that styles <mark> tags with
 * a consistent highlight look. Falls back to `React.createElement` for other
 * tags.
 */
import React, { type ReactNode } from 'react';

export type TagName =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<unknown>;
export type AnyProps = Record<string, unknown> & {
  className?: string;
  key?: React.Key;
};

/**
 * Render a tag with optional highlight style for `<mark>` nodes.
 * @param rawTagName - Intrinsic tag name or component reference
 * @param props - Props for the element
 * @param children - Children passed from the structured-text renderer
 */
const Highlighter = (
  rawTagName: TagName,
  props: AnyProps | null,
  ...children: ReactNode[]
) => {
  const normalizedChildren = React.Children.toArray(children);

  if ((rawTagName as string) === 'mark') {
    const { className, key: _ignoredKey, ...restProps } = props ?? {};
    const combinedClassName = [
      'inline rounded-sm bg-primary/25 px-1 py-1',
      typeof className === 'string' ? className : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <mark {...restProps} className={combinedClassName}>
        {normalizedChildren}
      </mark>
    );
  }

  return React.createElement(
    rawTagName as React.ElementType,
    props ?? {},
    ...normalizedChildren,
  );
};

export default Highlighter;
