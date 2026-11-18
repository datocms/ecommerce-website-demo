'use client';

import { useEffect } from 'react';
import { SCROLL_EPSILON, scrollRange } from './watchScroller';

// Keeps `from` when the item already fits between the two edges, else the nearest edge
function revealedScrollLeft(from: number, toStart: number, toEnd: number) {
  if (from > toStart) return toStart;
  if (from < toEnd) return toEnd;
  return from;
}

// Scrolls a keyboard-focused item fully into view: browsers leave a partly visible one where it
// is, and the rails pause snapping while focused
export function useRevealFocus(railId: string) {
  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    // scrollLeft as of the latest scroll event: when focusin fires, the browser's own focus
    // scroll has not been reported yet
    let lastScrollLeft = rail.scrollLeft;
    const recordScroll = () => {
      lastScrollLeft = rail.scrollLeft;
    };
    const reveal = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLElement) ||
        target === rail ||
        !target.matches(':focus-visible')
      )
        return;
      let item = target;
      while (item.parentElement && item.parentElement !== rail) {
        item = item.parentElement;
      }
      // Replace the browser's unreported focus scroll with the smallest one
      const from = lastScrollLeft;
      requestAnimationFrame(() => {
        if (scrollRange(rail) <= 0) return;
        const style = getComputedStyle(rail);
        const box = item.getBoundingClientRect();
        const left =
          box.left - rail.getBoundingClientRect().left + rail.scrollLeft;
        const toStart = left - Number.parseFloat(style.paddingLeft);
        const toEnd =
          left +
          box.width -
          rail.clientWidth +
          Number.parseFloat(style.paddingRight);
        const next = revealedScrollLeft(from, toStart, toEnd);
        if (Math.abs(next - rail.scrollLeft) > SCROLL_EPSILON) {
          rail.scrollLeft = next;
        }
      });
    };
    rail.addEventListener('scroll', recordScroll, { passive: true });
    rail.addEventListener('focusin', reveal);
    return () => {
      rail.removeEventListener('scroll', recordScroll);
      rail.removeEventListener('focusin', reveal);
    };
  }, [railId]);
}
