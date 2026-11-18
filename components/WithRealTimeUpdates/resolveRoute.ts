import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import { getFallbackLocale } from '@/lib/i18n';
import type { BuildVariablesFn } from './types';

/** Awaits a route's params and builds the variables of its query. */
export async function resolveRoute<
  PageProps extends GlobalPageProps,
  TVariables,
>(
  nextPageProps: PageProps,
  buildVariables?: BuildVariablesFn<PageProps, TVariables>,
) {
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

  const fallbackLocale = await getFallbackLocale();
  const variables =
    buildVariables?.({ ...pageProps, fallbackLocale }) || ({} as TVariables);

  return { pageProps, variables };
}
