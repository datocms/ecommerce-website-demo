'use client';

import { useEffect } from 'react';
import { watchScroller } from './watchScroller';

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

// For a scroller of non-focusable items that renders tabIndex={0}: a tab stop only while it
// scrolls, so one that fits is not an extra stop
export function useScrollerTabStop(railId: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const rail = document.getElementById(railId);
    if (!rail) return;
    return watchScroller(rail, () => {
      rail.tabIndex = rail.scrollWidth - rail.clientWidth > 1 ? 0 : -1;
    });
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
