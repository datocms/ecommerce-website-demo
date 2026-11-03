import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const MaterialShowcaseFragment = graphql(
  /* GraphQL */ `
    fragment MaterialShowcaseFragment on MaterialShowcaseSectionRecord {
      id
      title
      subDescription {
        value
      }
      description {
        value
      }
      materials {
        id
        name
        details {
          subtitle {
            value
          }
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
