'use client';

import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { SiteLocale } from '@/app/i18n/settings';

type Props = {
  languages: SiteLocale[];
  currencySymbol?: string | null;
  /** Where the list opens: below the strip/nav trigger, above the mobile menu and footer ones */
  placement?: 'below-end' | 'above-start' | 'above-end' | 'above-start-sm-end';
  /** light: ink text (butter, white, cream); dark: cream text (forest) */
  tone?: 'light' | 'dark';
  /** Extra classes for the trigger (pill fills, heights) */
  className?: string;
  onNavigate?: () => void;
};

const PLACEMENT = {
  'below-end': 'top-full right-0 mt-2',
  'above-start': 'bottom-full left-0 mb-2',
  'above-end': 'bottom-full right-0 mb-2',
  // A trigger on the left edge on phones, on the right edge from sm
  'above-start-sm-end': 'bottom-full left-0 mb-2 sm:right-0 sm:left-auto',
};

const LanguageSelector = ({
  languages,
  currencySymbol,
  placement = 'below-end',
  tone = 'light',
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
          'group inline-flex items-center gap-1 font-semibold whitespace-nowrap transition-colors',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="sr-only">Language and currency: </span>
        {currentLocale?.replaceAll('_', '-').toUpperCase()}
        {currencySymbol && (
          <>
            <span
              aria-hidden="true"
              className={tone === 'dark' ? 'text-cream/70' : 'text-muted'}
            >
              /
            </span>
            {currencySymbol}
          </>
        )}
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.75 shrink-0 stroke-[2.4] transition-transform duration-200 group-aria-expanded:rotate-180"
        />
      </button>

      <ul
        id={listId}
        hidden={!isOpen}
        className={`absolute z-50 w-56 rounded-card bg-white p-2 text-ink shadow-pop [--focus-ring:var(--color-ink)] ${PLACEMENT[placement]}`}
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
                className="flex min-h-11 items-center justify-between gap-4 rounded-md px-3 py-2 text-base font-medium transition-colors duration-150 hover:bg-cream aria-[current=true]:bg-cream"
              >
                <span lang={bcp47}>
                  {getLangNameFromCode(locale)?.native || locale}
                </span>
                {current ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 stroke-[2.4]"
                  />
                ) : (
                  <span className="text-xs font-semibold text-muted">
                    {bcp47.toUpperCase()}
                  </span>
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
