'use client';

import { useEffect } from 'react';

// Keyboard focus inside a horizontal scroller scrolls it just enough to show the focused item
// (the scroller's child that holds focus) whole. Browsers leave a partly visible element where
// it is and center a hidden one, and the rails pause snapping while focus is inside, so without
// this a focused tile can stay mostly behind the rail's edge.
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
      // The browser has already scrolled but not yet reported it; replace that with the
      // smallest scroll from where the rail was
      const from = lastScrollLeft;
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
    rail.addEventListener('scroll', recordScroll, { passive: true });
    rail.addEventListener('focusin', reveal);
    return () => {
      rail.removeEventListener('scroll', recordScroll);
      rail.removeEventListener('focusin', reveal);
    };
  }, [railId]);
}

// For a scroller of non-focusable items that renders tabIndex={0}: keeps it a tab stop only while
// it scrolls, so one that fits (a grid from lg) is not an extra stop. Off while `enabled` is false.
export function useScrollerTabStop(railId: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const rail = document.getElementById(railId);
    if (!rail) return;
    const update = () => {
      rail.tabIndex = rail.scrollWidth - rail.clientWidth > 1 ? 0 : -1;
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [railId, enabled]);
}

type Props = {
  railId: string;
};

// For a rail without RailControls (which does the same)
export default function RailFocus({ railId }: Props) {
  useRevealFocus(railId);
  return null;
}
