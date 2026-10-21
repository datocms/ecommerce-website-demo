'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useRevealFocus } from './RailFocus';

type Props = {
  /** id of the horizontal scroller the buttons drive */
  railId: string;
};

// How far a press scrolls: every item that is fully in view, so the next press starts on the
// first one that was cut off (one at a time where only one fits)
function pageOf(rail: HTMLElement) {
  const style = getComputedStyle(rail);
  const gap = Number.parseFloat(style.columnGap) || 0;
  // One item plus the gap
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

// Previous/next buttons for the scroller with id `railId`. Hidden on phones (they swipe) and
// whenever everything fits; flags the rail with data-at-end. Also reveals a keyboard-focused item
// that is only partly in view (useRevealFocus).
export default function RailControls({ railId }: Props) {
  useRevealFocus(railId);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const update = () => {
      const x = rail.scrollLeft;
      const reachedEnd = x >= rail.scrollWidth - rail.clientWidth - 1;
      rail.toggleAttribute('data-at-end', reachedEnd);
      setAtStart(x <= 1);
      setAtEnd(reachedEnd);
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [railId]);

  const scroll = (direction: -1 | 1) => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const instant = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    rail.scrollBy({
      left: direction * pageOf(rail),
      behavior: instant ? 'auto' : 'smooth',
    });
  };

  if (atStart && atEnd) return null;

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <button
        type="button"
        aria-label="Previous"
        aria-controls={railId}
        aria-disabled={atStart}
        onClick={() => !atStart && scroll(-1)}
        className="rail-btn"
      >
        <ArrowLeftIcon aria-hidden="true" className="stroke-2" />
      </button>
      <button
        type="button"
        aria-label="Next"
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
