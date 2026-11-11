'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useState, useTransition } from 'react';
import Drawer from '@/components/Common/Drawer';
import { productsPath } from '@/lib/routes';
import AppliedCount from './AppliedCount';
import { FILTER_TRANSITION_TYPES, PendingQueryProvider } from './PendingQuery';
import { useScrollBackUnderToolbar } from './useScrollBackUnderToolbar';

const CLEARED_QUERY = '';

const BAR_WITH_FILTER_DETAIL =
  'mt-16 border-t lg:top-[calc(var(--header-h)-1px)] lg:mt-24';
const BAR_WITHOUT_FILTER_DETAIL = 'lg:top-(--header-h)';

type Props = {
  count: number;
  lng: string;
  /** Filter groups that narrow the listing, shown as a count on the trigger */
  activeFilterCount?: number;
  sort: ReactNode;
  searchChip?: ReactNode;
  /** The toolbar follows a filter header instead of the page header */
  hasFilterDetail?: boolean;
  children: ReactNode;
};

export default function ListingToolbar({
  count,
  lng,
  activeFilterCount = 0,
  sort,
  searchChip,
  hasFilterDetail = false,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isClearing, startClearing] = useTransition();
  const resultsLabel = `${count} ${count === 1 ? 'result' : 'results'}`;

  const { toolbarRef, resultsTopRef, scrollBackWhenQueryLoads } =
    useScrollBackUnderToolbar(open);

  return (
    <PendingQueryProvider onPush={scrollBackWhenQueryLoads}>
      {/* Sticks under the header from lg; data-chrome keeps it above the results swap */}
      <div
        ref={toolbarRef}
        data-chrome="toolbar"
        className={`border-b border-line bg-white lg:sticky lg:z-20 ${hasFilterDetail ? BAR_WITH_FILTER_DETAIL : BAR_WITHOUT_FILTER_DETAIL}`}
      >
        <div className="shell flex flex-wrap items-center gap-x-6 lg:flex-nowrap">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="press -ml-2 inline-flex h-14 shrink-0 items-center gap-2.5 px-2 text-sm font-semibold underline-offset-4 outline-offset-[-2px] hover:underline [&>svg]:size-5"
          >
            <AdjustmentsHorizontalIcon aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <AppliedCount count={activeFilterCount} />
            )}
          </button>
          <span
            aria-hidden="true"
            className="hidden h-6 w-px bg-line lg:block"
          />
          <div className="order-last -mx-(--gutter) w-[calc(100%+2*var(--gutter))] border-t border-line lg:order-none lg:mx-0 lg:w-auto lg:min-w-0 lg:border-t-0">
            {sort}
          </div>
          {/* From lg this group shrinks first, so a long search chip truncates before the sort tabs do */}
          <div className="ml-auto flex min-w-0 items-center justify-end gap-4 max-lg:flex-1 max-lg:basis-0 lg:shrink-[999]">
            {searchChip}
            <p
              className="shrink-0 text-sm text-mute tabular-nums"
              aria-live="polite"
            >
              {resultsLabel}
            </p>
          </div>
        </div>
      </div>
      {/* Where the results start: the toolbar's bottom edge while it isn't stuck */}
      <div ref={resultsTopRef} />
      {/* Dims the results (pending-dim) until the cleared listing lands */}
      {isClearing && <span data-pending hidden />}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        title="Filters"
        closeLabel="Close filters"
        footer={
          <div className="flex items-center gap-6">
            <p role="status" className="sr-only">
              {resultsLabel}
            </p>
            <Link
              href={productsPath(lng)}
              // setOpen(false) unmounts this link, so its own transition keeps the results dimmed
              // until they land
              onNavigate={(event) => {
                event.preventDefault();
                scrollBackWhenQueryLoads(CLEARED_QUERY);
                setOpen(false);
                startClearing(() => {
                  router.push(productsPath(lng), {
                    scroll: false,
                    transitionTypes: FILTER_TRANSITION_TYPES,
                  });
                });
              }}
              className="link-underline inline-flex min-h-11 shrink-0 items-center text-sm font-semibold"
            >
              Clear all
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn flex-1 tabular-nums"
            >
              Show {resultsLabel}
            </button>
          </div>
        }
      >
        {children}
      </Drawer>
    </PendingQueryProvider>
  );
}
