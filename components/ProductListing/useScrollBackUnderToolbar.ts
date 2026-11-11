'use client';

import { useSearchParams } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

export function useScrollBackUnderToolbar(drawerOpen: boolean) {
  const currentQuery = useSearchParams().toString();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const scrollBackQueryRef = useRef<string | null>(null);
  const scrollBackWhenQueryLoads = (query: string) => {
    if (query !== currentQuery) scrollBackQueryRef.current = query;
  };

  // From lg the toolbar sticks: after a sort or filter change, scroll the new results back under
  // it. Wait for the drawer to close, whose scroll lock restores the old position on iOS
  useLayoutEffect(() => {
    if (drawerOpen || scrollBackQueryRef.current !== currentQuery) return;
    scrollBackQueryRef.current = null;
    const overlap =
      (toolbarRef.current?.getBoundingClientRect().bottom ?? 0) -
      (resultsTopRef.current?.getBoundingClientRect().top ?? 0);
    if (overlap > 1) window.scrollBy({ top: -overlap, behavior: 'instant' });
  }, [currentQuery, drawerOpen]);

  return { toolbarRef, resultsTopRef, scrollBackWhenQueryLoads };
}
