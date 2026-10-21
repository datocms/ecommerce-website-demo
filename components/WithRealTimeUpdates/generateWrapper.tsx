import type { TadaDocumentNode } from 'gql.tada';
import { draftMode } from 'next/headers';
import PageTransition from '@/components/Motion/PageTransition';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import { getFallbackLocale } from '@/lib/i18n';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

/**
 * Builds the server component for a route (page or layout). It runs the route query, then
 * renders <Content> with the data, or in draft mode <RealTime>: a client component subscribed
 * to DatoCMS real-time updates so editors see changes live. Only in that case is the read-only
 * draft token sent to the browser. Either way the result is wrapped in PageTransition, so a
 * route change fades while a draft toggle or a live update does not.
 */
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

    // searchParams is dropped: no Content reads it, and it must not be forwarded into the
    // RealTime client props
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

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    const page = isDraft ? (
      <RealTime
        token={process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!}
        baseEditingUrl={process.env.DATOCMS_BASE_EDITING_URL!}
        query={options.query}
        variables={variables}
        initialData={data}
        pageProps={pageProps}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );

    // Around both branches, so entering or leaving draft mode is an update, not a new page
    return <PageTransition>{page}</PageTransition>;
  };
}
