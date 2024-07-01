'use client';

import type { SiteLocale } from '@/graphql/types/graphql';
import { useRouter } from 'next/navigation';
import { type Dispatch, type SetStateAction, useState } from 'react';

type PropTypes = {
  lng: SiteLocale;
  setSerachIsOpen: Dispatch<SetStateAction<boolean>>;
};

const HoveringSearch = ({ lng, setSerachIsOpen }: PropTypes) => {
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
          setSerachIsOpen(false);
        }
      }}
    />
  );
};

export default HoveringSearch;
