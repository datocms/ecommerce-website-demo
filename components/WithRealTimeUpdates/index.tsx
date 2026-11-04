// Client-only (uses a hook): rendered from each route's 'use client' RealTime.tsx via
// generateRealtimeComponent.

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import type { ContentPage, RealtimeUpdatesProps } from './types';

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
}: RealtimeUpdatesProps<PageProps, TResult, TVariables> & {
  children: ContentPage<PageProps, TResult>;
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
