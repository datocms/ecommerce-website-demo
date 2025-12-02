import { getFallbackLocale } from '@/app/i18n/settings';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
  ResolvedPageProps,
} from './types';

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
  return async function Page(unsanitizedPageProps: PageProps) {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    // Await params since they are now Promises in Next.js 16
    const resolvedParams = await unsanitizedPageProps.params;

    const { searchParams, params, ...pagePropsWithoutSearchParamsAndParams } =
      unsanitizedPageProps as PageProps & { searchParams: unknown };

    // Create resolved page props with awaited params
    const pageProps = {
      ...pagePropsWithoutSearchParamsAndParams,
      params: resolvedParams,
    } as unknown as ResolvedPageProps<PageProps>;

    const variables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const data = await queryDatoCMS(options.query, variables, isDraft);

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    return isDraft ? (
      <RealTime
        token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
        query={options.query}
        variables={variables}
        initialData={data}
        pageProps={pageProps}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );
  };
}
