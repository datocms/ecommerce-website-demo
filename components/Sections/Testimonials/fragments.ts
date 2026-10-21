import { graphql } from '@/lib/datocms/graphql';

export const TestimonialSectionFragment = graphql(/* GraphQL */ `
  fragment TestimonialSectionFragment on TestimonialSectionRecord {
    id
    title
    testimonial {
      id
      testimonial
      author
    }
  }
`);
