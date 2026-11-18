import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  graphql,
  type ResultOf,
  type VariablesOf,
} from '@/lib/datocms/graphql';
import { LinkRecordFragment } from '@/lib/datocms/linkHref';
import type { GlobalPageProps } from '@/lib/globalPageProps';

export type PageProps = GlobalPageProps;

export const query = graphql(
  /* GraphQL */ `
    query Showcase($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        currencySymbol
        sale
        collections
        shopNow
        salePrice
        originalPrice
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
          onSale
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
        materialsDescription {
          value
        }
        description {
          value
        }
        displays {
          id
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        cta {
          label
          page
          record {
            ...LinkRecordFragment
          }
        }
        collections {
          name
          id
          image {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
        }
        collectionsCtaLabel
      }
    }
  `,
  [ResponsiveImageFragment, LinkRecordFragment],
);

export type Query = ResultOf<typeof query>;
export type Showcase = NonNullable<Query['showcase']>;
export type Variables = VariablesOf<typeof query>;
