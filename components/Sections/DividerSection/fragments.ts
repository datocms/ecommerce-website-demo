import { graphql } from '@/lib/datocms/graphql';

export const DividerSectionFragment = graphql(/* GraphQL */ `
  fragment DividerSectionFragment on DividerSectionRecord {
    id
    _modelApiKey
    title
    subtitle
    preTitle
    button {
      label
      slug
    }
  }
`);
