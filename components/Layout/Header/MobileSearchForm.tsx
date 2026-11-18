'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useProductSearch } from './useProductSearch';

type Props = {
  lng: string;
  placeholder: string;
  onDone: () => void;
};

export default function MobileSearchForm({ lng, placeholder, onDone }: Props) {
  const submitSearch = useProductSearch(lng, onDone);

  return (
    <search>
      <form onSubmit={submitSearch} className="relative">
        <label htmlFor="menu-search" className="sr-only">
          {placeholder}
        </label>
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-mute"
        />
        <input
          id="menu-search"
          name="productName"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder={placeholder}
          className="input-field h-12 min-h-12 pl-11 [&::-webkit-search-cancel-button]:appearance-none"
        />
      </form>
    </search>
  );
}
