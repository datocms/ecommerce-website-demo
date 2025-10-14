import { getFallbackLocale } from '@/app/i18n/settings';
import type {
  AsyncGlobalPageProps,
  GlobalPageProps,
} from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';
import { Fragment } from 'react';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

type AsyncPageProps<PageProps extends GlobalPageProps> = AsyncGlobalPageProps<
  PageProps,
  URLSearchParams | Record<string, string | string[] | undefined>,
  Record<string, string>
>;

export function generateWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
}) {
  return async function Page(
    unsanitizedPageProps: AsyncPageProps<PageProps>,
  ) {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    const { searchParams: _unusedSearchParams, ...pagePropsWithoutSearchParams } =
      unsanitizedPageProps;

    const rawParams = await unsanitizedPageProps.params;

    if (!rawParams) {
      throw new Error('Missing route params in page wrapper.');
    }

    const params = rawParams as PageProps['params'];

    const pageProps = {
      ...pagePropsWithoutSearchParams,
      params,
    } as unknown as PageProps;

    const includeVisualEditingMetadata = isDraft;

    const baseVariables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const variables = includeVisualEditingMetadata
      ? ({
          ...baseVariables,
          ...(baseVariables &&
          typeof baseVariables === 'object' &&
          'visualEditing' in (baseVariables as Record<string, unknown>)
            ? {}
            : { visualEditing: true }),
        } as TVariables)
      : baseVariables;

    const data = await queryDatoCMS(options.query, variables, {
      isDraft,
      visualEditing: includeVisualEditingMetadata,
    });

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    return isDraft ? (
      <Fragment>
        <RealTime
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={options.query}
          variables={variables}
          initialData={data}
          pageProps={pageProps}
        />
      </Fragment>
    ) : (
      <Fragment>
        <Content {...pageProps} data={data} />
      </Fragment>
    );
  };
}
