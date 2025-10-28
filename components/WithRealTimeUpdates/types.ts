/**
 * Shared typing for the server/client preview choreography.
 * - `ContentPage` is the pure view that both server and client render.
 * - `RealtimeUpdatesPage` is the client shell that streams updates.
 * - `BuildVariablesFn` lets pages derive query variables from params + locale.
 */

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { SiteLocale } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

/**
 * Function signature used by pages to derive GraphQL variables from the page
 * props and the resolved fallback locale.
 */
export type BuildVariablesFn<
  PageProps extends GlobalPageProps,
  TVariables = Record<string, unknown>,
> = (
  context: PageProps & {
    fallbackLocale: SiteLocale;
  },
) => TVariables;

export type ContentPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
> = (
  props: PageProps & {
    data: TResult;
  },
) => React.ReactNode;

export type ClientContentPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
> = React.ComponentType<
  PageProps & {
    data: TResult;
  }
>;

export type RealtimeUpdatesPage<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
> = (props: {
  initialData: TResult;
  pageProps: PageProps;
  variables: TVariables;
  query: TypedDocumentNode<TResult, TVariables> | string;
  token: string;
  environment?: string;
  baseEditingUrl: string;
  children?: React.ReactNode;
}) => React.ReactNode;
