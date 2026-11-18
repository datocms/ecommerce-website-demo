import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const ProductInfoSectionFragment = graphql(/* GraphQL */ `
  fragment ProductInfoSectionFragment on ProductFeatureSectionRecord {
    fabric
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
      image {
        responsiveImage {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
