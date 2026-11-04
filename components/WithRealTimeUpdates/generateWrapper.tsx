import type { TadaDocumentNode } from 'gql.tada';
import { draftMode } from 'next/headers';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import { getFallbackLocale } from '@/lib/i18n';
import ContentOrRealTime from './ContentOrRealTime';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

/** Builds a route's server component (page or layout) from its query, Content and RealTime */
export function generateWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TadaDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
}) {
  return async function Page(nextPageProps: PageProps) {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    // searchParams is dropped: no Content reads it, and it must not reach the RealTime client props
    const {
      params,
      searchParams: _searchParams,
      ...otherProps
    } = nextPageProps as PageProps & { searchParams?: unknown };
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

    return (
      <ContentOrRealTime
        isDraft={isDraft}
        query={options.query}
        variables={variables}
        data={data}
        pageProps={pageProps}
        contentComponent={options.contentComponent}
        realtimeComponent={options.realtimeComponent}
      />
    );
  };
}
