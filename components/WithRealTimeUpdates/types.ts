import type { TadaDocumentNode } from 'gql.tada';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import type { SiteLocale } from '@/lib/i18n';

// A route's props after awaiting params (Next.js passes params as a Promise)
export type ResolvedPageProps<T extends GlobalPageProps> = Omit<T, 'params'> & {
  params: Awaited<T['params']>;
};

export type BuildVariablesFn<
  PageProps extends GlobalPageProps,
  TVariables = Record<string, unknown>,
> = (
  context: ResolvedPageProps<PageProps> & {
    fallbackLocale: SiteLocale;
  },
) => TVariables;

export type RealtimeUpdatesPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
> = (props: {
  initialData: TResult;
  pageProps: ResolvedPageProps<PageProps>;
  variables: TVariables;
  query: TadaDocumentNode<TResult, TVariables>;
  token: string;
  baseEditingUrl: string;
}) => React.ReactNode;

export type ContentPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
> = (
  props: ResolvedPageProps<PageProps> & {
    data: TResult;
  },
) => React.ReactNode;
