import { CheckIcon } from '@heroicons/react/24/outline';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type ReactNode, Suspense } from 'react';
import { type SiteLocale, toLanguageTag } from '@/lib/i18n';

const PLACEMENT = {
  // mt-4 puts the list's top on the header's bottom border, where the mega menu opens
  'below-end': 'top-full right-0 mt-4 origin-top-right [--pop-y:-0.5rem]',
  'above-start': 'bottom-full left-0 mb-2 origin-bottom-left',
  // A trigger on the left edge on phones, on the right edge from md
  'above-start-md-end':
    'bottom-full left-0 mb-2 origin-bottom-left md:right-0 md:left-auto md:origin-bottom-right',
};

export type Placement = keyof typeof PLACEMENT;

type Props = {
  listId: string;
  isOpen: boolean;
  placement: Placement;
  languages: SiteLocale[];
  currentLocale: SiteLocale;
  currencySymbols?: ReadonlyArray<{
    locale: SiteLocale | null;
    value: string | null;
  }> | null;
  hrefForLocale: (locale: SiteLocale, queryString: string) => string;
  onSelect: () => void;
};

// Hands its children the current query string. On prerendered pages Next.js defers
// useSearchParams to the browser up to the nearest Suspense boundary, so only this reads it.
function WithQueryString({
  children,
}: {
  children: (queryString: string) => ReactNode;
}) {
  const queryString = useSearchParams().toString();
  return children(queryString);
}

export default function LocaleList({
  listId,
  isOpen,
  placement,
  languages,
  currentLocale,
  currencySymbols,
  hrefForLocale,
  onSelect,
}: Props) {
  // Ink border and ink focus ring, so the list reads on every surface, the footer's included
  const localeList = (queryString: string) => (
    <ul
      id={listId}
      hidden={!isOpen}
      className={`pop absolute z-50 w-56 border border-ink bg-white p-1 text-ink [--focus-ring:var(--color-ink)] ${PLACEMENT[placement]}`}
    >
      {languages.map((locale) => {
        const bcp47 = toLanguageTag(locale);
        const current = locale === currentLocale;
        const symbol = currencySymbols?.find(
          (entry) => entry.locale === locale,
        )?.value;
        return (
          <li key={locale}>
            <Link
              href={hrefForLocale(locale, queryString)}
              hrefLang={bcp47}
              prefetch={false}
              aria-current={current ? 'true' : undefined}
              onClick={onSelect}
              className="flex min-h-11 items-center justify-between gap-4 px-3 text-base transition-colors duration-150 hover:bg-mist focus-visible:outline-offset-[-2px] aria-[current=true]:font-semibold"
            >
              <span lang={bcp47}>
                {getLangNameFromCode(locale)?.native || locale}
              </span>
              {/* opacity-60, not text-mute: surface-ink (the footer) turns text-mute white */}
              <span className="flex items-center gap-3">
                {symbol && (
                  <span className="font-normal opacity-60">{symbol}</span>
                )}
                <span className="size-4.5 shrink-0">
                  {current && (
                    <CheckIcon
                      aria-hidden="true"
                      className="size-4.5 stroke-2"
                    />
                  )}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    // Until the browser has the query string, the fallback links to the plain paths
    <Suspense fallback={localeList('')}>
      <WithQueryString>{localeList}</WithQueryString>
    </Suspense>
  );
}
