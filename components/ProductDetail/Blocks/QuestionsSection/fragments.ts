import { graphql } from '@/lib/datocms/graphql';

export const QuestionSectionFragment = graphql(/* GraphQL */ `
  fragment QuestionSectionFragment on FeaturedQuestionsSectionRecord {
    questions {
      id
      question
      answer
    }
  }
`);
