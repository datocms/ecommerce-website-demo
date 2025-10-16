'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { subscribeToQuery } from 'datocms-listen';
import { withContentLinkHeaders } from 'datocms-visual-editing';
import { useDatoVisualEditingListen } from 'datocms-visual-editing/react';
import {
  getVisualEditingController,
  refreshVisualEditing,
} from '@/components/preview/DatoVisualEditingBridge';

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

  // Wrap `fetch` so every GraphQL call includes the base editing URL headers
  // required for `_editingUrl` to appear in the response.
  const fetcher = useMemo(() => {
    const client = withContentLinkHeaders(fetch);
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers ?? {});
      headers.set('X-Base-Editing-Url', baseEditingUrl);
      return client(input, { ...init, headers });
    };
  }, [baseEditingUrl]);

  // Subscribe to the DatoCMS Listen API. The hook expects a synchronous
  // unsubscribe function, so we normalise the promise returned by
  // `subscribeToQuery` into a plain cleanup function.
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

  const externalController = getVisualEditingController() ?? undefined;

  // Keep overlays in sync with the Listen stream. If a controller already
  // exists (mounted by the preview bridge) we reuse it; otherwise the hook
  // creates one using the supplied options.
  useDatoVisualEditingListen(subscribe, {
    scopeRef,
    controller: externalController,
    controllerOptions: externalController
      ? undefined
      : {
          baseEditingUrl,
          ...(environment ? { environment } : {}),
          autoEnable: false,
          debug: process.env.NODE_ENV !== 'production',
        },
  });

  // The child component renders the preview markup. Because this component is
  // client-side, it hydrates the same DOM node the server produced, ensuring
  // visual-editing attributes remain intact.
  return <div ref={scopeRef}>{children({ ...pageProps, data })}</div>;
}
