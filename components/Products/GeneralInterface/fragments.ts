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
