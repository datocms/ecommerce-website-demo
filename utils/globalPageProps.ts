import type { SiteLocale } from '@/graphql/types/graphql';

/** Route params injected by the locale-aware App Router. */
export type GlobalPageRouteParams = {
  /** Active site language (eg. `en`, `it`, `pt_BR`). */
  lng: SiteLocale;
};

/** Common shape for all locale-based page components. */
export type GlobalPageProps = {
  params: GlobalPageRouteParams;
};

/**
 * Async variant of {@link GlobalPageProps} used by wrappers that accept
 * `params` and `searchParams` as Promises.
 */
export type AsyncGlobalPageProps<
  T extends GlobalPageProps = GlobalPageProps,
  TSearchParams =
    | URLSearchParams
    | Record<string, string | string[] | undefined>,
  TAsyncParams extends Record<string, unknown> = Record<string, string>,
> = Omit<T, 'params'> & {
  /** Promise that resolves to route params. */
  params?: Promise<TAsyncParams>;
  /** Promise that resolves to search params when available. */
  searchParams?: Promise<TSearchParams | undefined>;
};

/**
 * Build a localized, absolute path from page props.
 *
 * @param globalPageProps - Props that include the locale param.
 * @param path - Optional path suffix starting with `/`.
 * @returns A string like `"/en/home"`.
 * @example
 * buildUrl({ params: { lng: 'en' } }, '/home'); // "/en/home"
 */
export function buildUrl(globalPageProps: GlobalPageProps, path?: string) {
  return `/${globalPageProps.params.lng}${path || ''}`;
}
