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
  // DatoCMS meta tags (_seoMetaTags, faviconMetaTags), or a Metadata object for anything else
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | Metadata | undefined;
}) {
  return async function generateMetadata(
    nextPageProps: PageProps,
  ): Promise<Metadata> {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    const { params, ...otherProps } = nextPageProps;
    const pageProps = {
      ...otherProps,
      params: await params,
    } as unknown as ResolvedPageProps<PageProps>;

    const variables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);

    const generated = options.generate(data);

    if (!generated) return {};
    return Array.isArray(generated) ? toNextMetadata(generated) : generated;
  };
}
