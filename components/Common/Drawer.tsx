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
  title: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
};

// A full-height white panel from the viewport edge over a flat ink scrim: the whole screen on
// phones, 460px from there. Content and footer pad by --inset (20px, 32px from sm).
export default function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  footer,
  children,
  closeLabel = 'Close',
}: DrawerProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 transition-opacity duration-300 ease-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className={[
          'fixed inset-y-0 flex w-full max-w-[28.75rem] flex-col overflow-hidden bg-white transition duration-300 ease-drawer data-leave:duration-200',
          side === 'left'
            ? 'left-0 data-closed:-translate-x-full'
            : 'right-0 data-closed:translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line pr-2 pl-(--inset) sm:h-18 sm:pr-4">
          <DialogTitle className="title-card flex min-w-0 items-center gap-2.5">
            {title}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="icon-btn [&>svg]:size-5.5"
            data-autofocus
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-(--inset) pt-6 pb-(--inset)">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-line px-(--inset) pt-5 pb-(--inset)">
            {footer}
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
}
