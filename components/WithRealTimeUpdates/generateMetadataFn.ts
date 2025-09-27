import { getFallbackLocale } from '@/app/i18n/settings';
import type {
  AsyncGlobalPageProps,
  GlobalPageProps,
} from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';
import type { BuildVariablesFn } from './types';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | undefined;
}) {
  return async function generateMetadata(
    pageProps: AsyncGlobalPageProps<PageProps>,
  ): Promise<Metadata> {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    const { searchParams: _unusedSearchParams, ...pagePropsWithoutSearchParams } =
      pageProps;

    const rawParams = await pageProps.params;

    if (!rawParams) {
      throw new Error('Missing route params while generating metadata.');
    }

    const resolvedPageProps = {
      ...pagePropsWithoutSearchParams,
      params: rawParams as PageProps['params'],
    } as unknown as PageProps;

    const variables =
      options.buildVariables?.({
        ...resolvedPageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, { isDraft });

    const tags = options.generate(data);

    return tags ? toNextMetadata(tags) : {};
  };
}
