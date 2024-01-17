'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteLocale } from '@/graphql/generated';

type PropTypes = {
  lng: SiteLocale;
  setSerachIsOpen: Dispatch<SetStateAction<boolean>>;
};

const HoveringSearch = ({ lng, setSerachIsOpen }: PropTypes) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  return (
    // <div className="absolute z-[99] h-screen w-screen bg-slate-600 bg-opacity-40">
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
    // </div>
  );
};

export default HoveringSearch;
