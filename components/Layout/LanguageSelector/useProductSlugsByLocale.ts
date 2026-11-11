'use client';

import { useEffect, useState } from 'react';
import type { SiteLocale } from '@/lib/i18n';

type SlugMapResponse = { slugs?: Record<string, string> };

// Product slugs are localized: ask /api/product-slug-map for this product's slug in every locale
export function useProductSlugsByLocale(
  locale: SiteLocale,
  productSlug: string | null,
) {
  const [slugs, setSlugs] = useState<Record<string, string>>({});

  useEffect(() => {
    setSlugs({});

    if (!productSlug) {
      return;
    }

    // abort() cancels an in-flight request; ignore drops a late response
    const controller = new AbortController();
    let ignore = false;

    fetch(
      `/api/product-slug-map?locale=${encodeURIComponent(
        locale,
      )}&slug=${encodeURIComponent(productSlug)}`,
      { signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : {}))
      .then((data: SlugMapResponse) => {
        if (!ignore) setSlugs(data.slugs ?? {});
      })
      // Aborted or no map: the links keep each locale's plain path
      .catch(() => {});

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [locale, productSlug]);

  return slugs;
}
