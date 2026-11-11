import type { TadaDocumentNode } from 'gql.tada';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';
import { buildAlternates } from '@/lib/alternates';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import { getAvailableLocales, type SiteLocale } from '@/lib/i18n';
import { resolveRoute } from './resolveRoute';
import type { BuildVariablesFn } from './types';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TadaDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  // DatoCMS meta tags (_seoMetaTags, faviconMetaTags), or a Metadata object for anything else
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | Metadata | undefined;
  // The page's path in a locale; adds the canonical and hreflang links
  alternatePath?: (
    locale: SiteLocale,
    route: {
      data: TResult;
      params: ResolvedPageProps<PageProps>['params'];
    },
  ) => string;
}) {
  return async function generateMetadata(
    nextPageProps: PageProps,
  ): Promise<Metadata> {
    const { isEnabled: isDraft } = await draftMode();
    const { pageProps, variables } = await resolveRoute(
      nextPageProps,
      options.buildVariables,
    );
    const data = await queryDatoCMS(options.query, variables, isDraft);
    const generated = options.generate(data);

    const metadata = Array.isArray(generated)
      ? toNextMetadata(generated)
      : (generated ?? {});
    const { alternatePath } = options;
    if (!alternatePath) return metadata;

    return {
      ...metadata,
      alternates: buildAlternates({
        locale: pageProps.params.lng,
        locales: await getAvailableLocales(),
        pathFor: (locale) =>
          alternatePath(locale, { data, params: pageProps.params }),
      }),
    };
  };
}
