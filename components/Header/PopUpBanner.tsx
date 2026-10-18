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
import DatoImage from '@/components/DatoImage';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

export type Popup = NonNullable<NonNullable<LayoutQuery['layout']>['popup']>;

type PropTypes = {
  open: boolean;
  onClose: () => void;
  popup: Popup;
  globalPageProps: ResolvedGlobalPageProps;
};

const PopUpBanner = ({ open, onClose, popup, globalPageProps }: PropTypes) => {
  const button = popup.button[0];

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-xs transition duration-300 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 grid place-items-center p-3 sm:p-6">
        <DialogPanel
          transition
          className="surface-forest relative grid max-h-[calc(100svh-1.5rem)] w-full max-w-195 gap-2 overflow-y-auto rounded-sheet p-2 shadow-pop transition duration-300 ease-out data-closed:translate-y-3 data-closed:opacity-0 sm:max-h-[calc(100svh-3rem)] md:grid-cols-2"
        >
          {/* On the photo below md (a white disc), on the forest panel from md */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-autofocus
            className="icon-btn absolute top-4 right-4 z-10 bg-white text-ink [--focus-ring:var(--color-ink)] md:top-5 md:right-5 md:bg-white/10 md:text-cream md:ring-1 md:ring-white/20 md:[--focus-ring:var(--color-cream)] [&>svg]:stroke-[2.4]"
          >
            <XMarkIcon aria-hidden="true" />
          </button>

          <div className="relative aspect-[16/10] overflow-hidden rounded-nav bg-oat md:aspect-[4/5]">
            {popup.popupImage?.responsiveImage && (
              <DatoImage
                fragment={popup.popupImage.responsiveImage}
                layout="fill"
                objectFit="cover"
                sizes="(min-width: 768px) 380px, 100vw"
              />
            )}
          </div>

          {/* Message at the top, actions at the bottom of the photo's height */}
          <div className="flex flex-col justify-between gap-8 p-5 sm:p-7">
            <div>
              {popup.preTitle && (
                <p className="pretitle bg-butter md:mr-12">{popup.preTitle}</p>
              )}
              <DialogTitle
                className={[
                  'title-lg',
                  popup.preTitle ? 'mt-5' : 'md:pr-12',
                ].join(' ')}
              >
                {popup.title}
              </DialogTitle>
              {popup.subtitle && (
                <p className="mt-4 text-lg text-pretty text-cream/85">
                  {popup.subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              {button && (
                <Link
                  onClick={onClose}
                  className="btn-butter w-full"
                  href={`/${globalPageProps.params.lng}/${stripStega(button.slug)}`}
                >
                  {button.label}
                  <ArrowRightIcon aria-hidden="true" className="stroke-[2.4]" />
                </Link>
              )}
              {(popup.dismissButtonLabel || popup.underText) && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 first:mt-0">
                  {popup.dismissButtonLabel && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="link-underline relative text-sm font-bold after:absolute after:-inset-x-1 after:-inset-y-3"
                    >
                      {popup.dismissButtonLabel}
                    </button>
                  )}
                  {popup.underText && (
                    <p className="ml-auto text-sm text-cream/75">
                      {popup.underText}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PopUpBanner;
