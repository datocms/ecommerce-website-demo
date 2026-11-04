'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollerTabStop } from './RailFocus';
import { watchScroller } from './watchScroller';

type Props = {
  /** id of the horizontal scroller the track follows */
  railId: string;
  /** Also makes the rail a tab stop only while it scrolls (for rails of non-focusable items) */
  tabStop?: boolean;
  className?: string;
};

// Decorative scroll track under a rail; hidden while everything fits
export default function RailProgress({ railId, tabStop, className }: Props) {
  useScrollerTabStop(railId, Boolean(tabStop));
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [scrollable, setScrollable] = useState(true);

  useEffect(() => {
    const rail = document.getElementById(railId);
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = rail;
      const max = scrollWidth - clientWidth;
      const visible = Math.min(1, clientWidth / scrollWidth);
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollLeft / max)) : 0;
      thumb.style.width = `${visible * 100}%`;
      // translate is relative to the thumb, so convert the track offset to thumb widths
      thumb.style.translate = `${((progress * (1 - visible)) / visible) * 100}% 0`;
      setScrollable(max > 1);
    };
    return watchScroller(rail, update);
  }, [railId]);

  return (
    <div
      aria-hidden="true"
      className={[
        'relative h-0.5 overflow-hidden bg-line',
        scrollable ? '' : 'hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        ref={thumbRef}
        className="absolute inset-y-0 left-0 w-0 bg-(--surface-fg)"
      />
    </div>
  );
}
