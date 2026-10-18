import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

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
