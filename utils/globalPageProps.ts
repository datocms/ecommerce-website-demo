import type { SiteLocale } from '@/graphql/types/graphql';

export type GlobalPageRouteParams = {
  lng: SiteLocale;
};

export type GlobalPageProps = {
  params: GlobalPageRouteParams;
};

export type AsyncGlobalPageProps<
  T extends GlobalPageProps = GlobalPageProps,
  TSearchParams = URLSearchParams | Record<string, string | string[] | undefined>,
  TAsyncParams extends Record<string, any> = Record<string, string>,
> = Omit<T, 'params'> & {
  params?: Promise<TAsyncParams>;
  searchParams?: Promise<TSearchParams | undefined>;
};

export function buildUrl(globalPageProps: GlobalPageProps, path?: string) {
  return `/${globalPageProps.params.lng}${path || ''}`;
}
