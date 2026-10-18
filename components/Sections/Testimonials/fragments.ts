import { graphql } from '@/lib/datocms/graphql';

export const TestimonialSectionFragment = graphql(/* GraphQL */ `
  fragment TestimonialSectionFragment on TestimonialSectionRecord {
    id
    _modelApiKey
    title
    testimonial {
      id
      testimonial
      author
    }
  }
`);
