'use client';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { type CSSProperties, type ReactNode, useState } from 'react';

type Props = {
  /** The section heading, shown beside the pause button */
  heading: ReactNode;
  quotes: { id: string; content: ReactNode }[];
  /** General interface "Pause" and "Play" labels */
  pauseLabel: string | undefined;
  playLabel: string | undefined;
};

// Seconds each quote takes to cross its own width
const SECONDS_PER_QUOTE = 11;

// The quotes drift past in a loop: the track holds them twice and moves by one copy, so the loop
// has no seam. With reduced motion there is one copy, scrolled by hand.
export default function QuoteMarquee({
  heading,
  quotes,
  pauseLabel,
  playLabel,
}: Props) {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div className="shell mb-12 flex items-end justify-between gap-6 lg:mb-16">
        {heading}
        <button
          type="button"
          aria-label={paused ? playLabel : pauseLabel}
          onClick={() => setPaused((isPaused) => !isPaused)}
          className="rail-btn motion-reduce:hidden"
        >
          {paused ? (
            <PlayIcon aria-hidden="true" />
          ) : (
            <PauseIcon aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="no-scrollbar overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] motion-reduce:overflow-x-auto">
        <ul
          data-paused={paused || undefined}
          className="marquee flex w-max"
          style={
            {
              '--marquee-duration': `${quotes.length * SECONDS_PER_QUOTE}s`,
            } as CSSProperties
          }
        >
          {[false, true].map((isCopy) =>
            quotes.map((quote) => (
              <li
                key={`${quote.id}${isCopy ? '-copy' : ''}`}
                aria-hidden={isCopy || undefined}
                className={`flex w-[82vw] max-w-[30rem] shrink-0 border-l border-line px-6 lg:px-10 ${isCopy ? 'motion-reduce:hidden' : ''}`}
              >
                {quote.content}
              </li>
            )),
          )}
        </ul>
      </div>
    </>
  );
}
