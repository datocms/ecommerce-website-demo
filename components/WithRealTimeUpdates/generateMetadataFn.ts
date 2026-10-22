import type { TadaDocumentNode } from 'gql.tada';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import { getFallbackLocale } from '@/lib/i18n';
import type { BuildVariablesFn } from './types';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TadaDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  // DatoCMS tags (_seoMetaTags, faviconMetaTags), converted with toNextMetadata, or a
  // Metadata object for values that aren't tags
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | Metadata | undefined;
}) {
  return async function generateMetadata(
    pageProps: PageProps,
  ): Promise<Metadata> {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    // Next.js passes params as a Promise
    const resolvedParams = await pageProps.params;

    const resolvedPageProps = {
      ...pageProps,
      params: resolvedParams,
    } as unknown as ResolvedPageProps<PageProps>;

    const variables =
      options.buildVariables?.({
        ...resolvedPageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);

    const generated = options.generate(data);

    if (!generated) return {};
    return Array.isArray(generated) ? toNextMetadata(generated) : generated;
  };
}
