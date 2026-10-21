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
    query Showcase($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        currencySymbol
        sale
        collection
        shopNow
      }
      showcase(locale: $locale, fallbackLocales: $fallbackLocale) {
        seo: _seoMetaTags {
          attributes
          content
          tag
        }
        title
        newProductsTitle
        newProducts {
          id
          slug
          sale
          salePrice
          name
          brand {
            name
          }
          productImages {
            id
            responsiveImage {
              ...ResponsiveImageFragment
            }
            copyright
          }
          price
        }
        materialsTitle
        materialsDisplay {
          id
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        materialsDescription
        description
        displays {
          id
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        cta {
          id
          label
          slug
        }
        collections {
          name
          slug
          id
          details {
            image {
              responsiveImage {
                ...ResponsiveImageFragment
              }
            }
          }
        }
        collectionsCta {
          label
          slug
          id
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);

export type Query = ResultOf<typeof query>;
export type Variables = VariablesOf<typeof query>;
