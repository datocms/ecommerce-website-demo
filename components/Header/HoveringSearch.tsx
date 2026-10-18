'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';

type PropTypes = {
  lng: string;
  open: boolean;
  onClose: () => void;
  placeholder: string;
};

const HoveringSearch = ({ lng, open, onClose, placeholder }: PropTypes) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('productName');
    router.push(
      `/${lng}/products?productName=${encodeURIComponent(String(value ?? ''))}`,
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-label="Search"
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-xs transition duration-300 ease-out data-closed:opacity-0"
      />
      {/* A cream sheet hanging from the top edge */}
      <DialogPanel
        transition
        className="fixed inset-x-0 top-0 rounded-b-sheet bg-cream shadow-pop transition duration-400 ease-drawer data-leave:duration-250 data-closed:-translate-y-full"
      >
        <div className="shell flex min-h-[calc(var(--header-h)+3.75rem)] items-center gap-2 py-6 sm:gap-3 sm:py-10">
          <search className="flex min-w-0 flex-1">
            <form
              onSubmit={handleSubmit}
              className="flex h-16 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-white pr-2 pl-5 ring-1 ring-border-strong transition-shadow duration-150 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ink sm:h-18 sm:gap-3 sm:pl-7"
            >
              <label htmlFor="site-search" className="sr-only">
                {placeholder}
              </label>
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="size-5 shrink-0 stroke-[2.2] text-muted"
              />
              <input
                id="site-search"
                name="productName"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                data-autofocus
                defaultValue={searchParams.get('productName') ?? ''}
                placeholder={placeholder}
                className="h-full min-w-0 flex-1 bg-transparent text-[1.1875rem] font-medium text-ink outline-none placeholder:text-muted sm:text-[1.375rem] [&::-webkit-search-cancel-button]:appearance-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="icon-btn bg-ink text-cream sm:size-14 [&>svg]:stroke-[2.4]"
              >
                <ArrowRightIcon aria-hidden="true" />
              </button>
            </form>
          </search>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="icon-btn size-12 bg-white sm:size-14 [&>svg]:stroke-[2.4]"
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default HoveringSearch;
