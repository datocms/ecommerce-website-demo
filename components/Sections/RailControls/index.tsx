'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

type Props = {
  /** id of the horizontal scroller the buttons drive */
  railId: string;
  /** Adds a "01 / 03" position counter for that many items */
  count?: number;
  className?: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

// One item plus the gap: how far a press scrolls
function stepOf(rail: HTMLElement) {
  const item = rail.firstElementChild;
  if (!item) return rail.clientWidth;
  const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
  return item.getBoundingClientRect().width + gap;
}

// Previous/next discs for a rail rendered elsewhere on the page. They hide themselves when
// everything fits, and flag the rail with data-at-end so it can drop its edge fade. Keyboard
// focus on a card that is only partly in view scrolls the rail just enough to show it whole.
export default function RailControls({ railId, count, className }: Props) {
  const [position, setPosition] = useState({
    atStart: true,
    atEnd: false,
    index: 0,
  });

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    // Where the rail sat before the latest scroll event, for the focus handling below
    let resting = rail.scrollLeft;
    const update = () => {
      const x = rail.scrollLeft;
      resting = x;
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
    const reveal = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLElement) ||
        target === rail ||
        !target.matches(':focus-visible')
      )
        return;
      // The browser has already scrolled (centring a hidden card, leaving a partly visible one
      // alone) but not yet reported it; replace that with the smallest scroll from where it was
      const from = resting;
      requestAnimationFrame(() => {
        const style = getComputedStyle(rail);
        const left =
          target.getBoundingClientRect().left -
          rail.getBoundingClientRect().left +
          rail.scrollLeft;
        const toStart = left - Number.parseFloat(style.paddingLeft);
        const toEnd =
          left +
          target.offsetWidth -
          rail.clientWidth +
          Number.parseFloat(style.paddingRight);
        const next = from > toStart ? toStart : from < toEnd ? toEnd : from;
        if (Math.abs(next - rail.scrollLeft) > 1) rail.scrollLeft = next;
      });
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    rail.addEventListener('focusin', reveal);
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', update);
      rail.removeEventListener('focusin', reveal);
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
      left: direction * stepOf(rail),
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
        <p aria-hidden="true" className="mr-2 font-bold tabular-nums">
          {pad(position.index + 1)}{' '}
          <span className="text-ink/70">/ {pad(count)}</span>
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
        <ArrowLeftIcon aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next"
        aria-controls={railId}
        aria-disabled={position.atEnd}
        onClick={() => !position.atEnd && scroll(1)}
        className="rail-btn"
      >
        <ArrowRightIcon aria-hidden="true" />
      </button>
    </div>
  );
}
