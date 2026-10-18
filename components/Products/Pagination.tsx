'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type PropTypes = {
  numberOfProducts: number;
  currentPage: number;
  pageSize: number;
};

const DISC =
  'grid size-11 shrink-0 place-items-center rounded-full [&>svg]:size-5 [&>svg]:stroke-[2.4]';

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
    <div className="shell mt-10 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between lg:mt-14">
      {/* A position, not a second counter: the toolbar already shows the total */}
      <p className="text-sm font-semibold text-muted tabular-nums">
        <span className="sr-only">Showing </span>
        {firstProductIndex}–{lastProductIndex} of {numberOfProducts}
        <span className="sr-only">
          {numberOfProducts === 1 ? ' result' : ' results'}
        </span>
      </p>
      {/* Both chevrons always render, so the numbers never shift between pages */}
      <nav
        aria-label="Pagination"
        className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-card"
      >
        {hasPrevious ? (
          <Link
            href={pageHref(currentPage - 1)}
            aria-label="Previous page"
            className={`${DISC} transition-colors duration-150 hover:bg-cream`}
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${DISC} text-disabled`}>
            <ChevronLeftIcon />
          </span>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <Link
              key={page}
              href={pageHref(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`${DISC} text-base font-bold tabular-nums transition-colors duration-150 ${page === currentPage ? 'bg-ink text-cream' : 'hover:bg-cream'}`}
            >
              {page}
            </Link>
          ),
        )}
        {hasNext ? (
          <Link
            href={pageHref(currentPage + 1)}
            aria-label="Next page"
            className={`${DISC} transition-colors duration-150 hover:bg-cream`}
          >
            <ChevronRightIcon aria-hidden="true" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${DISC} text-disabled`}>
            <ChevronRightIcon />
          </span>
        )}
      </nav>
    </div>
  );
};

export default Pagination;
