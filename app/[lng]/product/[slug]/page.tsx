import { draftMode } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';
import PageTransition from '@/components/Common/PageTransition';
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
import { type PageProps, type Query, query, type Variables } from './meta';
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

export async function generateMetadata(pageProps: PageProps) {
  const fallbackLocale = await getFallbackLocale();
  const { isEnabled: isDraft } = await draftMode();
  const params = await pageProps.params;
  const { data } = await getProductPageData({
    params,
    fallbackLocale,
    isDraft,
  });

  return data.product?.seo ? toNextMetadata(data.product.seo) : {};
}

export default async function Page(unsanitizedPageProps: PageProps) {
  const fallbackLocale = await getFallbackLocale();
  const { isEnabled: isDraft } = await draftMode();
  const params = await unsanitizedPageProps.params;
  const pageProps = { params };
  const { data, variables } = await getProductPageData({
    params,
    fallbackLocale,
    isDraft,
  });

  // Around both branches, as in generateWrapper: a draft toggle is an update, not a new page
  return (
    <PageTransition>
      {isDraft ? (
        <RealTime
          token={process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!}
          baseEditingUrl={process.env.DATOCMS_BASE_EDITING_URL!}
          query={query}
          variables={variables}
          initialData={data}
          pageProps={pageProps}
        />
      ) : (
        <Content {...pageProps} data={data} />
      )}
    </PageTransition>
  );
}
