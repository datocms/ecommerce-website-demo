import type { TadaDocumentNode } from 'gql.tada';
import { draftMode } from 'next/headers';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import ContentOrRealTime from './ContentOrRealTime';
import { resolveRoute } from './resolveRoute';
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
    const { isEnabled: isDraft } = await draftMode();
    const { pageProps, variables } = await resolveRoute(
      nextPageProps,
      options.buildVariables,
    );
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
