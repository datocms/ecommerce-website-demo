import { type FragmentType, getFragmentData } from '@/graphql/types';
import { QuestionSectionFragmentDoc } from '@/graphql/types/graphql';

import ReactMarkdown from 'react-markdown';

type Props = {
  fragment: FragmentType<typeof QuestionSectionFragmentDoc>;
};

const QuestionsSection = ({ fragment }: Props) => {
  const { questions } = getFragmentData(QuestionSectionFragmentDoc, fragment);

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2 md:gap-8">
          {questions.map((question) => {
            return (
              <div key={question.id} className="rounded-lg bg-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between gap-4 border-b pb-4">
                  <h3 className="font-semibold text-primary/90 sm:text-lg md:text-xl">
                    {question.question}
                  </h3>

                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>

                <div className="text-gray-500">
                  <ReactMarkdown>{question.answer || ''}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
