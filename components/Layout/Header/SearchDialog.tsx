'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { productSearchHref } from './menu';

type Props = {
  lng: string;
  open: boolean;
  onClose: () => void;
  placeholder: string;
  /** Height the sheet covers at least: the strip and header above the page */
  minHeight?: number;
};

export default function SearchDialog({
  lng,
  open,
  onClose,
  placeholder,
  minHeight,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(
      productSearchHref(
        lng,
        new FormData(event.currentTarget).get('productName'),
      ),
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
        data-chrome="sheet-scrim"
        className="fixed inset-0 bg-ink/30 transition-opacity duration-(--dur-sheet) ease-out data-closed:opacity-0 data-leave:duration-(--dur-pop)"
      />
      {/* A white sheet hanging from the top edge */}
      <DialogPanel
        transition
        data-chrome="sheet"
        className="quick fixed inset-x-0 top-0 border-b border-line bg-white transition duration-(--dur-sheet) ease-drawer data-leave:duration-(--dur-pop) data-closed:-translate-y-full"
      >
        <div
          className="enter-stagger shell flex items-center gap-2 py-6 sm:gap-4 sm:py-8 lg:py-10 [--delay:60ms]"
          style={{ minHeight }}
        >
          <search className="min-w-0 flex-1">
            {/* The 2px rule is the field: ink while it has focus */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 border-b-2 border-line-strong pb-2 transition-colors duration-150 has-[input:focus]:border-ink lg:gap-4"
            >
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="hidden size-6 shrink-0 text-mute sm:block"
              />
              <label htmlFor="site-search" className="sr-only">
                {placeholder}
              </label>
              <input
                id="site-search"
                name="productName"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                data-autofocus
                defaultValue={searchParams.get('productName') ?? ''}
                placeholder={placeholder}
                // 17px under 360px, so every locale's placeholder still fits whole beside the
                // two buttons at 320
                className="h-12 min-w-0 flex-1 bg-transparent text-xl font-medium tracking-[-0.02em] text-ink outline-none placeholder:text-mute max-[22.5rem]:text-md sm:h-16 sm:text-2xl lg:text-[2rem] [&::-webkit-search-cancel-button]:appearance-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="btn btn-sm size-11 shrink-0 px-0 lg:size-13 lg:min-h-13 lg:[&>svg]:size-4.5"
              >
                <ArrowRightIcon aria-hidden="true" className="stroke-2" />
              </button>
            </form>
          </search>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            // mb: centred on the field rather than on the field plus its rule
            className="icon-btn mb-2.5 lg:size-13 [&>svg]:size-6"
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
