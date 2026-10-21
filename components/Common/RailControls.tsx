'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useRevealFocus } from './RailFocus';

type Props = {
  /** id of the horizontal scroller the buttons drive */
  railId: string;
  /** Adds a "01 / 03" position counter for that many items */
  count?: number;
  className?: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

// One item plus the gap
function stepOf(rail: HTMLElement) {
  const item = rail.firstElementChild;
  if (!item) return rail.clientWidth;
  const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
  return item.getBoundingClientRect().width + gap;
}

// How far a press scrolls: every item that is fully in view, so the next press starts on the
// first one that was cut off (one at a time where only one fits)
function pageOf(rail: HTMLElement) {
  const step = stepOf(rail);
  const style = getComputedStyle(rail);
  const gap = Number.parseFloat(style.columnGap) || 0;
  const view =
    rail.clientWidth -
    Number.parseFloat(style.paddingLeft) -
    Number.parseFloat(style.paddingRight);
  return step * Math.max(1, Math.floor((view + gap) / step));
}

// Previous/next squares for a rail rendered elsewhere on the page, with an optional "01 / 03"
// counter. They hide themselves when everything fits (phones swipe instead), and flag the rail
// with data-at-end. Keyboard focus on a card that is only partly in view scrolls the rail just
// enough to show it whole.
export default function RailControls({ railId, count, className }: Props) {
  useRevealFocus(railId);
  const [position, setPosition] = useState({
    atStart: true,
    atEnd: false,
    index: 0,
  });

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const update = () => {
      const x = rail.scrollLeft;
      const atStart = x <= 1;
      const atEnd = x >= rail.scrollWidth - rail.clientWidth - 1;
      // The first card in view; with two cards in view the end reads 02 / 03, not a skip to 03
      const index = Math.min(
        Math.max((count ?? 1) - 1, 0),
        Math.round(x / stepOf(rail)),
      );
      rail.toggleAttribute('data-at-end', atEnd);
      setPosition((current) =>
        current.atStart === atStart &&
        current.atEnd === atEnd &&
        current.index === index
          ? current
          : { atStart, atEnd, index },
      );
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [railId, count]);

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

  if (position.atStart && position.atEnd) return null;

  return (
    <div
      className={['hidden items-center gap-2 sm:flex', className]
        .filter(Boolean)
        .join(' ')}
    >
      {count ? (
        <p
          aria-hidden="true"
          className="mr-3 text-sm font-semibold tabular-nums"
        >
          {pad(position.index + 1)}{' '}
          <span className="text-mute">/ {pad(count)}</span>
        </p>
      ) : null}
      <button
        type="button"
        aria-label="Previous"
        aria-controls={railId}
        aria-disabled={position.atStart}
        onClick={() => !position.atStart && scroll(-1)}
        className="rail-btn"
      >
        <ArrowLeftIcon aria-hidden="true" className="stroke-2" />
      </button>
      <button
        type="button"
        aria-label="Next"
        aria-controls={railId}
        aria-disabled={position.atEnd}
        onClick={() => !position.atEnd && scroll(1)}
        className="rail-btn"
      >
        <ArrowRightIcon aria-hidden="true" className="stroke-2" />
      </button>
    </div>
  );
}
