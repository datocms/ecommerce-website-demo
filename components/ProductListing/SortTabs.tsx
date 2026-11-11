'use client';

import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import type { ProductListingLabels } from './fragments';
import { usePendingQuery } from './PendingQuery';
import { getSortOptions } from './sortOptions';

type Props = {
  labels: ProductListingLabels;
};

export default function SortTabs({ labels }: Props) {
  const { pendingParams, pushQueryParam } = usePendingQuery();
  const currentSort = pendingParams.get('orderBy');
  const sortOptions = getSortOptions(labels);

  // Where the row scrolls, bring the selected tab into view without moving the page
  const scrollerRef = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const row = scrollerRef.current;
    const tab = currentSort
      ? row?.querySelector(`button[value="${CSS.escape(currentSort)}"]`)
      : null;
    if (!row || !tab) return;
    const rowBox = row.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    if (tabBox.left < rowBox.left || tabBox.right > rowBox.right)
      row.scrollLeft +=
        tabBox.left + tabBox.width / 2 - (rowBox.left + rowBox.width / 2);
  }, [currentSort]);

  return (
    // One pixel taller than its row, so the bars cover the toolbar's bottom hairline
    <fieldset
      ref={scrollerRef}
      aria-label="Sort"
      className="no-scrollbar -mb-px flex h-[calc(3rem+1px)] min-w-0 scroll-px-(--gutter) gap-2 overflow-x-auto px-(--gutter) lg:h-[calc(3.5rem+1px)] lg:gap-3 lg:px-0"
    >
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center text-mute [&>svg]:size-[1.125rem]"
      >
        <ArrowsUpDownIcon />
      </span>
      {sortOptions.map((sortOption) => (
        <button
          key={sortOption.value}
          type="button"
          value={sortOption.value}
          aria-pressed={currentSort === sortOption.value}
          onClick={() => pushQueryParam('orderBy', sortOption.value)}
          className="bar-draw relative inline-flex shrink-0 items-center px-2 text-sm font-medium whitespace-nowrap text-ink-2 transition-colors duration-150 outline-offset-[-2px] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-ink hover:text-ink hover:after:scale-x-100 aria-pressed:text-ink aria-pressed:after:scale-x-100"
        >
          {sortOption.label}
        </button>
      ))}
    </fieldset>
  );
}
