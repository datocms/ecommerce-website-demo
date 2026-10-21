'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LinkPending from '@/components/Common/LinkPending';

type PropTypes = {
  numberOfProducts: number;
  currentPage: number;
  pageSize: number;
};

const Pagination = ({ numberOfProducts, currentPage, pageSize }: PropTypes) => {
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(numberOfProducts / pageSize);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const firstProductIndex = (currentPage - 1) * pageSize + 1;
  const lastProductIndex = Math.min(currentPage * pageSize, numberOfProducts);

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}`;
  }

  // One page needs no pager: the toolbar already shows the count
  if (totalPages < 2 || currentPage < 1 || currentPage > totalPages)
    return null;

  return (
    // From lg focus scrolls the links clear of the stuck toolbar as well as the header
    <div className="shell mt-12 flex flex-col-reverse items-center gap-5 sm:flex-row sm:justify-between lg:mt-16 lg:[&_a]:scroll-mt-[calc(3.5rem+1px)]">
      {/* A position, not a second counter: the toolbar already shows the total */}
      <p className="text-sm text-mute tabular-nums">
        <span className="sr-only">Showing </span>
        {firstProductIndex}–{lastProductIndex} of {numberOfProducts}
        <span className="sr-only">
          {numberOfProducts === 1 ? ' result' : ' results'}
        </span>
      </p>
      {/* Both arrows always render, so the numbers never shift between pages */}
      <nav aria-label="Pagination" className="flex max-w-full items-center">
        {hasPrevious ? (
          <Link
            href={pageHref(currentPage - 1)}
            aria-label="Previous page"
            className="rail-btn"
          >
            <ChevronLeftIcon aria-hidden="true" className="stroke-2" />
            <LinkPending />
          </Link>
        ) : (
          <span aria-hidden="true" aria-disabled="true" className="rail-btn">
            <ChevronLeftIcon className="stroke-2" />
          </span>
        )}
        {/* Many pages scroll here, so the rings sit inside the squares */}
        <span className="no-scrollbar mx-2 flex min-w-0 gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Link
                key={page}
                href={pageHref(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`grid size-11 shrink-0 place-items-center text-sm font-semibold tabular-nums outline-offset-[-2px] press ${page === currentPage ? 'bg-ink text-white focus-visible:outline-white' : 'hover:bg-mist'}`}
              >
                {page}
                <LinkPending />
              </Link>
            ),
          )}
        </span>
        {hasNext ? (
          <Link
            href={pageHref(currentPage + 1)}
            aria-label="Next page"
            className="rail-btn"
          >
            <ChevronRightIcon aria-hidden="true" className="stroke-2" />
            <LinkPending />
          </Link>
        ) : (
          <span aria-hidden="true" aria-disabled="true" className="rail-btn">
            <ChevronRightIcon className="stroke-2" />
          </span>
        )}
      </nav>
    </div>
  );
};

export default Pagination;
