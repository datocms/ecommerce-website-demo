import type { TadaDocumentNode } from 'gql.tada';
import PageTransition from '@/components/Motion/PageTransition';
import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import type { ContentPage, RealtimeUpdatesPage } from './types';

type Props<PageProps extends GlobalPageProps, TResult, TVariables> = {
  isDraft: boolean;
  query: TadaDocumentNode<TResult, TVariables>;
  variables: TVariables;
  data: TResult;
  pageProps: ResolvedPageProps<PageProps>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
};

/**
 * Published: <Content> with the query result. Draft mode: <RealTime>, which re-renders it on
 * DatoCMS real-time updates; the only place the read-only draft token reaches the browser.
 */
export default function ContentOrRealTime<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  isDraft,
  query,
  variables,
  data,
  pageProps,
  contentComponent: Content,
  realtimeComponent: RealTime,
}: Props<PageProps, TResult, TVariables>) {
  // Outside the draft switch, so toggling draft mode is an update, not a page change
  return (
    <PageTransition>
      {isDraft ? (
        <RealTime
          token={process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!}
          baseEditingUrl={process.env.DATOCMS_BASE_EDITING_URL!}
          query={query}
          variables={variables}
          initialData={data}
          pageProps={pageProps}
        />
      ) : (
        <Content {...pageProps} data={data} />
      )}
    </PageTransition>
  );
}
