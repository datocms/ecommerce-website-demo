'use client';

import { ArrowsUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { ProductListingLabels } from './fragments';
import { FILTER_TRANSITION_TYPES, usePendingQuery } from './PendingQuery';
import { getSortOptions } from './sortOptions';

type Props = {
  labels: ProductListingLabels;
};

export default function SortChips({ labels }: Props) {
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
              pushQueryParam(
                'orderBy',
                sortOption.value,
                FILTER_TRANSITION_TYPES,
              )
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
