import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const CollectionCardShowcaseFragment = graphql(
  /* GraphQL */ `
    fragment CollectionCardShowcaseFragment on CollectionCardShowcaseSectionRecord {
      id
      title
      pretitle
      button {
        label
        slug
      }
      collection {
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
      description
    }
  `,
  [ResponsiveImageFragment],
);
