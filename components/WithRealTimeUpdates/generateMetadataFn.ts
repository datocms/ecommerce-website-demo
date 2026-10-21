import type { TadaDocumentNode } from 'gql.tada';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import { getFallbackLocale } from '@/lib/i18n';
import type { BuildVariablesFn, ResolvedPageProps } from './types';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TadaDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | undefined;
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

    const tags = options.generate(data);

    return tags ? toNextMetadata(tags) : {};
  };
}
