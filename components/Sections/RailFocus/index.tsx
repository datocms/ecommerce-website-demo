'use client';

import { useEffect } from 'react';

// Keyboard focus inside a horizontal scroller scrolls it just enough to show the focused item
// (the scroller's child that holds focus) whole. Browsers leave a partly visible element where
// it is and centre a hidden one, and the rails pause snapping while focus is inside, so without
// this a focused tile can stay mostly behind the rail's edge.
export function useRevealFocus(railId: string) {
  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    // Where the rail sat before the latest scroll event
    let resting = rail.scrollLeft;
    const settle = () => {
      resting = rail.scrollLeft;
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
      // The browser has already scrolled but not yet reported it; replace that with the
      // smallest scroll from where the rail was
      const from = resting;
      requestAnimationFrame(() => {
        if (rail.scrollWidth <= rail.clientWidth) return;
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
        const next = from > toStart ? toStart : from < toEnd ? toEnd : from;
        if (Math.abs(next - rail.scrollLeft) > 1) rail.scrollLeft = next;
      });
    };
    rail.addEventListener('scroll', settle, { passive: true });
    rail.addEventListener('focusin', reveal);
    return () => {
      rail.removeEventListener('scroll', settle);
      rail.removeEventListener('focusin', reveal);
    };
  }, [railId]);
}

// For a rail without RailControls (which does the same)
export default function RailFocus({ railId }: { railId: string }) {
  useRevealFocus(railId);
  return null;
}
