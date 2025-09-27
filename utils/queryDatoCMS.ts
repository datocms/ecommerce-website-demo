import 'server-only';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { withContentLinkHeaders } from 'datocms-visual-editing';
import { draftMode } from 'next/headers';
import { print } from 'graphql';

type QueryDatoCMSOptions = {
  isDraft?: boolean;
  visualEditing?: boolean;
};

const fetchWithContentLinkHeaders = withContentLinkHeaders(fetch);

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
    typeof options === 'boolean' ? { isDraft: options } : options ?? {};

  const { isDraft, visualEditing } = normalizedOptions;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  if (visualEditing) {
    const baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL;

    if (!baseEditingUrl) {
      throw new Error(
        'Missing NEXT_PUBLIC_DATO_BASE_EDITING_URL environment variable: required when requesting `_editingUrl` fields from DatoCMS.',
      );
    }

    headers['X-Base-Editing-Url'] = baseEditingUrl;
  }

  let draftEnabled = Boolean(isDraft);

  if (typeof isDraft !== 'boolean') {
    try {
      const draft = await draftMode();
      draftEnabled = draft.isEnabled;
    } catch (error) {
      draftEnabled = false;
    }
  }

  if (draftEnabled) {
    headers['X-Include-Drafts'] = 'true';
  }

  const fetchClient = visualEditing ? fetchWithContentLinkHeaders : fetch;

  const response = await fetchClient('https://graphql.datocms.com/', {
    cache: 'force-cache',
    next: { tags: ['datocms'] },
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
