import type { TadaDocumentNode } from 'gql.tada';
import { draftMode } from 'next/headers';
import PageTransition from '@/components/Common/PageTransition';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import { getFallbackLocale } from '@/lib/i18n';
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
  query: TadaDocumentNode<TResult, TVariables>;
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
