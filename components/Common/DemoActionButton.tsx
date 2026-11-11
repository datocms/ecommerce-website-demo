'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { type ComponentPropsWithoutRef, useState } from 'react';
import { SCRIM } from './styles';

export const DEMO_NOTICE_TITLE = 'This is a DatoCMS Demo';
export const DEMO_NOTICE_TEXT =
  'To use the cart, enable purchases or collect reviews, an integration with a tool like Shopify or Commerce Layer is necessary.';

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick'>;

// A storefront action the demo can't perform: the button keeps its look and opens a notice that
// a commerce integration would handle it
export default function DemoActionButton({ children, ...rest }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button {...rest} type="button" onClick={() => setOpen(true)}>
        {children}
      </button>
      <Dialog open={open} onClose={close} className="relative z-50">
        <DialogBackdrop transition className={SCRIM} />
        <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4 sm:p-8">
          <DialogPanel
            transition
            className="pop relative w-full max-w-[28rem] bg-white p-(--inset) sm:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="icon-btn absolute top-2 right-2 [&>svg]:size-5.5"
            >
              <XMarkIcon aria-hidden="true" />
            </button>
            <DialogTitle className="title-card pr-8">
              {DEMO_NOTICE_TITLE}
            </DialogTitle>
            <p className="mt-3 text-md text-pretty text-ink-2">
              {DEMO_NOTICE_TEXT}
            </p>
            <button
              type="button"
              onClick={close}
              data-autofocus
              className="btn mt-8 w-full"
            >
              Got it
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
