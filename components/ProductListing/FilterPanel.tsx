'use client';

import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import FilterGroup from './FilterGroup';
import { type FilterKey, isNarrowed, joinIds, splitIds } from './filterParams';
import {
  FilterOptionsFragment,
  type ProductListingLabels,
  ProductListingLabelsFragment,
} from './fragments';
import { FILTER_TRANSITION_TYPES, usePendingQuery } from './PendingQuery';
import SortChips from './SortChips';

type Props = {
  filterOptions: FragmentOf<typeof FilterOptionsFragment>;
  labels: ProductListingLabels;
  selectedCollections: string[];
  selectedBrands: string[];
  selectedMaterials: string[];
};

export default function FilterPanel({
  filterOptions,
  selectedCollections,
  selectedBrands,
  selectedMaterials,
  labels,
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
      ? splitIds(pendingParams.get(key) ?? '')
      : selectedFromProps[key];

  const {
    CollectionRecord: collectionLabel,
    MaterialRecord: materialLabel,
    BrandRecord: brandLabel,
  } = readFragment(ProductListingLabelsFragment, labels) ?? {};

  const { allCollections, allBrands, allMaterials } = readFragment(
    FilterOptionsFragment,
    filterOptions,
  );

  const filters: {
    id: FilterKey;
    name: string | null | undefined;
    options: { id: string; name: string }[];
  }[] = [
    { id: 'collections', name: collectionLabel, options: allCollections },
    { id: 'materials', name: materialLabel, options: allMaterials },
    { id: 'brands', name: brandLabel, options: allBrands },
  ];

  function toggleOption(key: FilterKey, id: string) {
    const current = selected(key);
    pushQueryParam(
      key,
      joinIds(
        current.includes(id)
          ? current.filter((option) => option !== id)
          : [...current, id],
      ),
      FILTER_TRANSITION_TYPES,
    );
  }

  const groups = filters.map((group) => {
    const selectedIds = selected(group.id);
    const checked = group.options.filter((option) =>
      selectedIds.includes(option.id),
    ).length;
    return {
      ...group,
      selectedIds,
      checked,
      narrowed: isNarrowed(selectedIds, group.options),
    };
  });
  // Groups that narrow the listing start open; with none, the first one does,
  // so the drawer never opens fully folded
  const anyNarrowed = groups.some((group) => group.narrowed);

  return (
    // While it is open, the grid behind it updates at once (data-filter-drawer in
    // view-transitions.css)
    <div data-filter-drawer>
      <SortChips labels={labels} />

      {groups.map((group, index) => (
        <FilterGroup
          key={group.id}
          id={group.id}
          name={group.name}
          options={group.options}
          selectedIds={group.selectedIds}
          checked={group.checked}
          narrowed={group.narrowed}
          defaultOpen={group.narrowed || (!anyNarrowed && index === 0)}
          onToggle={(optionId) => toggleOption(group.id, optionId)}
        />
      ))}
    </div>
  );
}
