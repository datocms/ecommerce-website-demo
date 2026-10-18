import { graphql } from '@/lib/datocms/graphql';

export const ProductInfoSectionFragment = graphql(/* GraphQL */ `
  fragment ProductInfoSectionFragment on ProductFeatureSectionRecord {
    material
    occasions
    style
    weather
  }
`);
