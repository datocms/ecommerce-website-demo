import { stripStega } from '@datocms/content-link';
import { type CSSProperties, Fragment, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Splits a plain-text title into words that rise in one by one (the rise utility in motion.css).
// The block under the title takes enter-stagger [--delay:200ms] to follow it, as in the Hero.
export default function Rise({ children }: Props) {
  // Elements, and draft-mode text carrying stega, render untouched: visual editing keeps one
  // click target and live updates never replay the arrival
  const isPlainText =
    typeof children === 'string' && stripStega(children) === children;
  if (!isPlainText) return children;
  return (
    children
      .trim()
      // Split on plain spaces only (no-break spaces hold) and put real spaces back, so the
      // accessible name and copied text are unchanged
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
