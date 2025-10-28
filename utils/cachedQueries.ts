import { unstable_cache as cache } from 'next/cache';
import {
  InitialParamsDocument,
  type SiteLocale,
} from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';

/**
 * Cached fetch of site‑wide initial parameters for a published locale.
 *
 * - Wraps the GraphQL call in `unstable_cache` so results are stored under the
 *   `initial-params` key and tagged with `datocms` for on‑demand revalidation.
 * - Always queries the published API (no drafts).
 *
 * @param lng - Active locale
 * @param fallbackLng - Fallback locale used by content queries
 * @returns The GraphQL payload for the initial params document
 */
export const getInitialParamsPublishedCached = cache(
  async (lng: SiteLocale, fallbackLng: SiteLocale) => {
    return queryDatoCMS(
      InitialParamsDocument,
      { locale: lng, fallbackLocale: [fallbackLng] },
      { isDraft: false },
    );
  },
  ['initial-params'],
  { tags: ['datocms', 'initial-params'] },
);
