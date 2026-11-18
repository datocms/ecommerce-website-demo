'use client';

import { useEffect } from 'react';
import { SCROLL_EPSILON, scrollRange, watchScroller } from './watchScroller';

// For a scroller of non-focusable items that renders tabIndex={0}: a tab stop only while it
// scrolls, so one that fits is not an extra stop
export function useScrollerTabStop(railId: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const rail = document.getElementById(railId);
    if (!rail) return;
    return watchScroller(rail, () => {
      rail.tabIndex = scrollRange(rail) > SCROLL_EPSILON ? 0 : -1;
    });
  }, [railId, enabled]);
}
