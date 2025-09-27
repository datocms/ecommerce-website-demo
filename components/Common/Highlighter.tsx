import React, { type ReactNode } from 'react';

const Highlighter = (
  rawTagName: any,
  props: any,
  ...children: ReactNode[]
) => {
  const normalizedChildren = React.Children.toArray(children);

  if (rawTagName === 'mark') {
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

  return React.createElement(rawTagName, props, ...normalizedChildren);
};

export default Highlighter;
