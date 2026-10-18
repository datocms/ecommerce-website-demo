import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const ProductRailFragment = graphql(
  /* GraphQL */ `
    fragment ProductRailFragment on ProductRecord {
      id
      name
      slug
      price
      sale
      salePrice
      brand {
        name
      }
      productImages {
        id
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
