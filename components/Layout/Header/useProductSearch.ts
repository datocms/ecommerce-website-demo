'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { productSearchHref } from './menu';

// Submit handler for a search form: opens the catalog searched by its productName field
export function useProductSearch(lng: string, onDone: () => void) {
  const router = useRouter();

  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('productName');
    router.push(productSearchHref(lng, String(query ?? '')));
    onDone();
  };
}
