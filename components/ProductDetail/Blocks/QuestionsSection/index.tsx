import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { PDP_RAIL } from '@/components/ProductDetail/styles';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { QuestionSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof QuestionSectionFragment>;
} & Omit<ComponentPropsWithoutRef<'section'>, 'children'>;

const QuestionsSection = ({ fragment, ...rest }: Props) => {
  const { questions } = readFragment(QuestionSectionFragment, fragment);

  // Hairline rows: the question on the left, the answer on the buy box's line
  return (
    <section {...rest}>
      <dl className="border-b border-line">
        {questions.map((question) => (
          <div
            key={question.id}
            className="grid gap-2 border-t border-line py-7 lg:grid-cols-12 lg:gap-4 lg:py-8"
          >
            <dt className="title-item leading-[1.25] lg:col-span-6 lg:pr-10">
              {question.question}
            </dt>
            <dd
              className={`text-md leading-[1.6] text-ink-2 [&_p+p]:mt-3 [&_p]:m-0 ${PDP_RAIL}`}
            >
              <ReactMarkdown>{question.answer || ''}</ReactMarkdown>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default QuestionsSection;
