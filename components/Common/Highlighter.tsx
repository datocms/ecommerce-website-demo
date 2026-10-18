import React from 'react';

const Highlighter = (rawTagName: any, props: any, ...children: any) => {
  if (rawTagName === 'mark')
    return (
      <mark
        key={props?.key}
        className="-mx-1 rounded-xs bg-accent-wash box-decoration-clone px-1 text-ink"
      >
        {children}
      </mark>
    );

  return React.createElement(rawTagName, props, ...children);
};

export default Highlighter;
