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

import { useCallback, useMemo, useRef, useState, memo } from 'react';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { subscribeToQuery } from 'datocms-listen';
import { withContentLinkHeaders } from 'datocms-visual-editing';
import { useDatoVisualEditingListen } from 'datocms-visual-editing/react';
import {
  getVisualEditingController,
  refreshVisualEditing,
} from '@/components/preview/DatoVisualEditingBridge';
import { useDatoVisualEditing } from '@/components/preview/DatoVisualEditingBridge';

/**
 * Client component that keeps the server-rendered preview tree in sync with the
 * DatoCMS Listen API. It renders once with the server payload, subscribes to
 * realtime updates, and re-renders the same DOM node while asking the visual
 * editing controller to rescan the page.
 */

type Props<
  PageProps extends GlobalPageProps,
  TResult,
  TVariables,
> = {
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

  // Wrap `fetch` so every Listen request includes `X-Base-Editing-Url`, which
  // is required for `_editingUrl` to appear in responses.
  const fetcher = useMemo(() => {
    const client = withContentLinkHeaders(fetch);
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers ?? {});
      headers.set('X-Base-Editing-Url', baseEditingUrl);
      return client(input, { ...init, headers });
    };
  }, [baseEditingUrl]);

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
        preview: true,
        ...(environment ? { environment } : {}),
        fetcher,
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
    [environment, fetcher, queryDocument, token, variables],
  );

  // Track controller readiness so this component re-renders once the global
  // controller is mounted by the preview bridge.
  const ve = useDatoVisualEditing();
  const externalController = getVisualEditingController() ?? undefined;

  // Defer wiring the listen-hook until a controller exists to avoid the
  // development warning about missing controllerOptions (and to prevent the
  // hook from creating a second controller). Hooks cannot be conditional, so
  // we render a tiny child component that calls the hook unconditionally when
  // mounted.
  const VisualEditingSync = useMemo(
    () =>
      memo(function VisualEditingSyncInner() {
        useDatoVisualEditingListen(subscribe, {
          scopeRef,
          controller: externalController!,
          // initialRefresh: true by default; the hook will request a mark.
        });
        return null;
      }),
    // Recreate if the subscribe function identity or ref changes.
    [externalController, scopeRef, subscribe],
  );

  // Render the server view into the exact node React hydrated. This preserves
  // all stega markers across updates and keeps overlays stable.
  return (
    <div ref={scopeRef}>
      {children({ ...pageProps, data })}
      {externalController ? <VisualEditingSync /> : null}
    </div>
  );
}
