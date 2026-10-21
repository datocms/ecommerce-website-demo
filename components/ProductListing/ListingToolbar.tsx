'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import Drawer from '@/components/Common/Drawer';
import { PendingQueryProvider } from './PendingQuery';

type Props = {
  count: number;
  lng: string;
  /** Filter groups that narrow the listing, shown as a count on the trigger */
  activeFilterCount?: number;
  /** Sort tabs, shown in the toolbar */
  sort?: ReactNode;
  searchChip?: ReactNode;
  /** The toolbar follows a filter header instead of the page header */
  hasFilterDetail?: boolean;
  children: ReactNode;
};

const ListingToolbar = ({
  count,
  lng,
  activeFilterCount = 0,
  sort,
  searchChip,
  hasFilterDetail = false,
  children,
}: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isClearing, startClearing] = useTransition();
  const resultsLabel = `${count} ${count === 1 ? 'result' : 'results'}`;

  const currentQuery = useSearchParams().toString();
  const toolbar = useRef<HTMLDivElement>(null);
  const resultsTop = useRef<HTMLDivElement>(null);
  const scrollBackQuery = useRef<string | null>(null);
  const scrollBackWhenQueryLoads = (query: string) => {
    if (query !== currentQuery) scrollBackQuery.current = query;
  };

  // From lg the toolbar sticks, so sort and filters can change far down the list.
  // The new results then start from the top, right under the toolbar; at the top
  // of the page nothing moves. It waits for the drawer to close, whose scroll lock
  // would otherwise put the old position back on iOS
  useLayoutEffect(() => {
    if (open || scrollBackQuery.current !== currentQuery) return;
    scrollBackQuery.current = null;
    const overlap =
      (toolbar.current?.getBoundingClientRect().bottom ?? 0) -
      (resultsTop.current?.getBoundingClientRect().top ?? 0);
    if (overlap > 1) window.scrollBy({ top: -overlap, behavior: 'instant' });
  }, [currentQuery, open]);

  return (
    <PendingQueryProvider onPush={scrollBackWhenQueryLoads}>
      {/* A hairline bar that sticks under the header from lg. Right under the header it
          shares the header's hairline; after a filter header it draws its own, which
          tucks under the header's while stuck. data-chrome keeps it above a results swap */}
      <div
        ref={toolbar}
        data-chrome="toolbar"
        className={`border-b border-line bg-white lg:sticky lg:z-20 ${hasFilterDetail ? 'mt-16 border-t lg:top-[calc(var(--header-h)-1px)] lg:mt-24' : 'lg:top-(--header-h)'}`}
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
              // Re-keyed by the count, so it pops again when the count changes
              <span
                key={activeFilterCount}
                className="tag-dark min-h-6 animate-pop px-1.5"
              >
                <span className="sr-only"> (</span>
                {activeFilterCount}
                <span className="sr-only"> applied)</span>
              </span>
            )}
          </button>
          {sort && (
            <>
              <span
                aria-hidden="true"
                className="hidden h-6 w-px bg-line lg:block"
              />
              {/* Phones and tablets: a row of its own under a hairline, edge to edge.
                  From lg it sits between Filters and the count at its full width */}
              <div className="order-last -mx-(--gutter) w-[calc(100%+2*var(--gutter))] border-t border-line lg:order-none lg:mx-0 lg:w-auto lg:min-w-0 lg:border-t-0">
                {sort}
              </div>
            </>
          )}
          {/* A long search chip truncates before the sort tabs give way: below lg on
              the Filters row, from lg beside the tabs */}
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
      <div ref={resultsTop} />
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
              href={`/${lng}/products`}
              // Pushed in a transition of its own, so the results stay dim (pending-dim)
              // until they land, after the drawer has closed and taken this link with it.
              // Like the drawer's toggles, it updates the grid without the swap
              onNavigate={(event) => {
                event.preventDefault();
                scrollBackWhenQueryLoads('');
                setOpen(false);
                startClearing(() => {
                  router.push(`/${lng}/products`, {
                    scroll: false,
                    transitionTypes: ['filter'],
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
};

export default ListingToolbar;
