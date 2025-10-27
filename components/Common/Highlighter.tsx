import React, { type ReactNode } from 'react';

type TagName =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<unknown>;
type AnyProps = Record<string, unknown> & {
  className?: string;
  key?: React.Key;
};

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
