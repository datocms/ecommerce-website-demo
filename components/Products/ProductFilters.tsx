'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import Drawer from '@/components/Common/Drawer';
import { PendingQueryProvider } from '@/components/Common/SideFilter';

type PropTypes = {
  count: number;
  lng: string;
  /** Filter groups that narrow the listing, shown as a badge on the trigger */
  narrowed?: number;
  /** Sort chips, shown in the toolbar */
  sort?: ReactNode;
  searchChip?: ReactNode;
  /** The toolbar follows a filter header instead of the page header */
  framed?: boolean;
  children: ReactNode;
};

const ProductFilters = ({
  count,
  lng,
  narrowed = 0,
  sort,
  searchChip,
  framed = false,
  children,
}: PropTypes) => {
  const [open, setOpen] = useState(false);
  const results = `${count} ${count === 1 ? 'result' : 'results'}`;

  return (
    <PendingQueryProvider>
      <div className={`shell ${framed ? 'pt-8' : 'pt-6'} lg:pt-10`}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={`chip shrink-0 gap-2 pl-4 font-bold ${narrowed ? 'pr-2' : 'pr-5'}`}
          >
            <AdjustmentsHorizontalIcon aria-hidden="true" />
            Filters
            {narrowed > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs font-bold text-cream tabular-nums">
                <span className="sr-only"> (</span>
                {narrowed}
                <span className="sr-only"> applied)</span>
              </span>
            )}
          </button>
          {sort && (
            // Phones and tablets: a row of its own that scrolls edge to edge.
            // From lg it sizes to its chips, so a long search chip wraps to the
            // next line instead of squeezing the sort options
            <div className="order-last -mx-(--gutter) w-[calc(100%+2*var(--gutter))] lg:order-none lg:-my-1 lg:mx-0 lg:w-auto lg:min-w-0 lg:flex-auto">
              {sort}
            </div>
          )}
          {/* Below lg it shares the Filters row, so a long search chip
              truncates there instead of wrapping to a row of its own */}
          <div className="ml-auto flex min-w-0 items-center justify-end gap-3 max-lg:flex-1 max-lg:basis-0">
            {searchChip}
            <p
              className="shrink-0 text-sm font-semibold text-muted tabular-nums"
              aria-live="polite"
            >
              {results}
            </p>
          </div>
        </div>
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        title="Filters"
        closeLabel="Close filters"
        footer={
          <div className="flex items-center gap-5">
            <p role="status" className="sr-only">
              {results}
            </p>
            <Link
              href={`/${lng}/products`}
              scroll={false}
              onClick={() => setOpen(false)}
              className="link-cta shrink-0 text-sm"
            >
              Clear all
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-primary flex-1 tabular-nums"
            >
              Show {results}
            </button>
          </div>
        }
      >
        {children}
      </Drawer>
    </PendingQueryProvider>
  );
};

export default ProductFilters;
