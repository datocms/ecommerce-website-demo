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

export const MaterialProductFragment = graphql(
  /* GraphQL */ `
    fragment MaterialProductFragment on MaterialRecord {
      id
      name
      slug
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
