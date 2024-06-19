import { type FragmentType, getFragmentData } from '@/graphql/types';
import { DividerSectionFragmentDoc } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import Link from 'next/link';

type Props = {
  fragment: FragmentType<typeof DividerSectionFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

export default function DividerSection({ fragment, globalPageProps }: Props) {
  const { preTitle, subtitle, title, button } = getFragmentData(
    DividerSectionFragmentDoc,
    fragment,
  );
  return (
    <div className="container mx-auto mb-8 flex max-w-7xl flex-wrap items-center px-20 py-16 text-center lg:text-left">
      <div className="w-full lg:flex-1 lg:text-right">
        <div className="text-sm uppercase tracking-widest text-gray-700">
          {preTitle}
        </div>
        <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">
          {title}
        </h2>
      </div>
      <div className="w-full text-center lg:w-auto">
        <svg
          className="-mb-10 -mt-4 inline-block h-32 w-32 lg:-ml-8 lg:mb-0 lg:mt-0 lg:rotate-90 lg:transform"
          x="0px"
          y="0px"
          viewBox="0 0 100 125"
        >
          <title>Divider</title>
          <path d="M91.8 45c-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7C70 47.3 68 45 64 45c-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7c-1.8-2-3.8-4.3-7.7-4.3-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7c-1.8-2-3.8-4.3-7.7-4.3-.6 0-1 .4-1 1s.4 1 1 1c3 0 4.5 1.7 6.2 3.7 1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7s4.5 1.7 6.2 3.7c1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7s4.5 1.7 6.2 3.7c1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7.6 0 1-.4 1-1s-.4-1-1-1z" />
        </svg>
      </div>
      <div className="w-full lg:flex-1">
        <p>{subtitle}</p>
        <Link
          href={`/${globalPageProps.params.lng}/${button[0].slug}`}
          className="font-heading mt-4 inline-block rounded-lg bg-primary/80 px-8 py-4 text-sm tracking-widest text-white"
        >
          {button[0].label}
        </Link>
      </div>
    </div>
  );
}
