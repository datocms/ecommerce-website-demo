import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';

export const CollectionCardShowcaseFragment = graphql(
  /* GraphQL */ `
    fragment CollectionCardShowcaseFragment on CollectionCardShowcaseSectionRecord {
      id
      _modelApiKey
      title
      pretitle
      direction
      button {
        label
        slug
        id
      }
      collection {
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
      description
    }
  `,
  [ResponsiveImageFragment],
);
