import { stripStega } from '@datocms/content-link';
import { type CSSProperties, Fragment, type ReactNode } from 'react';

// A page title set word by word: each word rises out of its own line (the rise utility). Real
// spaces stay between the words, so the heading's name and copied text are unchanged; only plain
// spaces split, so a no-break space keeps its words together. Anything but a plain string, and a
// string carrying draft-mode stega, renders untouched: visual editing keeps one click target and
// live updates never replay the arrival.
export default function Rise({ children }: { children: ReactNode }) {
  if (typeof children !== 'string' || stripStega(children) !== children)
    return children;
  return children
    .trim()
    .split(/ +/)
    .map((word, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: a title's words keep their order
      <Fragment key={index}>
        {index > 0 && ' '}
        <span className="rise" style={{ '--i': index } as CSSProperties}>
          {word}
        </span>
      </Fragment>
    ));
}
