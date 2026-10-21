import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';

export type CookieNotice = NonNullable<
  NonNullable<LayoutQuery['layout']>['cookieNotice']
>;

// Shared by the header (the popup waits for the dismissal) and the footer (which
// renders the bar). The [lng] layout remounts on a locale switch, so a dismissal
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

// It arrives once per page load, after the hero: a locale switch remounts it, and it should
// hold still then instead of leaving for 600ms and rising again
let arrived = false;

// A white bar along the viewport's bottom edge, rendered right after the footer: it is
// sticky, so it follows the viewport while scrolling and comes to rest under the footer,
// never hiding the page's end. No scrim: the page stays usable.
const CookieNotice = ({ cookieNotice }: PropTypes) => {
  const [enter] = useState(!arrived);
  useEffect(() => {
    arrived = true;
  }, []);

  return (
    <section
      id="cookie-notice"
      aria-label={cookieNotice.header ?? undefined}
      className={`${enter ? 'enter [--delay:600ms] ' : ''}sticky bottom-0 z-40 border-t border-ink bg-white`}
    >
      {/* One row from lg; below it the buttons go under the text (right-aligned from sm), so
          the text keeps its width instead of wrapping to four lines beside them */}
      <div className="shell flex flex-col gap-4 py-4 md:py-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex min-w-0 flex-1 items-start gap-4 md:items-center">
          <div className={`${MEDIA} size-14 shrink-0 sm:size-16`}>
            {cookieNotice.cookieNoticeImage?.responsiveImage && (
              <DatoImage
                fragment={cookieNotice.cookieNoticeImage.responsiveImage}
                layout="fill"
                objectFit="cover"
                sizes="64px"
              />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-md font-semibold tracking-[-0.01em] sm:text-lg">
              {cookieNotice.header}
            </h2>
            <p className="mt-1 max-w-[86ch] text-sm text-pretty text-ink-2">
              {cookieNotice.subheader}
            </p>
          </div>
        </div>

        {/* Phones: equal halves while both labels fit on one line (a longer label takes what it
            needs), stacked when they don't, so a label never wraps inside its button. The
            primary's clear border matches the outline's, so the halves come out equal. */}
        <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2 sm:self-end lg:shrink-0 lg:self-auto">
          <button
            type="button"
            onClick={dismiss}
            className="btn-line btn-sm min-w-fit flex-1"
          >
            {cookieNotice.secondaryButtonLabel}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="btn btn-sm min-w-fit flex-1 border border-transparent"
          >
            {cookieNotice.primaryButtonLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CookieNotice;
