import { graphql } from '@/lib/datocms/graphql';
import { LinkRecordFragment } from '@/lib/datocms/linkHref';

export const DividerSectionFragment = graphql(
  /* GraphQL */ `
    fragment DividerSectionFragment on DividerSectionRecord {
      id
      title
      subtitle {
        value
      }
      preTitle
      button {
        label
        page
        record {
          ...LinkRecordFragment
        }
      }
    }
  `,
  [LinkRecordFragment],
);
