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
} from 'react';
import { ProductsGeneralInterfaceFragment } from '@/components/Products/GeneralInterface/fragments';
import { InitialParamsFragment } from '@/components/Products/InitialParams/fragments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

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
function usePendingQueryState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.toString());
  useEffect(() => {
    setQuery(searchParams.toString());
  }, [searchParams]);

  function exportQueryParameters(key: string, value: string) {
    const params = new URLSearchParams(query);
    params.set(key, value);
    params.delete('page');
    setQuery(params.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return { pendingParams: new URLSearchParams(query), exportQueryParameters };
}

const PendingQueryContext = createContext<ReturnType<
  typeof usePendingQueryState
> | null>(null);

/** Lets the toolbar sort chips and the drawer build on the same pending query */
export function PendingQueryProvider({ children }: { children: ReactNode }) {
  const pendingQuery = usePendingQueryState();
  return (
    <PendingQueryContext.Provider value={pendingQuery}>
      {children}
    </PendingQueryContext.Provider>
  );
}

function usePendingQuery() {
  const pendingQuery = useContext(PendingQueryContext);
  if (!pendingQuery)
    throw new Error('Sort and filter controls need a PendingQueryProvider');
  return pendingQuery;
}

function SortButtons({
  generalInterface,
  current,
  onSelect,
  className = '',
}: {
  generalInterface: GeneralInterface;
  current: string | null;
  onSelect: (value: string) => void;
  className?: string;
}) {
  const { newArrivals, mostPopular, topRated, price, sales } =
    readFragment(ProductsGeneralInterfaceFragment, generalInterface) ?? {};

  const sortOptions = [
    { label: newArrivals, value: '_publishedAt_DESC' },
    { label: mostPopular, value: 'numberOfReviews_DESC' },
    { label: topRated, value: 'reviewAverage_DESC' },
    { label: price, value: 'price_DESC' },
    { label: sales, value: 'sale_DESC' },
  ];

  return sortOptions.map((sortOption) => {
    const isSelected = current === sortOption.value;
    return (
      <button
        key={sortOption.value}
        type="button"
        value={sortOption.value}
        aria-pressed={isSelected}
        onClick={() => onSelect(sortOption.value)}
        className={`chip shrink-0 ${className}`}
      >
        {isSelected && (
          <CheckIcon aria-hidden="true" className="stroke-[2.4]" />
        )}
        {sortOption.label}
      </button>
    );
  });
}

/** The sort chips of the listing toolbar */
export function SortChips({
  generalInterface,
}: {
  generalInterface: GeneralInterface;
}) {
  const { pendingParams, exportQueryParameters } = usePendingQuery();
  const current = pendingParams.get('orderBy');

  // Where the row scrolls (below lg), bring the selected chip into view without
  // moving the page
  const scroller = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    const row = scroller.current;
    const chip =
      current && row?.querySelector(`button[value="${CSS.escape(current)}"]`);
    if (!row || !chip) return;
    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < rowBox.left || chipBox.right > rowBox.right)
      row.scrollLeft +=
        chipBox.left + chipBox.width / 2 - (rowBox.left + rowBox.width / 2);
  }, [current]);

  return (
    <fieldset
      ref={scroller}
      aria-label="Sort"
      className="no-scrollbar flex min-w-0 scroll-px-(--gutter) items-center gap-2 overflow-x-auto px-(--gutter) py-1 lg:flex-wrap lg:overflow-visible lg:pr-0 lg:pl-1"
    >
      <span
        aria-hidden="true"
        className="grid h-10.5 shrink-0 place-items-center pr-1 text-muted lg:border-l lg:border-line lg:pl-3 [&>svg]:size-[1.125rem]"
      >
        <ArrowsUpDownIcon />
      </span>
      <SortButtons
        generalInterface={generalInterface}
        current={current}
        onSelect={(value) => exportQueryParameters('orderBy', value)}
      />
    </fieldset>
  );
}

const SideFilter = ({
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

  return (
    <div>
      <fieldset
        aria-label="Sort"
        className="flex min-w-0 flex-wrap items-center gap-2 pb-6"
      >
        <span
          aria-hidden="true"
          className="grid size-10.5 place-items-center text-muted [&>svg]:size-[1.125rem]"
        >
          <ArrowsUpDownIcon />
        </span>
        <SortButtons
          generalInterface={generalInterface}
          current={pendingParams.get('orderBy')}
          onSelect={(value) => exportQueryParameters('orderBy', value)}
          className="bg-cream shadow-none"
        />
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
                  <DisclosureButton className="group flex min-h-17 w-full items-center justify-between gap-4 py-3 text-left">
                    <span className="title-sm flex items-center gap-2.5">
                      {section.name}
                      {narrowed && (
                        <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-ink px-1.5 font-sans text-xs font-bold tracking-normal text-cream tabular-nums">
                          <span className="sr-only"> (</span>
                          {checked}
                          <span className="sr-only"> applied)</span>
                        </span>
                      )}
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream transition-colors duration-150 [&>svg]:size-[1.0625rem] [&>svg]:stroke-[2.4] group-hover:bg-ink group-hover:text-cream">
                      {open ? (
                        <MinusIcon aria-hidden="true" />
                      ) : (
                        <PlusIcon aria-hidden="true" />
                      )}
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pb-5">
                  <ul className="-mx-2 grid grid-cols-2 gap-x-2">
                    {options.map((option) => (
                      <li key={option.id}>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-base font-medium transition-colors duration-150 hover:bg-cream">
                          <input
                            type="checkbox"
                            name={`${section.id}[]`}
                            value={option.id}
                            checked={selected(section.id).includes(option.id)}
                            onChange={() => toggleOption(section.id, option.id)}
                            className="checkbox"
                          />
                          <span className="min-w-0 py-2 leading-tight">
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

export default SideFilter;
