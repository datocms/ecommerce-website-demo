'use client';

import { ArrowsUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';
import { readFragment } from '@/lib/datocms/graphql';
import {
  type ProductListingLabels,
  ProductListingLabelsFragment,
} from './fragments';
import { usePendingQuery } from './PendingQuery';

type Props = {
  labels: ProductListingLabels;
};

function getSortOptions(labels: ProductListingLabels) {
  const { newArrivals, mostPopular, topRated, price, sales } =
    readFragment(ProductListingLabelsFragment, labels) ?? {};

  return [
    { label: newArrivals, value: '_publishedAt_DESC' },
    { label: mostPopular, value: 'numberOfReviews_DESC' },
    { label: topRated, value: 'reviewAverage_DESC' },
    { label: price, value: 'price_DESC' },
    { label: sales, value: 'onSale_DESC' },
  ];
}

/** Sort tabs in the listing toolbar */
export default function SortTabs({ labels }: Props) {
  const { pendingParams, pushQueryParam } = usePendingQuery();
  const currentSort = pendingParams.get('orderBy');
  const sortOptions = getSortOptions(labels);

  // Where the row scrolls, bring the selected tab into view without moving the page
  const scrollerRef = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const row = scrollerRef.current;
    const tab =
      currentSort &&
      row?.querySelector(`button[value="${CSS.escape(currentSort)}"]`);
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

/** The sort chips at the top of the filters drawer */
export function SortChips({ labels }: Props) {
  const { pendingParams, pushQueryParam } = usePendingQuery();
  const currentSort = pendingParams.get('orderBy');

  return (
    <fieldset
      aria-label="Sort"
      className="flex min-w-0 flex-wrap items-center gap-2 pb-6"
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center text-mute [&>svg]:size-[1.125rem]"
      >
        <ArrowsUpDownIcon />
      </span>
      {getSortOptions(labels).map((sortOption) => {
        const isSelected = currentSort === sortOption.value;
        return (
          <button
            key={sortOption.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() =>
              pushQueryParam('orderBy', sortOption.value, ['filter'])
            }
            className="chip shrink-0"
          >
            {isSelected && (
              <CheckIcon aria-hidden="true" className="animate-pop stroke-2" />
            )}
            {sortOption.label}
          </button>
        );
      })}
    </fieldset>
  );
}
