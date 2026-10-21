'use client';

import {
  CheckIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { SiteLocale } from '@/app/i18n/settings';

type Props = {
  languages: SiteLocale[];
  currencySymbol?: string | null;
  /** Where the list opens: below the header trigger, above the mobile menu and footer ones */
  placement?: 'below-end' | 'above-start' | 'above-end' | 'above-start-md-end';
  /** A chevron after the label (the footer's switch) */
  chevron?: boolean;
  /** Classes for the "EN / $" label, e.g. to keep it for screen readers only on narrow bars */
  labelClassName?: string;
  /** Extra classes for the trigger (heights, paddings, borders) */
  className?: string;
  onNavigate?: () => void;
};

const PLACEMENT = {
  // The header's: its 40px trigger is centred in the 72px bar, so 16px down the list's ink
  // top edge lies on the header's hairline, where the mega menu hangs too; it drops from there
  'below-end': 'top-full right-0 mt-4 origin-top-right [--pop-y:-0.5rem]',
  'above-start': 'bottom-full left-0 mb-2 origin-bottom-left',
  'above-end': 'bottom-full right-0 mb-2 origin-bottom-right',
  // A trigger on the left edge on phones, on the right edge from md
  'above-start-md-end':
    'bottom-full left-0 mb-2 origin-bottom-left md:right-0 md:left-auto md:origin-bottom-right',
};

const LanguageSelector = ({
  languages,
  currencySymbol,
  placement = 'below-end',
  chevron = false,
  labelClassName,
  className,
  onNavigate,
}: Props) => {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [productSlugs, setProductSlugs] = useState<Record<string, string>>({});
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLocale = pathSegments[0] as SiteLocale; //will be a SiteLocale because of the middleware redirect rules
  const searchParams = useSearchParams();
  const currentProductSlug =
    pathSegments[1] === 'product' ? pathSegments[2] : null;

  const pathString = pathSegments.slice(1).join('/');
  const queryString = searchParams.toString();

  useEffect(() => {
    setProductSlugs({});

    if (!currentProductSlug) {
      return;
    }

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
      .catch((error) => {
        if (error.name !== 'AbortError' && !ignore) {
          setProductSlugs({});
        }
      });

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

  const hrefForLocale = (locale: SiteLocale) => {
    const localizedPath =
      currentProductSlug && productSlugs[locale]
        ? `product/${productSlugs[locale]}`
        : pathString;
    const href = `/${locale}${localizedPath ? `/${localizedPath}` : ''}`;

    return queryString ? `${href}?${queryString}` : href;
  };

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

      {/* A white popover with an ink edge (like the draft-mode one) on every surface: the edge
          stays visible over the footer's white wordmark, and the ring is reset to ink */}
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
                href={hrefForLocale(locale)}
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
    </div>
  );
};

export default LanguageSelector;
