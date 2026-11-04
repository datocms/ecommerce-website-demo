import { graphql } from '@/lib/datocms/graphql';

export const QuestionsSectionFragment = graphql(/* GraphQL */ `
  fragment QuestionsSectionFragment on FeaturedQuestionsSectionRecord {
    questions {
      id
      question
      answer {
        value
      }
    }
  }
`);
