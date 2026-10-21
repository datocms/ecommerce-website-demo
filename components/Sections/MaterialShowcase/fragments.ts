import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const MaterialShowcaseFragment = graphql(
  /* GraphQL */ `
    fragment MaterialShowcaseFragment on MaterialShowcaseSectionRecord {
      id
      title
      subDescription
      description
      materials {
        id
        name
        details {
          subtitle
          image {
            responsiveImage {
              ...ResponsiveImageFragment
            }
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
