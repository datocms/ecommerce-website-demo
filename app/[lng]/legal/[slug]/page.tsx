/** Legal page — SSG params + realtime preview when in draft mode. */

import { notFound } from 'next/navigation';
import getAvailableLocales from '@/app/i18n/settings';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import { LegalStaticParamsDocument } from '@/graphql/types/graphql';
import queryDatoCMS from '@/utils/queryDatoCMS';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

export async function generateStaticParams() {
  if (process.env.SKIP_SSG) {
    return [];
  }
  const locales = await getAvailableLocales();
  const { allLegalPages } = await queryDatoCMS(LegalStaticParamsDocument);

  return allLegalPages.flatMap((legal) =>
    locales.map((lng): PageProps['params'] => ({
      slug: legal.slug,
      lng,
    })),
  );
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.lng,
  fallbackLocale: [fallbackLocale],
  slug: params.slug,
});

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables,
    generate: (data) => data.legalPage?.seo,
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
  onData: (data) => {
    if (!data.legalPage) {
      notFound();
    }
  },
});

export default Page;
