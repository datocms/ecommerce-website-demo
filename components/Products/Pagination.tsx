'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';

type PropTypes = {
  numberOfProducts: number;
  currentPage: number;
};

const Pagination = ({ numberOfProducts, currentPage }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pageItems = [];

  function exportQueryParameters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  }

  for (let i = 1; i < numberOfProducts; i += 12) {
    const pageNumber = (i - 1) / 12 + 1;
    const isSelected = pageNumber === currentPage;
    pageItems.push(
      <button
        type="button"
        aria-current="page"
        className={`relative inline-flex cursor-pointer items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 focus-visible:outline-primary/80${
          isSelected ? ' bg-primary text-white' : ' text-gray-900'
        }`}
        onClick={() => {
          exportQueryParameters('page', pageNumber.toString());
        }}
      >
        {pageNumber}
      </button>,
    );
  }

  const firstProductIndex = 1 + (currentPage - 1) * 12;
  const lastProductIndex =
    1 + currentPage * 12 < numberOfProducts
      ? 1 + currentPage * 12
      : numberOfProducts;

  return (
    <div className="mx-auto mb-8 flex max-w-7xl items-center justify-center border-gray-200 bg-white px-4 pt-12 sm:mb-0 sm:px-6">
      <div className="justify-center gap-8 sm:flex sm:flex-1 sm:items-center md:justify-end">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{firstProductIndex}</span> to{' '}
            <span className="font-medium">{lastProductIndex}</span> of{' '}
            <span className="font-medium">{numberOfProducts}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {currentPage !== 1 && (
              <button
                type="button"
                onClick={() => {
                  exportQueryParameters('page', (currentPage - 1).toString());
                }}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            {pageItems.map((item) => {
              return item;
            })}
            {!(lastProductIndex === numberOfProducts) && (
              <button
                type="button"
                onClick={() => {
                  exportQueryParameters('page', (currentPage + 1).toString());
                }}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
