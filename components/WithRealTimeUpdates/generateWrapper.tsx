/**
 * Server Wrapper for Pages
 *
 * Responsibilities
 * - Resolves locale params and `draftMode()` on the server.
 * - Ensures `_editingUrl` metadata is requested while in draft mode by
 *   injecting `visualEditing: true` (and `X-Base-Editing-Url` via
 *   utils/queryDatoCMS.ts).
 * - Returns the realtime client wrapper when in draft mode; otherwise renders
 *   the server view directly.
 */
import { getFallbackLocale } from '@/app/i18n/settings';
import type {
  AsyncGlobalPageProps,
  GlobalPageProps,
} from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';
import { Fragment } from 'react';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

type AsyncPageProps<PageProps extends GlobalPageProps> = AsyncGlobalPageProps<
  PageProps,
  URLSearchParams | Record<string, string | string[] | undefined>,
  Record<string, string>
>;

export function generateWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
  onData?: (data: TResult, context: { pageProps: PageProps }) => void;
}) {
  return async function Page(
    unsanitizedPageProps: AsyncPageProps<PageProps>,
  ) {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = await draftMode();

    const { searchParams: _unusedSearchParams, ...pagePropsWithoutSearchParams } =
      unsanitizedPageProps;

    const rawParams = await unsanitizedPageProps.params;

    if (!rawParams) {
      throw new Error('Missing route params in page wrapper.');
    }

    const params = rawParams as PageProps['params'];

    const pageProps = {
      ...pagePropsWithoutSearchParams,
      params,
    } as unknown as PageProps;

    // While draft mode is enabled, always include visual-editing metadata in
    // queries so the client controller can render overlays on demand.
    const includeVisualEditingMetadata = isDraft;

    const baseVariables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const variables = includeVisualEditingMetadata
      ? ({
          ...baseVariables,
          ...(baseVariables &&
          typeof baseVariables === 'object' &&
          'visualEditing' in (baseVariables as Record<string, unknown>)
            ? {}
            : { visualEditing: true }),
        } as TVariables)
      : baseVariables;

    const data = await queryDatoCMS(options.query, variables, {
      isDraft,
      visualEditing: includeVisualEditingMetadata,
    });

    options.onData?.(data, { pageProps });

    const Content = options.contentComponent;
    const RealTime = options.realtimeComponent;
    const previewToken = process.env.DATOCMS_READONLY_API_TOKEN;
    const environment = process.env.NEXT_PUBLIC_DATO_ENVIRONMENT;
    const baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL;

    if (isDraft) {
      if (!previewToken) {
        throw new Error(
          'Draft mode requires DATOCMS_READONLY_API_TOKEN to be set.',
        );
      }
      if (!baseEditingUrl) {
        throw new Error(
          'Draft mode requires NEXT_PUBLIC_DATO_BASE_EDITING_URL to be set when requesting `_editingUrl`.',
        );
      }

      // In draft mode we return the realtime client wrapper that will stream
      // changes via Listen and keep overlays in sync.
      return (
        <RealTime
          token={previewToken}
          query={options.query}
          variables={variables}
          initialData={data}
          pageProps={pageProps}
          environment={environment}
          baseEditingUrl={baseEditingUrl}
        />
      );
    }

    return (
      <Fragment>
        <Content {...pageProps} data={data} />
      </Fragment>
    );
  };
}
