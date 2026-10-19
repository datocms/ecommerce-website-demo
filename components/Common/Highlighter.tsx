import React from 'react';

const Highlighter = (rawTagName: any, props: any, ...children: any) => {
  if (rawTagName === 'mark')
    return (
      <mark key={props?.key} className="-mx-0.5 box-decoration-clone px-0.5">
        {children}
      </mark>
    );

  return React.createElement(rawTagName, props, ...children);
};

export default Highlighter;
