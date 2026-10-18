import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { QuestionSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof QuestionSectionFragment>;
} & Omit<ComponentPropsWithoutRef<'section'>, 'children'>;

const QuestionsSection = ({ fragment, ...rest }: Props) => {
  const { questions } = readFragment(QuestionSectionFragment, fragment);

  return (
    <section
      {...rest}
      className="rounded-card bg-white p-(--card-pad) lg:p-(--panel-pad)"
    >
      <dl>
        {questions.map((question) => (
          <div
            key={question.id}
            className="grid gap-2 border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-12 lg:gap-10 lg:py-8"
          >
            <dt className="title-sm lg:col-span-5">{question.question}</dt>
            <dd className="text-md text-muted lg:col-span-7 lg:text-lg [&_p]:m-0 [&_p+p]:mt-3">
              <ReactMarkdown>{question.answer || ''}</ReactMarkdown>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default QuestionsSection;
