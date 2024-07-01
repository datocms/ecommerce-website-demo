import type { FragmentType } from '@/graphql/types';
import type { DatoImage_ResponsiveImageFragmentDoc } from '@/graphql/types/graphql';
import {
  type Record,
  type StructuredText,
  isList,
  isListItem,
  isThematicBreak,
} from 'datocms-structured-text-utils';
import type { Maybe } from 'graphql/jsutils/Maybe';
import {
  StructuredText as StructuredTextField,
  renderNodeRule,
} from 'react-datocms/structured-text';
import ReactMarkdown from 'react-markdown';
import Highlighter from '../Common/Highlighter';
import DatoImage from '../DatoImage';

type PropTypes = {
  name: string;
  subtitle: string;
  type: Maybe<string>;
  image: Maybe<FragmentType<typeof DatoImage_ResponsiveImageFragmentDoc>>;
  description: Maybe<StructuredText<Record, Record>>;
};

const FilterDetail = ({
  name,
  type,
  image,
  description,
  subtitle,
}: PropTypes) => {
  return (
    <div className="relative isolate mx-auto max-w-7xl overflow-hidden bg-white px-6 py-12 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
      <div className="gap-t-16 lg:gap-t-10 mx-auto -mt-4 grid w-full max-w-2xl gap-x-8 lg:mx-0 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:items-start">
        <div className="mb-8 w-full lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-7xl lg:gap-x-8 lg:px-16">
          <div className="lg:pr-4">
            <p className="text-center text-base font-semibold leading-7 text-primary lg:text-left">
              {type}
            </p>
            <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-left">
              {name}
            </h1>
            <div className="mt-6 text-center text-xl leading-8 text-gray-700 lg:text-left">
              <ReactMarkdown>{subtitle || ''}</ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="relative mx-8 mb-8 h-96 p-12 lg:sticky lg:top-32 lg:row-span-5 lg:row-start-1 lg:mx-0 lg:-ml-12 lg:mb-0 lg:mr-12 lg:h-full lg:overflow-hidden">
          {image && (
            <DatoImage
              fragment={image}
              className="relative h-full w-[48rem] max-w-none rounded-xl bg-gray-900 object-contain shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              layout="fill"
              objectFit="cover"
              objectPosition="50% 50%"
            />
          )}
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:w-full lg:max-w-7xl lg:gap-x-8 lg:px-8">
          <div className="px-8 text-base leading-7 text-gray-700">
            <StructuredTextField
              data={description}
              renderNode={Highlighter}
              customNodeRules={[
                renderNodeRule(isListItem, ({ children, key }) => {
                  return (
                    <div key={key} className="flex gap-x-3">
                      <div>{children}</div>
                    </div>
                  );
                }),
                renderNodeRule(isThematicBreak, ({ children, key }) => {
                  return (
                    <hr
                      key={key}
                      className="mx-auto my-4 h-[3px] w-1/2 rounded-3xl bg-primary opacity-50"
                    />
                  );
                }),
                renderNodeRule(isList, ({ children, key }) => {
                  return (
                    <ul
                      key={key}
                      role="list"
                      className="my-8 space-y-8 text-gray-600"
                    >
                      {children}
                    </ul>
                  );
                }),
              ]}
            />
          </div>
        </div>
        )
      </div>
    </div>
  );
};

export default FilterDetail;
