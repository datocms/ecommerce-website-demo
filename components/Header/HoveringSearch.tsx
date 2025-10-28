'use client';

/**
 * @fileoverview Lightweight floating search input used on mobile layouts.
 * Pushes to the products route with `productName` query on Enter.
 */
import { useRouter } from 'next/navigation';
import { type Dispatch, type SetStateAction, useState } from 'react';
import type { SiteLocale } from '@/graphql/types/graphql';

type PropTypes = {
  /** Active locale for the search results route. */
  lng: SiteLocale;
  /** Setter to close the floating search. */
  setSearchIsOpen: Dispatch<SetStateAction<boolean>>;
};

/** Simple search input that navigates on Enter and clears itself. */
const HoveringSearch = ({ lng, setSearchIsOpen }: PropTypes) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  return (
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Search a clothing piece"
      className="top-1/4 z-50 mr-2 mt-2 h-10 w-64 rounded-full bg-white px-5 pr-10 text-sm focus:outline-none"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          router.push(`/${lng}/products?productName=${searchValue}`);
          setSearchValue('');
          setSearchIsOpen(false);
        }
      }}
    />
  );
};

export default HoveringSearch;
