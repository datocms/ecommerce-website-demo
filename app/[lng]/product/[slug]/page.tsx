import { draftMode } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';
import ContentOrRealTime from '@/components/WithRealTimeUpdates/ContentOrRealTime';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import { graphql } from '@/lib/datocms/graphql';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import {
  getAvailableLocales,
  getFallbackLocale,
  type SiteLocale,
} from '@/lib/i18n';
import {
  buildProductSlugMap,
  resolveProductSlug,
  slugForLocale,
} from '@/lib/productSlugs';
import Content from './Content';
import { type PageProps, query, type Variables } from './meta';
import RealTime from './RealTime';

const staticParamsQuery = graphql(/* GraphQL */ `
  query ProductStaticParams($locale: SiteLocale) {
    allProducts(
      first: 100
      locale: $locale
    ) {
      slug
    }
  }
`);

export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  const params = await Promise.all(
    locales.map(async (lng) => {
      const { allProducts } = await queryDatoCMS(staticParamsQuery, {
        locale: lng as SiteLocale,
      });

      return allProducts
        .filter((product) => product.slug)
        .map((product) => ({
          slug: product.slug,
          lng,
        }));
    }),
  );

  return params.flat();
}

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.lng as SiteLocale,
  fallbackLocale: [fallbackLocale],
  slug: params.slug,
});

async function getProductPageData({
  params,
  fallbackLocale,
  isDraft,
}: {
  params: Awaited<PageProps['params']>;
  fallbackLocale: SiteLocale;
  isDraft: boolean;
}) {
  const locale = params.lng as SiteLocale;
  const variables = buildVariables({ params, fallbackLocale });
  const data = await queryDatoCMS(query, variables, isDraft);

  if (data.product) {
    const slugs = buildProductSlugMap(
      data.product._allSlugLocales,
      locale,
      data.product.slug,
    );
    const localizedSlug = slugForLocale(slugs, locale, fallbackLocale);

    if (localizedSlug && localizedSlug !== params.slug) {
      redirect(`/${params.lng}/product/${localizedSlug}`);
    }

    return { data, variables };
  }

  const resolved = await resolveProductSlug({
    slug: params.slug,
    locale,
    fallbackLocale,
    isDraft,
  });

  if (!resolved) {
    notFound();
  }

  if (resolved.localizedSlug !== params.slug) {
    redirect(`/${params.lng}/product/${resolved.localizedSlug}`);
  }

  const resolvedVariables = {
    ...variables,
    slug: resolved.localizedSlug,
  };
  const resolvedData = await queryDatoCMS(query, resolvedVariables, isDraft);

  if (!resolvedData.product) {
    notFound();
  }

  return {
    data: resolvedData,
    variables: resolvedVariables,
  };
}

export async function generateMetadata(nextPageProps: PageProps) {
  const fallbackLocale = await getFallbackLocale();
  const { isEnabled: isDraft } = await draftMode();
  const params = await nextPageProps.params;
  const { data } = await getProductPageData({
    params,
    fallbackLocale,
    isDraft,
  });

  return data.product?.seo ? toNextMetadata(data.product.seo) : {};
}

// Not generateWrapper: getProductPageData may redirect to this locale's slug before rendering
export default async function Page(nextPageProps: PageProps) {
  const fallbackLocale = await getFallbackLocale();
  const { isEnabled: isDraft } = await draftMode();
  const params = await nextPageProps.params;
  const pageProps = { params };
  const { data, variables } = await getProductPageData({
    params,
    fallbackLocale,
    isDraft,
  });

  return (
    <ContentOrRealTime
      isDraft={isDraft}
      query={query}
      variables={variables}
      data={data}
      pageProps={pageProps}
      contentComponent={Content}
      realtimeComponent={RealTime}
    />
  );
}
