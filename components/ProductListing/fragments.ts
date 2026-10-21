import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const ProductsGeneralInterfaceFragment = graphql(/* GraphQL */ `
  fragment ProductsGeneralInterfaceFragment on GeneralInterfaceRecord {
    currencySymbol
    sale
    newArrivals
    mostPopular
    topRated
    price
    sales
    CollectionRecord: collection
    MaterialRecord: material
    BrandRecord: brand
  }
`);

export const InitialParamsFragment = graphql(
  /* GraphQL */ `
    fragment InitialParamsFragment on Query {
      allCollections(
        first: "100"
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        id
        __typename
        name
        _modelApiKey
        details {
          image {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
          subtitle
          description {
            value
          }
        }
      }
      allBrands(first: "100", locale: $locale, fallbackLocales: $fallbackLocale) {
        id
        __typename
        name
        _modelApiKey
        details {
          image {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
          subtitle
          description {
            value
          }
        }
      }
      allMaterials(
        first: "100"
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        id
        __typename
        name
        _modelApiKey
        details {
          image {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
          subtitle
          description {
            value
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
