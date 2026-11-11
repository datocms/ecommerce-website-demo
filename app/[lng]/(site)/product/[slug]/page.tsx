import { draftMode } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { toNextMetadata } from 'react-datocms/seo';
import { buildLocaleVariables } from '@/components/WithRealTimeUpdates/buildLocaleVariables';
import ContentOrRealTime from '@/components/WithRealTimeUpdates/ContentOrRealTime';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import { buildAlternates } from '@/lib/alternates';
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
import { productPath } from '@/lib/routes';
import Content from './Content';
import { buildProductJsonLd } from './jsonLd';
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
  ...buildLocaleVariables({ params, fallbackLocale }),
  slug: params.slug,
});

type ProductPageContext = {
  params: Awaited<PageProps['params']>;
  fallbackLocale: SiteLocale;
  isDraft: boolean;
};

// The slug in the URL matches no product in this locale: it may be another locale's slug, so
// redirect to this locale's, or 404
async function resolveFallbackProductPage({
  params,
  fallbackLocale,
  isDraft,
}: ProductPageContext) {
  const locale = params.lng as SiteLocale;
  const variables = buildVariables({ params, fallbackLocale });
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
    redirect(productPath(params.lng, resolved.localizedSlug));
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

async function getProductPageData(context: ProductPageContext) {
  const { params, fallbackLocale, isDraft } = context;
  const locale = params.lng as SiteLocale;
  const variables = buildVariables({ params, fallbackLocale });
  const data = await queryDatoCMS(query, variables, isDraft);

  if (!data.product) {
    return resolveFallbackProductPage(context);
  }

  const slugs = buildProductSlugMap(
    data.product._allSlugLocales,
    locale,
    data.product.slug,
  );
  const localizedSlug = slugForLocale(slugs, locale, fallbackLocale);

  if (localizedSlug && localizedSlug !== params.slug) {
    redirect(productPath(params.lng, localizedSlug));
  }

  return { data, variables };
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

  if (!data.product) return {};

  const locale = params.lng as SiteLocale;
  const locales = await getAvailableLocales();
  const slugs = buildProductSlugMap(
    data.product._allSlugLocales,
    locale,
    data.product.slug,
  );

  return {
    ...toNextMetadata(data.product.seo),
    // Product slugs are localized
    alternates: buildAlternates({
      locale,
      locales,
      pathFor: (available) =>
        productPath(
          available,
          slugForLocale(slugs, available, fallbackLocale) ??
            data.product?.slug ??
            '',
        ),
    }),
  };
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

  const { product, generalInterface } = data;

  return (
    <>
      {/* Rendered here, not in Content, which also runs in the browser in draft mode */}
      {product && generalInterface && (
        <script
          type="application/ld+json"
          // "<" is escaped so the data cannot close the script tag
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildProductJsonLd({
                product,
                lng: params.lng,
                currencyCode: generalInterface.currencyCode,
              }),
            ).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <ContentOrRealTime
        isDraft={isDraft}
        query={query}
        variables={variables}
        data={data}
        pageProps={pageProps}
        contentComponent={Content}
        realtimeComponent={RealTime}
      />
    </>
  );
}
