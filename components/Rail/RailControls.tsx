'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useRevealFocus } from './useRevealFocus';
import { SCROLL_EPSILON, scrollRange, watchScroller } from './watchScroller';

type Props = {
  /** id of the horizontal scroller the buttons drive */
  railId: string;
  /** General interface "Previous" and "Next" labels */
  previousLabel?: string;
  nextLabel?: string;
};

// How far a press scrolls: every item that is fully in view, so the next press starts on the
// first one that was cut off (one at a time where only one fits)
function scrollDistance(rail: HTMLElement) {
  const style = getComputedStyle(rail);
  const gap = Number.parseFloat(style.columnGap) || 0;
  const item = rail.firstElementChild;
  const step = item
    ? item.getBoundingClientRect().width + gap
    : rail.clientWidth;
  const view =
    rail.clientWidth -
    Number.parseFloat(style.paddingLeft) -
    Number.parseFloat(style.paddingRight);
  return step * Math.max(1, Math.floor((view + gap) / step));
}

/**
 * Previous/next buttons for the scroller with id railId; hidden on phones and when everything
 * fits. Also reveals a partly hidden focused item.
 */
export default function RailControls({
  railId,
  previousLabel,
  nextLabel,
}: Props) {
  useRevealFocus(railId);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const update = () => {
      const x = rail.scrollLeft;
      const reachedEnd = x >= scrollRange(rail) - SCROLL_EPSILON;
      setAtStart(x <= SCROLL_EPSILON);
      setAtEnd(reachedEnd);
    };
    return watchScroller(rail, update);
  }, [railId]);

  const scroll = (direction: -1 | 1) => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const instant = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    rail.scrollBy({
      left: direction * scrollDistance(rail),
      behavior: instant ? 'auto' : 'smooth',
    });
  };

  if (atStart && atEnd) return null;

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <button
        type="button"
        aria-label={previousLabel}
        aria-controls={railId}
        aria-disabled={atStart}
        onClick={() => !atStart && scroll(-1)}
        className="rail-btn"
      >
        <ArrowLeftIcon aria-hidden="true" className="stroke-2" />
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        aria-controls={railId}
        aria-disabled={atEnd}
        onClick={() => !atEnd && scroll(1)}
        className="rail-btn"
      >
        <ArrowRightIcon aria-hidden="true" className="stroke-2" />
      </button>
    </div>
  );
}
