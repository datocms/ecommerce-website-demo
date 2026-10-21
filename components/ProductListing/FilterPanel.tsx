'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import {
  ArrowsUpDownIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import {
  InitialParamsFragment,
  ProductsGeneralInterfaceFragment,
} from './fragments';

type GeneralInterface =
  | FragmentOf<typeof ProductsGeneralInterfaceFragment>
  | null
  | undefined;

type PropTypes = {
  initialParams: FragmentOf<typeof InitialParamsFragment> | null | undefined;
  generalInterface: GeneralInterface;
  paramaterCollections: string[];
  parameterBrands: string[];
  parameterMaterials: string[];
};

type FilterKey = 'collections' | 'materials' | 'brands';

// Pending query: quick successive clicks build on each other instead of on the
// URL of the navigation that hasn't landed yet
function usePendingQueryState(onPush?: (query: string) => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.toString());
  useEffect(() => {
    setQuery(searchParams.toString());
  }, [searchParams]);

  // In a transition, so isPending lasts until the new listing commits. The drawer passes
  // the "filter" type: its grid updates behind the scrim, without the swap
  function exportQueryParameters(
    key: string,
    value: string,
    transitionTypes?: string[],
  ) {
    const params = new URLSearchParams(query);
    params.set(key, value);
    params.delete('page');
    const next = params.toString();
    setQuery(next);
    onPush?.(next);
    startTransition(() => {
      router.push(`?${next}`, { scroll: false, transitionTypes });
    });
  }

  return {
    pendingParams: new URLSearchParams(query),
    exportQueryParameters,
    isPending,
  };
}

const PendingQueryContext = createContext<ReturnType<
  typeof usePendingQueryState
> | null>(null);

/** Lets the toolbar sort tabs and the drawer build on the same pending query */
export function PendingQueryProvider({
  children,
  onPush,
}: {
  children: ReactNode;
  /** Called with each query a sort or filter change navigates to */
  onPush?: (query: string) => void;
}) {
  const pendingQuery = usePendingQueryState(onPush);
  return (
    <PendingQueryContext.Provider value={pendingQuery}>
      {children}
      {/* Dims the results (pending-dim) while the listing is on its way */}
      {pendingQuery.isPending && <span data-pending hidden />}
    </PendingQueryContext.Provider>
  );
}

function usePendingQuery() {
  const pendingQuery = useContext(PendingQueryContext);
  if (!pendingQuery)
    throw new Error('Sort and filter controls need a PendingQueryProvider');
  return pendingQuery;
}

function getSortOptions(generalInterface: GeneralInterface) {
  const { newArrivals, mostPopular, topRated, price, sales } =
    readFragment(ProductsGeneralInterfaceFragment, generalInterface) ?? {};

  return [
    { label: newArrivals, value: '_publishedAt_DESC' },
    { label: mostPopular, value: 'numberOfReviews_DESC' },
    { label: topRated, value: 'reviewAverage_DESC' },
    { label: price, value: 'price_DESC' },
    { label: sales, value: 'sale_DESC' },
  ];
}

/** The sort tabs of the listing toolbar: the header nav's ink bar, on the toolbar's hairline */
export function SortTabs({
  generalInterface,
}: {
  generalInterface: GeneralInterface;
}) {
  const { pendingParams, exportQueryParameters } = usePendingQuery();
  const current = pendingParams.get('orderBy');
  const sortOptions = getSortOptions(generalInterface);

  // Where the row scrolls, bring the selected tab into view without moving the page
  const scroller = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const row = scroller.current;
    const tab =
      current && row?.querySelector(`button[value="${CSS.escape(current)}"]`);
    if (!row || !tab) return;
    const rowBox = row.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    if (tabBox.left < rowBox.left || tabBox.right > rowBox.right)
      row.scrollLeft +=
        tabBox.left + tabBox.width / 2 - (rowBox.left + rowBox.width / 2);
  }, [current]);

  return (
    // One pixel taller than its row, so the bars cover the toolbar's bottom hairline
    <fieldset
      ref={scroller}
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
          aria-pressed={current === sortOption.value}
          onClick={() => exportQueryParameters('orderBy', sortOption.value)}
          className="bar-draw relative inline-flex shrink-0 items-center px-2 text-sm font-medium whitespace-nowrap text-ink-2 transition-colors duration-150 outline-offset-[-2px] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-ink hover:text-ink hover:after:scale-x-100 aria-pressed:text-ink aria-pressed:after:scale-x-100"
        >
          {sortOption.label}
        </button>
      ))}
    </fieldset>
  );
}

const FilterPanel = ({
  initialParams,
  paramaterCollections,
  parameterBrands,
  parameterMaterials,
  generalInterface,
}: PropTypes) => {
  const { pendingParams, exportQueryParameters } = usePendingQuery();

  // Missing params mean the server default (every option), which the props hold
  const selectedFromProps: Record<FilterKey, string[]> = {
    collections: paramaterCollections.filter((parameter) => parameter !== ''),
    materials: parameterMaterials.filter((parameter) => parameter !== ''),
    brands: parameterBrands.filter((parameter) => parameter !== ''),
  };
  const selected = (key: FilterKey) =>
    pendingParams.has(key)
      ? (pendingParams.get(key) ?? '').split('|').filter(Boolean)
      : selectedFromProps[key];

  const { BrandRecord, MaterialRecord, CollectionRecord } =
    readFragment(ProductsGeneralInterfaceFragment, generalInterface) ?? {};

  const { allCollections, allBrands, allMaterials } =
    readFragment(InitialParamsFragment, initialParams) ?? {};

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
    exportQueryParameters(
      key,
      (current.includes(id)
        ? current.filter((option) => option !== id)
        : [...current, id]
      ).join('|'),
      ['filter'],
    );
  }

  const groups = filters.map((section) => {
    const options = section.options ?? [];
    const checked = options.filter((option) =>
      selected(section.id).includes(option.id),
    ).length;
    return {
      ...section,
      options,
      checked,
      narrowed: checked !== options.length,
    };
  });
  // Groups that narrow the listing start open; with none, the first one does,
  // so the drawer never opens fully folded
  const anyNarrowed = groups.some((group) => group.narrowed);

  const current = pendingParams.get('orderBy');

  return (
    // While it is open, the grid behind it updates at once (data-filter-drawer in global.css)
    <div data-filter-drawer>
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
        {getSortOptions(generalInterface).map((sortOption) => {
          const isSelected = current === sortOption.value;
          return (
            <button
              key={sortOption.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                exportQueryParameters('orderBy', sortOption.value, ['filter'])
              }
              className="chip shrink-0"
            >
              {isSelected && (
                <CheckIcon
                  aria-hidden="true"
                  className="animate-pop stroke-2"
                />
              )}
              {sortOption.label}
            </button>
          );
        })}
      </fieldset>

      {groups.map((section, index) => {
        const { options, checked, narrowed } = section;
        return (
          <Disclosure
            key={section.id}
            as="div"
            defaultOpen={narrowed || (!anyNarrowed && index === 0)}
            className="border-t border-line"
          >
            {({ open }) => (
              <>
                <h3>
                  <DisclosureButton className="group flex min-h-16 w-full items-center justify-between gap-4 py-2 text-left">
                    <span className="title-item flex items-center gap-3">
                      {section.name}
                      {narrowed && (
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
                            name={`${section.id}[]`}
                            value={option.id}
                            checked={selected(section.id).includes(option.id)}
                            onChange={() => toggleOption(section.id, option.id)}
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
};

export default FilterPanel;
