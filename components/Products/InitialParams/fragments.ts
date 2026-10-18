import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

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
