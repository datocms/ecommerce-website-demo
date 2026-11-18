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

// The demo's own notices are not CMS content, so they stay in English
export const DEMO_NOTICE_TITLE = 'This is a DatoCMS Demo';
export const DEMO_NOTICE_TEXT =
  'To use the cart, enable purchases or collect reviews, an integration with a tool like Shopify or Commerce Layer is necessary.';

type NoticeProps = {
  open: boolean;
  onClose: () => void;
  /** Replaces the commerce text, for actions another kind of tool would handle */
  text?: string;
};

// Explains that the demo cannot perform an action, and what would
export function DemoNotice({
  open,
  onClose,
  text = DEMO_NOTICE_TEXT,
}: NoticeProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop transition className={SCRIM} />
      <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4 sm:p-8">
        <DialogPanel
          transition
          className="pop relative w-full max-w-[28rem] bg-white p-(--inset) sm:p-10"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="icon-btn absolute top-2 right-2 [&>svg]:size-5.5"
          >
            <XMarkIcon aria-hidden="true" />
          </button>
          <DialogTitle className="title-card pr-8">
            {DEMO_NOTICE_TITLE}
          </DialogTitle>
          <p className="mt-3 text-md text-pretty text-ink-2">{text}</p>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="btn mt-8 w-full"
          >
            Got it
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick'>;

// A storefront action the demo can't perform: the button keeps its look and opens the notice
export default function DemoActionButton({ children, ...rest }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button {...rest} type="button" onClick={() => setOpen(true)}>
        {children}
      </button>
      <DemoNotice open={open} onClose={() => setOpen(false)} />
    </>
  );
}
