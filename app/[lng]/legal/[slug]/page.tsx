import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import { graphql } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import { getAvailableLocales, type SiteLocale } from '@/lib/i18n';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

const staticParamsQuery = graphql(/* GraphQL */ `
  query LegalStaticParams {
    allLegalPages(first: 100) {
      slug
    }
  }
`);

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const { allLegalPages } = await queryDatoCMS(staticParamsQuery);

  return allLegalPages.flatMap((legal) =>
    locales.map((lng) => ({
      slug: legal.slug,
      lng,
    })),
  );
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.lng as SiteLocale,
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
});

export default Page;
