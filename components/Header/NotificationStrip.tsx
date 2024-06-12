import {
  type LayoutModelNotificationField,
  SiteLocale,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import {
  type Record,
  type StructuredText,
  isLink,
} from 'datocms-structured-text-utils';
import Link from 'next/link';
import type { SetStateAction } from 'react';
import {
  StructuredText as StructuredTextField,
  renderNodeRule,
} from 'react-datocms/structured-text';
import Highlighter from '../Common/Highlighter';

type Props = {
  notification: LayoutModelNotificationField;
  setNotificationStrip: React.Dispatch<SetStateAction<boolean>>;
  globalPageProps: GlobalPageProps;
};

const NotificationStrip = ({
  notification,
  globalPageProps,
  setNotificationStrip,
}: Props) => {
  return (
    <div className="bg-white pb-1">
      <div className="relative flex flex-nowrap items-center justify-center bg-primary/80 px-4 py-2 sm:flex-nowrap sm:gap-3 sm:py-4 sm:pr-8 md:px-8">
        <div className="order-1 mb-2 mt-2 flex h-full w-auto max-w-screen-sm items-center justify-center text-sm text-white sm:order-none sm:mb-0 sm:mt-0 md:text-base">
          <StructuredTextField
            data={notification.value as StructuredText<Record, Record>}
            renderNode={Highlighter}
            customNodeRules={[
              renderNodeRule(isLink, ({ node, children, key }) => {
                return (
                  <Link
                    href={`/${globalPageProps.params.lng}${node.url}` || '#'}
                    className="order-last inline-block whitespace-nowrap rounded-lg bg-primary px-2 py-2 text-center text-xs font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-primary/90 focus-visible:ring active:bg-primary/50 sm:order-none sm:w-auto md:text-sm"
                    key={key}
                  >
                    {children}
                  </Link>
                );
              }),
            ]}
          />
        </div>

        <div className="order-2 flex w-1/12 items-start justify-end sm:absolute sm:right-0 sm:order-none sm:mr-1 sm:w-auto xl:mr-3">
          <button
            type="button"
            className="text-white transition duration-100 hover:text-indigo-100 active:text-indigo-200"
            onClick={() => {
              setNotificationStrip(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    // <div className="bg-primary px-4 py-3 text-white">
    //   <div className="text-center text-sm font-medium">
    //     <StructuredText
    //       data={notification.value}
    //       renderNode={Highlighter}
    //       customNodeRules={[
    //         renderNodeRule(isLink, ({ node, children, key }) => {
    //           return (
    //             <Link
    //               href={'/' + lng + node.url || '#'}
    //               className="inline-block underline"
    //               key={key}
    //             >
    //               {children}
    //             </Link>
    //           );
    //         }),
    //       ]}
    //     />
    //   </div>
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     fill="none"
    //     viewBox="0 0 24 24"
    //     strokeWidth="1.5"
    //     stroke="currentColor"
    //     className="absolute right-4 top-3 h-5 w-5 cursor-pointer"
    //     onClick={() => setNotificationStrip(false)}
    //   >
    //     <path
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       d="M6 18L18 6M6 6l12 12"
    //     />
    //   </svg>
    // </div>
  );
};

export default NotificationStrip;
