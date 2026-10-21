'use client';

import { stripStega } from '@datocms/content-link';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';

type Popup = NonNullable<NonNullable<LayoutQuery['layout']>['popup']>;

type Props = {
  open: boolean;
  onClose: () => void;
  popup: Popup;
  globalPageProps: ResolvedGlobalPageProps;
};

export default function PopupDialog({
  open,
  onClose,
  popup,
  globalPageProps,
}: Props) {
  const button = popup.button[0];

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 transition-opacity duration-(--dur-sheet) ease-out data-closed:opacity-0 data-leave:duration-(--dur-pop)"
      />
      <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4 sm:p-8">
        <DialogPanel
          transition
          className="pop relative grid w-full max-w-[55rem] bg-white md:grid-cols-2"
        >
          {/* Over the photo on phones, in the white text column from md */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-autofocus
            className="icon-btn absolute top-2 right-2 z-10 bg-white [&>svg]:size-5.5"
          >
            <XMarkIcon aria-hidden="true" />
          </button>

          <div className={`${MEDIA} aspect-[16/10] md:aspect-[4/5]`}>
            {popup.popupImage?.responsiveImage && (
              <DatoImage
                fragment={popup.popupImage.responsiveImage}
                layout="fill"
                objectFit="cover"
                sizes="(min-width: 768px) 27.5rem, 100vw"
              />
            )}
          </div>

          <div className="flex flex-col justify-center p-(--inset) sm:p-10">
            {popup.preTitle && (
              <p className="eyebrow text-mute md:pr-10">{popup.preTitle}</p>
            )}
            <DialogTitle
              className={`title-statement ${popup.preTitle ? 'mt-4' : 'md:pr-10'}`}
            >
              {popup.title}
            </DialogTitle>
            {popup.subtitle && (
              <p className="mt-5 text-md text-pretty text-ink-2">
                {popup.subtitle}
              </p>
            )}
            {button && (
              <Link
                onClick={onClose}
                className="btn mt-8 w-full"
                href={`/${globalPageProps.params.lng}/${stripStega(button.slug)}`}
              >
                {button.label}
                <ArrowRightIcon aria-hidden="true" className="stroke-2" />
              </Link>
            )}
            {(popup.dismissButtonLabel || popup.underText) && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                {popup.dismissButtonLabel && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="link-underline relative text-sm font-semibold after:absolute after:-inset-x-1 after:-inset-y-3"
                  >
                    {popup.dismissButtonLabel}
                  </button>
                )}
                {popup.underText && (
                  <p className="ml-auto text-xs text-mute">{popup.underText}</p>
                )}
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
