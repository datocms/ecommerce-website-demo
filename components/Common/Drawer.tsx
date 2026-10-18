'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  /** white for cart and filters; cream for a sheet of white cards, like the mobile menu */
  tone?: 'white' | 'cream';
  title: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
};

// A floating rounded sheet over the blurred scrim. Content and footer pad by --inset (24px here).
// On cream the header is a white floating bar, like the page header's, and the cards scroll under it.
export default function Drawer({
  open,
  onClose,
  side = 'right',
  tone = 'white',
  title,
  footer,
  children,
  closeLabel = 'Close',
}: DrawerProps) {
  const cream = tone === 'cream';
  const header = (
    <>
      <DialogTitle className="title-md flex min-w-0 items-center gap-2.5">
        {title}
      </DialogTitle>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="icon-btn bg-cream text-ink"
        data-autofocus
      >
        <XMarkIcon aria-hidden="true" />
      </button>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-xs transition duration-300 ease-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className={[
          'fixed inset-y-2 flex w-[calc(100vw-1rem)] max-w-[28.75rem] flex-col rounded-sheet shadow-pop transition duration-400 ease-drawer [--inset:1.5rem] data-leave:duration-250 sm:inset-y-3',
          cream
            ? 'overflow-y-auto overscroll-contain bg-cream'
            : 'overflow-hidden bg-white',
          side === 'left'
            ? 'left-2 data-closed:-translate-x-[calc(100%+1rem)] sm:left-3'
            : 'right-2 data-closed:translate-x-[calc(100%+1rem)] sm:right-3',
        ].join(' ')}
      >
        {cream ? (
          <div className="sticky top-0 z-10 shrink-0 bg-cream/85 p-2 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between gap-4 rounded-nav bg-white pr-2 pl-4 shadow-card">
              {header}
            </div>
          </div>
        ) : (
          <div className="flex min-h-19 shrink-0 items-center justify-between gap-4 py-3 pr-4 pl-(--inset)">
            {header}
          </div>
        )}
        <div
          className={`flex flex-1 flex-col px-(--inset) pb-(--inset) ${cream ? 'pt-1' : 'overflow-y-auto'}`}
        >
          {children}
        </div>
        {footer && (
          <div
            className={`shrink-0 border-t border-line px-(--inset) pt-5 pb-(--inset) ${cream ? 'sticky bottom-0 bg-cream' : ''}`}
          >
            {footer}
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
}
