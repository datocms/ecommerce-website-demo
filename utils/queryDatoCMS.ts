/**
 * queryDatoCMS
 *
 * Server-side helper to call the DatoCMS GraphQL API with sensible defaults:
 * - Attaches `X-Include-Drafts: true` when draft mode is active.
 * - When visual-editing metadata is requested, wraps `fetch` with
 *   `withContentLinkHeaders`, which sets `X-Visual-Editing` and
 *   `X-Base-Editing-Url` (required for `_editingUrl`). The wrapper is cached
 *   per base URL to avoid re-creating clients.
 * - Disables caching for preview/draft requests and enables Next.js tag-based
 *   caching otherwise.
 */
import 'server-only';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { withContentLinkHeaders } from 'datocms-visual-editing';
import { print } from 'graphql';
import { draftMode } from 'next/headers';

type QueryDatoCMSOptions = {
  isDraft?: boolean;
  visualEditing?: boolean;
};

// Cache the wrapped fetch so repeated calls don’t allocate extra wrappers.
const getFetchWithContentLinkHeaders = (() => {
  let cachedClient: typeof fetch | null = null;
  let cachedBaseEditingUrl: string | null = null;

  return (baseEditingUrl: string) => {
    if (!cachedClient || cachedBaseEditingUrl !== baseEditingUrl) {
      cachedClient = withContentLinkHeaders(fetch, baseEditingUrl);
      cachedBaseEditingUrl = baseEditingUrl;
    }

    return cachedClient;
  };
})();

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options?: QueryDatoCMSOptions | boolean,
): Promise<TResult> {
  /**
   * Execute a GraphQL query against DatoCMS with sensible app defaults.
   *
   * Behaviour
   * - Detects Next draft mode when `options.isDraft` is omitted and uses it to
   *   automatically include preview content and disable cache.
   * - When `options.visualEditing` is true, wraps `fetch` via
   *   {@link withContentLinkHeaders} so `_editingUrl` is populated for fields
   *   that request it and adds the appropriate headers.
   * - For non-draft traffic, enables Next.js response caching with the
   *   `datocms` tag so routes can be revalidated via tag.
   *
   * @template TResult, TVariables
   * @param document - Typed GraphQL document to execute
   * @param variables - Variables for the GraphQL operation
   * @param options - Boolean for `isDraft` or an option bag
   * @returns The parsed GraphQL `data` field
   * @throws If the API token is missing or the request returns errors
   */
  if (!process.env.DATOCMS_READONLY_API_TOKEN) {
    throw new Error(
      'Missing DatoCMS API token: make sure a DATOCMS_READONLY_API_TOKEN environment variable is set!',
    );
  }

  const normalizedOptions: QueryDatoCMSOptions =
    typeof options === 'boolean' ? { isDraft: options } : (options ?? {});

  const { isDraft, visualEditing } = normalizedOptions;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  let draftEnabled = Boolean(isDraft);

  if (typeof isDraft !== 'boolean') {
    try {
      const draft = await draftMode();
      draftEnabled = draft.isEnabled;
    } catch (_error) {
      draftEnabled = false;
    }
  }

  // Visual-editing metadata is enabled in draft mode unless explicitly
  // overridden via the `visualEditing` option.
  const includeVisualEditingMetadata = visualEditing ?? draftEnabled;

  if (draftEnabled) {
    headers['X-Include-Drafts'] = 'true';
  }

  let baseEditingUrl: string | null = null;

  if (includeVisualEditingMetadata) {
    baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL ?? null;

    if (!baseEditingUrl) {
      throw new Error(
        'Missing NEXT_PUBLIC_DATO_BASE_EDITING_URL environment variable: required when requesting `_editingUrl` fields from DatoCMS.',
      );
    }
  }

  const fetchClient = includeVisualEditingMetadata
    ? getFetchWithContentLinkHeaders(baseEditingUrl as string)
    : fetch;

  // Preview/draft traffic should bypass cache; published traffic can be cached
  // and tagged for on-demand revalidation.
  const shouldBypassCache = includeVisualEditingMetadata || draftEnabled;

  const response = await fetchClient('https://graphql.datocms.com/', {
    cache: shouldBypassCache ? 'no-store' : 'force-cache',
    ...(shouldBypassCache ? {} : { next: { tags: ['datocms'] } }),
    method: 'POST',
    headers,
    body: JSON.stringify({ query: print(document), variables }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(`Invalid status code: ${response.status}\n${body}`);
  }

  const body = (await response.json()) as
    | { data: TResult }
    | { errors: unknown[] };

  if ('errors' in body) {
    throw new Error(
      `Invalid GraphQL request: ${JSON.stringify(body.errors, null, 2)}`,
    );
  }

  return body.data;
}
