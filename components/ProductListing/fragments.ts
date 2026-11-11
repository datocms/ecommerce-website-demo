import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { type FragmentOf, graphql, type ResultOf } from '@/lib/datocms/graphql';

// UI labels for the catalog, from the General Interface singleton
export const ProductListingLabelsFragment = graphql(/* GraphQL */ `
  fragment ProductListingLabelsFragment on GeneralInterfaceRecord {
    currencySymbol
    sale
    newArrivals
    mostPopular
    topRated
    price
    sales
    # Aliased to each record's __typename, so a filter's label is labels[record.__typename]
    CollectionRecord: collections
    MaterialRecord: materials
    BrandRecord: brands
  }
`);

export type ProductListingLabels =
  | FragmentOf<typeof ProductListingLabelsFragment>
  | null
  | undefined;

// Every collection, brand and material, for the filters and the FilterDetail header (which
// shows a lone one's subtitle, description and image).
// A fragment on Query: the operation that spreads it must declare $locale and
// $fallbackLocale.
export const FilterOptionsFragment = graphql(
  /* GraphQL */ `
    fragment FilterOptionsFragment on Query {
      allCollections(
        first: 100
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        id
        __typename
        name
        subtitle
        description {
          value
        }
        image {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      allBrands(first: 100, locale: $locale, fallbackLocales: $fallbackLocale) {
        id
        __typename
        name
        subtitle
        description {
          value
        }
        image {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      allMaterials(
        first: 100
        locale: $locale
        fallbackLocales: $fallbackLocale
      ) {
        id
        __typename
        name
        subtitle
        description {
          value
        }
        image {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);

type FilterOptions = ResultOf<typeof FilterOptionsFragment>;

/** A collection, brand or material, as the FilterDetail header takes it */
export type FilterRecord = FilterOptions[
  | 'allCollections'
  | 'allBrands'
  | 'allMaterials'][number];
