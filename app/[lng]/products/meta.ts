import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import {
  FilterOptionsFragment,
  ProductListingLabelsFragment,
} from '@/components/ProductListing/fragments';
import { graphql } from '@/lib/datocms/graphql';
import type { GlobalPageProps } from '@/lib/globalPageProps';

export type ProductModelOrderBy = ReturnType<
  typeof graphql.scalar<'ProductModelOrderBy'>
>;

export type PageProps = GlobalPageProps & {
  searchParams: Promise<{
    page?: string;
    orderBy?: ProductModelOrderBy;
    productName?: string;
    collections?: string;
    brands?: string;
    materials?: string;
  }>;
};

// Products per page: the query's `first` and Pagination's page size
export const PAGE_SIZE = 12;

export const productsQuery = graphql(
  /* GraphQL */ `
    query Products(
      $locale: SiteLocale
      $fallbackLocale: [SiteLocale!]
      $first: IntType
      $skip: IntType
      $orderBy: [ProductModelOrderBy]
      $collections: [ItemId]
      $brands: [ItemId]
      $materials: [ItemId]
      $nameSearch: String!
    ) {
      allProducts(
        first: $first
        locale: $locale
        fallbackLocales: $fallbackLocale
        skip: $skip
        orderBy: $orderBy
        filter: {
          collections: { anyIn: $collections }
          brand: { in: $brands }
          material: { in: $materials }
          name: { matches: { pattern: $nameSearch, regexp: false } }
        }
      ) {
        id
        slug
        sale
        salePrice
        productImages {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
        price
        name
        brand {
          name
        }
      }
      _allProductsMeta(
        locale: $locale
        filter: {
          collections: { anyIn: $collections }
          brand: { in: $brands }
          material: { in: $materials }
          name: { matches: { pattern: $nameSearch, regexp: false } }
        }
      ) {
        count
      }
      generalInterface(locale: $locale, fallbackLocales: $fallbackLocale) {
        ...ProductListingLabelsFragment
      }
    }
  `,
  [ResponsiveImageFragment, ProductListingLabelsFragment],
);

export const filterOptionsQuery = graphql(
  /* GraphQL */ `
    query FilterOptions($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      ...FilterOptionsFragment
    }
  `,
  [FilterOptionsFragment],
);
