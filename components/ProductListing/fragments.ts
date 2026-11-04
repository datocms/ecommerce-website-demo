import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { type FragmentOf, graphql } from '@/lib/datocms/graphql';

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
    CollectionRecord: collection
    MaterialRecord: material
    BrandRecord: brand
  }
`);

export type ProductListingLabels =
  | FragmentOf<typeof ProductListingLabelsFragment>
  | null
  | undefined;

// FilterDetail: the catalog header for a lone collection, brand or material
export const FilterDetailFragment = graphql(
  /* GraphQL */ `
    fragment FilterDetailFragment on FilterDetailRecord {
      image {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
      subtitle {
        value
      }
      description {
        value
      }
    }
  `,
  [ResponsiveImageFragment],
);

// Every collection, brand and material, for the filters and the FilterDetail header.
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
        details {
          ...FilterDetailFragment
        }
      }
      allBrands(first: 100, locale: $locale, fallbackLocales: $fallbackLocale) {
        id
        __typename
        name
        details {
          ...FilterDetailFragment
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
        details {
          ...FilterDetailFragment
        }
      }
    }
  `,
  [FilterDetailFragment],
);
