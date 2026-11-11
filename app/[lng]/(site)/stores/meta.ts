import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import { GlobalSeoFragment } from '@/lib/datocms/pageMetadata';
import type { GlobalPageProps } from '@/lib/globalPageProps';

export type PageProps = GlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query Stores($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      allStores(locale: $locale, fallbackLocales: $fallbackLocale) {
        country
        id
        storeDescription {
          value
        }
        storeName
        storeLocation {
          latitude
          longitude
        }
        storeImage {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        thumbnail: storeImage {
          responsiveImage(
            imgixParams: { w: 136, h: 136, fit: crop, auto: format }
          ) {
            ...ResponsiveImageFragment
          }
        }
      }
      ...GlobalSeoFragment
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        stores
        findOnMaps
        previousStore
        nextStore
      }
    }
  `,
  [ResponsiveImageFragment, GlobalSeoFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
