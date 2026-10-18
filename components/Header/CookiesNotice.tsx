import { useSyncExternalStore } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import DatoImage from '@/components/DatoImage';

export type CookieNotice = NonNullable<
  NonNullable<LayoutQuery['layout']>['cookieNotice']
>;

// Shared by the header (the popup waits for the dismissal) and the footer (which
// renders the card). The [lng] layout remounts on a locale switch, so a dismissal
// lasts for the page load.
let dismissed = false;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const dismiss = () => {
  dismissed = true;
  for (const listener of listeners) listener();
};

export const useCookieNoticeOpen = () =>
  !useSyncExternalStore(
    subscribe,
    () => dismissed,
    () => false,
  );

type PropTypes = {
  cookieNotice: CookieNotice;
};

// A floating card, rendered right after the footer: it is sticky, so it follows the
// viewport while scrolling and comes to rest under the footer, never hiding the page's end.
// No scrim: the page stays usable.
const CookiesNotice = ({ cookieNotice }: PropTypes) => {
  return (
    <section
      id="cookie-notice"
      aria-label={cookieNotice.header ?? undefined}
      className="pointer-events-none sticky bottom-0 z-40 px-2 pb-2 sm:px-3 sm:pb-3 lg:px-10 lg:pb-6"
    >
      <div className="pointer-events-auto mx-auto flex max-w-340 flex-col gap-5 rounded-card bg-white p-4 shadow-pop sm:p-5 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 gap-4 md:items-center">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-image bg-oat sm:size-18">
            {cookieNotice.cookieNoticeImage?.responsiveImage && (
              <DatoImage
                fragment={cookieNotice.cookieNoticeImage.responsiveImage}
                layout="fill"
                objectFit="cover"
                sizes="72px"
              />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="title-sm">{cookieNotice.header}</h2>
            <p className="mt-1.5 max-w-[80ch] text-sm text-pretty text-muted">
              {cookieNotice.subheader}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:shrink-0">
          <button
            type="button"
            onClick={dismiss}
            className="btn-secondary btn-sm h-12"
          >
            {cookieNotice.secondaryButtonLabel}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="btn-primary btn-sm h-12"
          >
            {cookieNotice.primaryButtonLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CookiesNotice;
