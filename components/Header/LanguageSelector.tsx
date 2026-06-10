'use client';

import type { Maybe } from 'graphql/jsutils/Maybe';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { SiteLocale } from '@/graphql/types/graphql';

type Props = {
  languages: SiteLocale[];
  currencySymbol: Maybe<string>;
};

const LanguageSelector = ({ languages, currencySymbol }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productSlugs, setProductSlugs] = useState<Record<string, string>>({});
  const selectorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLocale = pathSegments[0] as SiteLocale; //will be a SiteLocale because of the middleware redirect rules
  const searchParams = useSearchParams()!;
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

    const handlePointerDown = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
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
    <div className="relative" ref={selectorRef}>
      <button
        type="button"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="ml-4 inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-white px-4 py-2 text-center text-sm font-medium text-gray-800 transition duration-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300"
      >
        {getLangNameFromCode(currentLocale)?.name || currentLocale} (
        {currencySymbol})
      </button>

      <div
        className={`absolute end-0 left-5 z-10 mt-1 w-28 rounded-md border border-gray-100 bg-white shadow-lg${
          isOpen ? '' : ' hidden'
        }`}
        role="menu"
      >
        {languages.map((locale) => {
          return (
            <div
              key={locale}
              className="inline-flex w-full cursor-pointer items-end justify-start rounded-lg text-center text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              <Link
                href={hrefForLocale(locale)}
                prefetch={false}
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
              >
                <div className="w-full text-center">
                  {getLangNameFromCode(locale)?.name || locale}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
