'use client';

import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useCallback, useId, useRef, useState } from 'react';
import { cx } from '@/lib/classNames';
import { type SiteLocale, toLanguageTag } from '@/lib/i18n';
import LocaleList, { type Placement } from './LocaleList';
import { useDismissOnOutside } from './useDismissOnOutside';
import { useProductSlugsByLocale } from './useProductSlugsByLocale';

type Props = {
  languages: SiteLocale[];
  currencySymbol?: string | null;
  /** Each locale's currency symbol, shown beside its name in the list */
  currencySymbols?: ReadonlyArray<{
    locale: SiteLocale | null;
    value: string | null;
  }> | null;
  /** Where the list opens: below the header trigger, above the mobile menu and footer ones */
  placement?: Placement;
  /** A chevron after the label (the footer's switch) */
  chevron?: boolean;
  /** Classes for the "EN / $" label, e.g. to keep it for screen readers only on narrow bars */
  labelClassName?: string;
  /** Extra classes for the trigger (heights, paddings, borders) */
  className?: string;
  onNavigate?: () => void;
  /** General interface "Language and currency" label, read out before the code */
  label?: string;
};

export default function LanguageSelector({
  languages,
  currencySymbol,
  currencySymbols,
  placement = 'below-end',
  chevron = false,
  labelClassName,
  className,
  onNavigate,
  label,
}: Props) {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  // proxy.ts redirects every request to a locale-prefixed path, so the first segment is a
  // SiteLocale
  const currentLocale = pathSegments[0] as SiteLocale;
  const currentProductSlug =
    pathSegments[1] === 'product' ? pathSegments[2] : null;

  const pathWithoutLocale = pathSegments.slice(1).join('/');
  const productSlugs = useProductSlugsByLocale(
    currentLocale,
    currentProductSlug,
  );

  const close = useCallback(() => setIsOpen(false), []);
  useDismissOnOutside(isOpen, selectorRef, triggerRef, close);

  // The query string is kept, so a switch on the listing keeps its filters
  const hrefForLocale = (locale: SiteLocale, queryString: string) => {
    const localizedPath =
      currentProductSlug && productSlugs[locale]
        ? `product/${productSlugs[locale]}`
        : pathWithoutLocale;
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
        className={cx(
          'group inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors duration-150',
          className,
        )}
      >
        <GlobeAltIcon aria-hidden="true" className="size-4.5 shrink-0" />
        <span className={labelClassName}>
          <span className="sr-only">{label}: </span>
          {currentLocale && toLanguageTag(currentLocale).toUpperCase()}
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

      <LocaleList
        listId={listId}
        isOpen={isOpen}
        placement={placement}
        languages={languages}
        currentLocale={currentLocale}
        currencySymbols={currencySymbols}
        hrefForLocale={hrefForLocale}
        onSelect={() => {
          close();
          onNavigate?.();
        }}
      />
    </div>
  );
}
