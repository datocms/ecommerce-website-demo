import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { graphql } from '@/lib/datocms/graphql';
import { LinkRecordFragment } from '@/lib/datocms/linkHref';

export const CollectionCardShowcaseFragment = graphql(
  /* GraphQL */ `
    fragment CollectionCardShowcaseFragment on CollectionCardShowcaseSectionRecord {
      id
      title
      preTitle
      button {
        label
        page
        record {
          ...LinkRecordFragment
        }
      }
      collection {
        id
        name
        image {
          responsiveImage {
            ...ResponsiveImageFragment
          }
        }
      }
      description {
        value
      }
    }
  `,
  [ResponsiveImageFragment, LinkRecordFragment],
);
