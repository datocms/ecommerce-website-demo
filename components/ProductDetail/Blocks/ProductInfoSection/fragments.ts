import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const ProductInfoSectionFragment = graphql(/* GraphQL */ `
  fragment ProductInfoSectionFragment on ProductFeatureSectionRecord {
    material
    occasions
    style
    weather
  }
`);

export const ProductMaterialFragment = graphql(
  /* GraphQL */ `
    fragment ProductMaterialFragment on MaterialRecord {
      id
      name
      details {
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
