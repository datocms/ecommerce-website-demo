'use client';

import {
  CheckIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  type ReactNode,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { SiteLocale } from '@/lib/i18n';

type Props = {
  languages: SiteLocale[];
  currencySymbol?: string | null;
  /** Where the list opens: below the header trigger, above the mobile menu and footer ones */
  placement?: 'below-end' | 'above-start' | 'above-start-md-end';
  /** A chevron after the label (the footer's switch) */
  chevron?: boolean;
  /** Classes for the "EN / $" label, e.g. to keep it for screen readers only on narrow bars */
  labelClassName?: string;
  /** Extra classes for the trigger (heights, paddings, borders) */
  className?: string;
  onNavigate?: () => void;
};

const PLACEMENT = {
  // Header: the 40px trigger is centred in the 72px bar, so mt-4 puts the list's top edge on
  // the header's bottom border, where the mega menu opens too, and --pop-y drops it from there.
  // Each placement scales from the corner nearest its trigger (origin-*).
  'below-end': 'top-full right-0 mt-4 origin-top-right [--pop-y:-0.5rem]',
  'above-start': 'bottom-full left-0 mb-2 origin-bottom-left',
  // A trigger on the left edge on phones, on the right edge from md
  'above-start-md-end':
    'bottom-full left-0 mb-2 origin-bottom-left md:right-0 md:left-auto md:origin-bottom-right',
};

// Hands its children the current query string. On prerendered pages Next.js leaves whatever
// reads it to the browser, up to the nearest Suspense boundary, so only this goes in one.
function WithQueryString({
  children,
}: {
  children: (queryString: string) => ReactNode;
}) {
  const queryString = useSearchParams().toString();
  return children(queryString);
}

export default function LanguageSelector({
  languages,
  currencySymbol,
  placement = 'below-end',
  chevron = false,
  labelClassName,
  className,
  onNavigate,
}: Props) {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [productSlugs, setProductSlugs] = useState<Record<string, string>>({});
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  // proxy.ts redirects every request to a locale-prefixed path, so the first segment is a
  // SiteLocale
  const currentLocale = pathSegments[0] as SiteLocale;
  const currentProductSlug =
    pathSegments[1] === 'product' ? pathSegments[2] : null;

  const pathString = pathSegments.slice(1).join('/');

  useEffect(() => {
    setProductSlugs({});

    if (!currentProductSlug) {
      return;
    }

    // abort() cancels a request still in flight; ignore drops a response that was already read
    // when the product changed
    const controller = new AbortController();
    let ignore = false;

    fetch(
      `/api/product-slug-map?locale=${encodeURIComponent(
        currentLocale,
      )}&slug=${encodeURIComponent(currentProductSlug)}`,
      { signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : { slugs: {} }))
      .then((data) => {
        if (!ignore) {
          setProductSlugs(data?.slugs || {});
        }
      })
      // Aborted, or no map: the links keep each locale's plain path (productSlugs was reset
      // above)
      .catch(() => {});

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [currentLocale, currentProductSlug]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Close on clicks and on keyboard focus moving outside the selector
    const handleOutside = (event: Event) => {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // preventDefault: a dialog around the selector (the mobile menu) stays open
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('focusin', handleOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('focusin', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // The query string is kept, so a switch on the listing keeps its filters
  const hrefForLocale = (locale: SiteLocale, queryString: string) => {
    const localizedPath =
      currentProductSlug && productSlugs[locale]
        ? `product/${productSlugs[locale]}`
        : pathString;
    const href = `/${locale}${localizedPath ? `/${localizedPath}` : ''}`;

    return queryString ? `${href}?${queryString}` : href;
  };

  // A white popover with an ink edge (like the draft-mode one) on every surface: the edge
  // stays visible over the footer's white wordmark, and the ring is reset to ink
  const localeList = (queryString: string) => (
    <ul
      id={listId}
      hidden={!isOpen}
      className={`pop absolute z-50 w-56 border border-ink bg-white p-1 text-ink [--focus-ring:var(--color-ink)] ${PLACEMENT[placement]}`}
    >
      {languages.map((locale) => {
        const bcp47 = locale.replaceAll('_', '-');
        const current = locale === currentLocale;
        return (
          <li key={locale}>
            <Link
              href={hrefForLocale(locale, queryString)}
              hrefLang={bcp47}
              prefetch={false}
              aria-current={current ? 'true' : undefined}
              onClick={() => {
                setIsOpen(false);
                onNavigate?.();
              }}
              className="flex min-h-11 items-center justify-between gap-4 px-3 text-base transition-colors duration-150 hover:bg-mist focus-visible:outline-offset-[-2px] aria-[current=true]:font-semibold"
            >
              <span lang={bcp47}>
                {getLangNameFromCode(locale)?.native || locale}
              </span>
              {current && (
                <CheckIcon
                  aria-hidden="true"
                  className="size-4.5 shrink-0 stroke-2"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={selectorRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        aria-expanded={isOpen}
        aria-controls={listId}
        className={[
          'group inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors duration-150',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <GlobeAltIcon aria-hidden="true" className="size-4.5 shrink-0" />
        <span className={labelClassName}>
          <span className="sr-only">Language and currency: </span>
          {currentLocale?.replaceAll('_', '-').toUpperCase()}
          {currencySymbol && (
            <>
              <span aria-hidden="true" className="px-1 text-mute">
                /
              </span>
              {currencySymbol}
            </>
          )}
        </span>
        {chevron && (
          <ChevronDownIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 stroke-2 transition-transform duration-200 group-aria-expanded:rotate-180"
          />
        )}
      </button>

      {/* Only the list reads the query string, so the trigger is always in the server HTML.
          Until the browser has the query, the same list on the plain paths stands in. */}
      <Suspense fallback={localeList('')}>
        <WithQueryString>{localeList}</WithQueryString>
      </Suspense>
    </div>
  );
}
