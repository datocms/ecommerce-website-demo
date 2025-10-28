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
  /**
   * Create a client component bound to a specific route/view that will render
   * server data and subscribe to DatoCMS Listen for realtime updates.
   *
   * @template PageProps - Page props that include locale params
   * @template TResult - GraphQL result shape for the view
   * @template TVariables - GraphQL variables type used by the query
   */
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
