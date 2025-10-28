import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { withContentLinkHeaders } from 'datocms-visual-editing';
import { print } from 'graphql';

/**
 * Options supported by {@link queryDatoCMSCore}.
 */
export type QueryOptions = {
  /** If true, includes drafts and disables HTTP caching. */
  isDraft?: boolean;
  /** Additional Next.js cache `tags` to attach to the request. */
  tags?: string[];
};

/**
 * Low-level DatoCMS GraphQL query helper.
 *
 * - Adds Visual Editing headers via {@link withContentLinkHeaders} so
 *   `_editingUrl` fields can be returned when requested by queries.
 * - Generates a stable `queryId` derived from the printed query, variables and
 *   draft flag; the id is included in the request's Next.js tag list for
 *   targeted revalidation.
 * - Returns the raw `x-cache-tags` header so callers can persist a mapping of
 *   CDN cache-tag → query ids for on-demand invalidation.
 *
 * This function is environment-agnostic and does not depend on `draftMode()`.
 * Prefer the higher-level `queryDatoCMS` helper for app usage.
 *
 * @template TResult - GraphQL result data shape
 * @template TVariables - GraphQL variables shape
 * @param document - Typed GraphQL document node to execute
 * @param variables - Variables for the GraphQL query
 * @param isDraftOrOpts - Boolean to include drafts or an options bag
 * @returns Object containing the parsed `data`, a stable `queryId`, and the
 *          `cacheTagsHeader` value if present
 * @throws If `DATOCMS_READONLY_API_TOKEN` is missing or the request fails
 */
export default async function queryDatoCMSCore<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraftOrOpts?: boolean | QueryOptions,
): Promise<{
  data: TResult;
  queryId: string;
  cacheTagsHeader: string | null;
}> {
  if (!process.env.DATOCMS_READONLY_API_TOKEN) {
    throw new Error(
      'Missing DatoCMS API token: make sure a DATOCMS_READONLY_API_TOKEN environment variable is set!',
    );
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    // Ask Dato to include fine-grained cache tags in the response headers.
    'X-Cache-Tags': 'true',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  const isDraft =
    typeof isDraftOrOpts === 'object'
      ? Boolean(isDraftOrOpts?.isDraft)
      : Boolean(isDraftOrOpts);

  if (isDraft) headers['X-Include-Drafts'] = 'true';

  // Add Visual Editing headers: require a base URL for Dato deep links
  // Use the DatoCMS Admin base URL for deep links; can be overridden via env
  const baseUrl =
    process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL ||
    process.env.DATO_BASE_EDITING_URL ||
    'https://ecommerce-website-openai-app.admin.datocms.com/';
  const veFetch = withContentLinkHeaders(fetch, baseUrl);

  const extraTags =
    typeof isDraftOrOpts === 'object' && Array.isArray(isDraftOrOpts.tags)
      ? isDraftOrOpts.tags
      : [];

  const qInput = `${print(document)}|${JSON.stringify(variables ?? {})}|${
    isDraft ? 'D' : 'P'
  }`;
  async function makeQueryId(input: string): Promise<string> {
    try {
      // Use Web Crypto API (Edge/Node >=18)
      if (typeof crypto !== 'undefined' && crypto?.subtle?.digest) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-1', enc.encode(input));
        const bytes = Array.from(new Uint8Array(buf));
        const b64 = btoa(String.fromCharCode(...bytes))
          .replaceAll('+', '-')
          .replaceAll('/', '_')
          .replace(/=+$/, '');
        return `q:${b64}`;
      }
    } catch {}
    // Fallback: deterministic non-crypto hash
    let h = 0;
    for (let i = 0; i < input.length; i++)
      h = (h * 31 + input.charCodeAt(i)) | 0;
    return `q:${String(h >>> 0)}`;
  }
  const queryId = await makeQueryId(qInput);

  const response = await veFetch('https://graphql.datocms.com/', {
    cache: isDraft ? 'no-store' : 'force-cache',
    next: { tags: ['datocms', queryId, ...extraTags] },
    method: 'POST',
    headers,
    body: JSON.stringify({ query: print(document), variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Invalid status code: ${response.status}\n${body}`);
  }

  const cacheTagsHeader =
    response.headers.get('x-cache-tags') ||
    response.headers.get('X-Cache-Tags');

  const body = (await response.json()) as
    | { data: TResult }
    | { errors: unknown[] };

  if ('errors' in body) {
    throw new Error(`Invalid GraphQL request: ${body.errors}`);
  }

  return { data: body.data, queryId, cacheTagsHeader };
}
