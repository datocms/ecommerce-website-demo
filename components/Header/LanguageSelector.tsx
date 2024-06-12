'use client';

import type { SiteLocale } from '@/graphql/types/graphql';
import type { Maybe } from 'graphql/jsutils/Maybe';
import { getLangNameFromCode } from 'language-name-map';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

type Props = {
  languages: SiteLocale[];
  currencySymbol: Maybe<string>;
};

const LanguageSelector = ({ languages, currencySymbol }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const currentLocale = pathArray[1] as SiteLocale; //will be a SiteLocale because of the middleware redirect rules
  const searchParams = useSearchParams()!;

  const pathString = pathArray.splice(2, pathArray.length).join('/');

  return (
    <div className="relative">
      <div
        onClick={() => {
          isOpen ? setIsOpen(false) : setIsOpen(true);
        }}
        onBlur={() =>
          setTimeout(() => {
            setIsOpen(false);
          }, 100)
        }
        className="ml-4 inline-flex w-full items-center overflow-hidden rounded-md bg-white transition duration-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300"
      >
        <button
          type="button"
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-center text-sm font-medium text-gray-800"
        >
          {getLangNameFromCode(currentLocale)?.name || currentLocale} (
          {currencySymbol})
        </button>
      </div>

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
                href={`/${locale}/${pathString}?${searchParams.toString()}`}
                className="block w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                role="menuitem"
              >
                <div className="w-full text-center">
                  {getLangNameFromCode(locale)?.name || currentLocale}
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
