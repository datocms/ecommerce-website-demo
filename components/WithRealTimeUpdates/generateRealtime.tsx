/**
 * Realtime Component Factory
 * - Produces a client component (per route) that renders a given view and
 *   wires it to the shared realtime wrapper.
 */
'use client';

import type { GlobalPageProps } from '@/utils/globalPageProps';
import WithRealTimeUpdates from '.';
import type { ClientContentPage, RealtimeUpdatesPage } from './types';

export function generateRealtimeComponent<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  clientContentComponent: ClientContent,
}: {
  clientContentComponent: ClientContentPage<PageProps, TResult>;
}) {
  const component: RealtimeUpdatesPage<PageProps, TResult, TVariables> = (
    props,
  ) => {
    return (
      <WithRealTimeUpdates {...props}>
        {(contentProps) => <ClientContent {...contentProps} />}
      </WithRealTimeUpdates>
    );
  };

  return component;
}
