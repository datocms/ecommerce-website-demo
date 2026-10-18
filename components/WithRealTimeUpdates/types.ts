import type { TadaDocumentNode } from 'gql.tada';
import type { SiteLocale } from '@/app/i18n/settings';
import type {
  GlobalPageProps,
  ResolvedGlobalPageProps,
} from '@/utils/globalPageProps';

// Type for resolved page props (after awaiting params)
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
  children?: React.ReactNode;
}) => React.ReactNode;

export type ContentPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
> = (
  props: ResolvedPageProps<PageProps> & {
    data: TResult;
  },
) => React.ReactNode;

// Re-export for convenience
export type { ResolvedGlobalPageProps };
