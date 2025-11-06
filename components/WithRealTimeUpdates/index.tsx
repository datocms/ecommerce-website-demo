/**
 * Realtime Preview Wrapper
 *
 * Subscribes to DatoCMS Listen and re-renders page content whenever draft
 * content changes. After each update, it asks the shared Visual Editing
 * controller to rescan the updated DOM so overlays remain accurate.
 *
 * Important:
 * - Reuse the exact DOM nodes React hydrated; render the same view the server
 *   used so `_editingUrl`/stega markers stay attached.
 * - Always reuse the global controller created by the preview bridge.
 */
'use client';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { subscribeToQuery } from 'datocms-listen';
import { useDatoVisualEditingListen } from 'datocms-visual-editing/react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  getVisualEditingController,
  refreshVisualEditing,
  useDatoVisualEditing,
} from '@/components/preview/DatoVisualEditingBridge';
import type { GlobalPageProps } from '@/utils/globalPageProps';

/**
 * Client component that keeps the server-rendered preview tree in sync with the
 * DatoCMS Listen API. It renders once with the server payload, subscribes to
 * realtime updates, and re-renders the same DOM node while asking the visual
 * editing controller to rescan the page.
 */

/**
 * Props for the realtime wrapper. Parameterized by the page's props, the
 * GraphQL result shape, and the variables shape.
 */
export type Props<PageProps extends GlobalPageProps, TResult, TVariables> = {
  initialData: TResult;
  query: TypedDocumentNode<TResult, TVariables> | string;
  variables: TVariables;
  token: string;
  environment?: string;
  baseEditingUrl: string;
  pageProps: PageProps;
  children: (
    props: PageProps & {
      data: TResult;
    },
  ) => React.ReactNode;
};

export default function WithRealTimeUpdates<
  PageProps extends GlobalPageProps,
  TResult,
  TVariables,
>({
  initialData,
  query,
  variables,
  token,
  environment,
  baseEditingUrl,
  children,
  pageProps,
}: Props<PageProps, TResult, TVariables>) {
  const [data, setData] = useState(initialData);
  const scopeRef = useRef<HTMLDivElement | null>(null);

  const queryDocument = useMemo(() => query, [query]);

  // Subscribe to the DatoCMS Listen API. `subscribeToQuery` returns a Promise
  // of an unsubscribe; normalise into a sync cleanup for React effects.
  const subscribe = useCallback(
    ({
      onUpdate,
      onError,
    }: {
      onUpdate?: () => void;
      onError?: (error: unknown) => void;
    }) => {
      let unsubscribed = false;
      const unsubscribePromise = subscribeToQuery<TResult, TVariables>({
        query: queryDocument,
        variables,
        token,
        includeDrafts: true,
        ...(environment ? { environment } : {}),
        contentLink: 'vercel-v1',
        baseEditingUrl,
        excludeInvalid: true,
        onUpdate: (payload) => {
          setData(payload.response.data);
          onUpdate?.();
          // Ask the global controller to rescan just our subtree.
          refreshVisualEditing(scopeRef.current ?? undefined);
        },
        onChannelError: (error) => {
          onError?.(error);
          console.error('[DatoCMS Listen] channel error', error);
        },
        onError,
      }).then((unsubscribeFn) => {
        if (unsubscribed) {
          unsubscribeFn?.();
        }
        return unsubscribeFn;
      });

      return () => {
        unsubscribed = true;
        void unsubscribePromise.then((unsubscribeFn) => {
          unsubscribeFn?.();
        });
      };
    },
    [baseEditingUrl, environment, queryDocument, token, variables],
  );

  // Track controller readiness so this component re-renders once the global
  // controller is mounted by the preview bridge.
  const _ve = useDatoVisualEditing();
  const externalController = getVisualEditingController() ?? undefined;

  // Defer wiring the listen-hook until a controller exists to avoid the
  // development warning about missing controllerOptions (and to prevent the
  // hook from creating a second controller). Hooks cannot be conditional, so
  // we render a tiny child component that calls the hook unconditionally when
  // mounted.
  const VisualEditingSync = useMemo(
    () =>
      memo(function VisualEditingSyncInner({
        controller,
      }: {
        controller: NonNullable<ReturnType<typeof getVisualEditingController>>;
      }) {
        useDatoVisualEditingListen(subscribe, {
          scopeRef,
          controller,
          // initialRefresh: true by default; the hook will request a mark.
        });
        return null;
      }),
    [subscribe],
  );

  // Render the server view into the exact node React hydrated. This preserves
  // all stega markers across updates and keeps overlays stable.
  return (
    <div ref={scopeRef}>
      {children({ ...pageProps, data })}
      {externalController ? (
        <VisualEditingSync controller={externalController} />
      ) : null}
    </div>
  );
}
