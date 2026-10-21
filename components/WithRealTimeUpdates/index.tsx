// Client-only (uses a hook): rendered from each route's 'use client' RealTime.tsx via
// generateRealtimeComponent.

import type { TadaDocumentNode } from 'gql.tada';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import type { GlobalPageProps, ResolvedPageProps } from '@/lib/globalPageProps';
import type { ContentPage } from './types';

export default function WithRealTimeUpdates<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  initialData,
  token,
  query,
  variables,
  children,
  pageProps,
  baseEditingUrl,
}: {
  initialData: TResult;
  variables: TVariables;
  query: TadaDocumentNode<TResult, TVariables>;
  children: ContentPage<PageProps, TResult>;
  pageProps: ResolvedPageProps<PageProps>;
  token: string;
  baseEditingUrl: string;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    includeDrafts: true,
    contentLink: 'v1',
    baseEditingUrl,
  });

  if (!data) return null;

  return children({ ...pageProps, data });
}
