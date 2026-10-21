import { stripStega } from '@datocms/content-link';
import { type CSSProperties, Fragment, type ReactNode } from 'react';

// A page title set word by word: each word rises out of its own line (the rise utility in
// global.css). Callers put `enter-stagger [--delay:200ms]` on the block under the title, as the
// hero, showcase and 404 do.
export default function Rise({ children }: { children: ReactNode }) {
  // Elements, and draft-mode text carrying stega, render untouched: visual editing keeps one
  // click target and live updates never replay the arrival
  const isPlainText =
    typeof children === 'string' && stripStega(children) === children;
  if (!isPlainText) return children;
  return (
    children
      .trim()
      // Only plain spaces split (a no-break space keeps its words together), and real spaces go
      // back between the spans, so the heading's accessible name and copied text are unchanged
      .split(/ +/)
      .map((word, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a title's words keep their order
        <Fragment key={index}>
          {index > 0 && ' '}
          <span className="rise" style={{ '--i': index } as CSSProperties}>
            {word}
          </span>
        </Fragment>
      ))
  );
}
