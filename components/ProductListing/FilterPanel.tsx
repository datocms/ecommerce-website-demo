'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import {
  FilterOptionsFragment,
  ProductListingLabelsFragment,
} from './fragments';
import { usePendingQuery } from './PendingQuery';
import { type ListingLabels, SortChips } from './SortTabs';

type Props = {
  filterOptions: FragmentOf<typeof FilterOptionsFragment> | null | undefined;
  generalInterface: ListingLabels;
  selectedCollections: string[];
  selectedBrands: string[];
  selectedMaterials: string[];
};

type FilterKey = 'collections' | 'materials' | 'brands';

export default function FilterPanel({
  filterOptions,
  selectedCollections,
  selectedBrands,
  selectedMaterials,
  generalInterface,
}: Props) {
  const { pendingParams, pushQueryParam } = usePendingQuery();

  // Missing params mean the server default (every option), which the props hold
  const selectedFromProps: Record<FilterKey, string[]> = {
    collections: selectedCollections,
    materials: selectedMaterials,
    brands: selectedBrands,
  };
  const selected = (key: FilterKey) =>
    pendingParams.has(key)
      ? (pendingParams.get(key) ?? '').split('|').filter(Boolean)
      : selectedFromProps[key];

  const { BrandRecord, MaterialRecord, CollectionRecord } =
    readFragment(ProductListingLabelsFragment, generalInterface) ?? {};

  const { allCollections, allBrands, allMaterials } =
    readFragment(FilterOptionsFragment, filterOptions) ?? {};

  const filters: {
    id: FilterKey;
    name: string | null | undefined;
    options: { id: string; name: string }[] | undefined;
  }[] = [
    { id: 'collections', name: CollectionRecord, options: allCollections },
    { id: 'materials', name: MaterialRecord, options: allMaterials },
    { id: 'brands', name: BrandRecord, options: allBrands },
  ];

  function toggleOption(key: FilterKey, id: string) {
    const current = selected(key);
    pushQueryParam(
      key,
      (current.includes(id)
        ? current.filter((option) => option !== id)
        : [...current, id]
      ).join('|'),
      ['filter'],
    );
  }

  const groups = filters.map((group) => {
    const options = group.options ?? [];
    const selectedIds = selected(group.id);
    const checked = options.filter((option) =>
      selectedIds.includes(option.id),
    ).length;
    return {
      ...group,
      options,
      selectedIds,
      checked,
      narrowed: checked !== options.length,
    };
  });
  // Groups that narrow the listing start open; with none, the first one does,
  // so the drawer never opens fully folded
  const anyNarrowed = groups.some((group) => group.narrowed);

  return (
    // While it is open, the grid behind it updates at once (data-filter-drawer in global.css)
    <div data-filter-drawer>
      <SortChips generalInterface={generalInterface} />

      {groups.map((group, index) => {
        const { options, checked, narrowed } = group;
        return (
          <Disclosure
            key={group.id}
            as="div"
            defaultOpen={narrowed || (!anyNarrowed && index === 0)}
            className="border-t border-line"
          >
            {({ open }) => (
              <>
                <h3>
                  <DisclosureButton className="group flex min-h-16 w-full items-center justify-between gap-4 py-2 text-left">
                    <span className="title-item flex items-center gap-3">
                      {group.name}
                      {narrowed && (
                        // Re-keyed by the count, so it pops again when the count changes
                        <span
                          key={checked}
                          className="tag-dark min-h-6 animate-pop px-1.5"
                        >
                          <span className="sr-only"> (</span>
                          {checked}
                          <span className="sr-only"> applied)</span>
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center border border-line transition-colors duration-150 group-hover:border-ink [&>svg]:size-[1.125rem] [&>svg]:stroke-2"
                    >
                      {open ? <MinusIcon /> : <PlusIcon />}
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="quick enter pb-6">
                  <ul className="grid grid-cols-2 gap-x-4">
                    {options.map((option) => (
                      <li key={option.id}>
                        <label className="group/option flex min-h-11 cursor-pointer items-center gap-3 text-base">
                          <input
                            type="checkbox"
                            name={`${group.id}[]`}
                            value={option.id}
                            checked={group.selectedIds.includes(option.id)}
                            onChange={() => toggleOption(group.id, option.id)}
                            className="checkbox"
                          />
                          <span className="min-w-0 py-2 leading-tight hyphens-auto wrap-break-word underline-offset-4 group-hover/option:underline">
                            {option.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}
