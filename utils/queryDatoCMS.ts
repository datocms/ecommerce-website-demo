/**
 * queryDatoCMS
 *
 * Server-side helper to call the DatoCMS GraphQL API with sensible defaults:
 * - Attaches `includeDrafts` when draft mode is active.
 * - When visual-editing metadata is requested, enables Content Link headers so
 *   `_editingUrl` fields resolve and Visual Editing overlays can attach.
 * - Disables caching for preview/draft requests and enables Next.js tag-based
 *   caching otherwise.
 */
import 'server-only';

import { executeQuery } from '@datocms/cda-client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode } from 'next/headers';

export type QueryDatoCMSOptions = {
  isDraft?: boolean;
  visualEditing?: boolean;
};

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  options?: QueryDatoCMSOptions | boolean,
): Promise<TResult> {
  if (!process.env.DATOCMS_READONLY_API_TOKEN) {
    throw new Error(
      'Missing DatoCMS API token: make sure a DATOCMS_READONLY_API_TOKEN environment variable is set!',
    );
  }

  const normalizedOptions: QueryDatoCMSOptions =
    typeof options === 'boolean' ? { isDraft: options } : (options ?? {});

  const { isDraft, visualEditing } = normalizedOptions;

  let draftEnabled = Boolean(isDraft);

  if (typeof isDraft !== 'boolean') {
    try {
      const draft = await draftMode();
      draftEnabled = draft.isEnabled;
    } catch (_error) {
      draftEnabled = false;
    }
  }

  // Visual Editing metadata is enabled in draft mode unless explicitly
  // overridden via the `visualEditing` option.
  const includeVisualEditingMetadata = visualEditing ?? draftEnabled;

  let baseEditingUrl: string | undefined;

  if (includeVisualEditingMetadata) {
    baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL ?? undefined;

    if (!baseEditingUrl) {
      throw new Error(
        'Missing NEXT_PUBLIC_DATO_BASE_EDITING_URL environment variable: required when requesting `_editingUrl` fields from DatoCMS.',
      );
    }
  }

  // Preview/draft traffic should bypass cache; published traffic can be cached
  // and tagged for on-demand revalidation.
  const shouldBypassCache = includeVisualEditingMetadata || draftEnabled;

  const requestInitOptions: (Partial<RequestInit> & {
    next?: { tags: string[] };
  }) | undefined = shouldBypassCache
    ? { cache: 'no-store' }
    : { cache: 'force-cache', next: { tags: ['datocms'] } };

  return executeQuery(document, {
    token: process.env.DATOCMS_READONLY_API_TOKEN,
    includeDrafts: draftEnabled,
    excludeInvalid: true,
    contentLink: includeVisualEditingMetadata ? 'vercel-v1' : undefined,
    baseEditingUrl,
    variables,
    requestInitOptions,
  });
}
