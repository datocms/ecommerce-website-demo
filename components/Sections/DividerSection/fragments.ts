import { graphql } from '@/lib/datocms/graphql';

export const DividerSectionFragment = graphql(/* GraphQL */ `
  fragment DividerSectionFragment on DividerSectionRecord {
    id
    title
    subtitle {
      value
    }
    preTitle
    button {
      label
      slug
    }
  }
`);
