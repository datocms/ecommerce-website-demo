import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import type { GlobalPageProps } from '@/lib/globalPageProps';

export type PageProps = GlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query Stores($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      allStores(locale: $locale, fallbackLocales: $fallbackLocale) {
        seo: _seoMetaTags {
          attributes
          content
          tag
        }
        country
        id
        storeDescription
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
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        findOnMaps
      }
    }
  `,
  [ResponsiveImageFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
