import { InitialParamsDocument, type SiteLocale } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { unstable_cache as cache } from 'next/cache';

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
