import 'server-only';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { withContentLinkHeaders } from 'datocms-visual-editing';
import { draftMode } from 'next/headers';
import { print } from 'graphql';

const fetchWithContentLink = withContentLinkHeaders(fetch);

export default async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  if (!process.env.DATOCMS_READONLY_API_TOKEN) {
    throw new Error(
      'Missing DatoCMS API token: make sure a DATOCMS_READONLY_API_TOKEN environment variable is set!',
    );
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Exclude-Invalid': 'true',
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  let draftEnabled = Boolean(isDraft);

  if (typeof isDraft !== 'boolean') {
    try {
      draftEnabled = draftMode().isEnabled;
    } catch (error) {
      draftEnabled = false;
    }
  }

  const baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL;

  if (!baseEditingUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_DATO_BASE_EDITING_URL environment variable: required for DatoCMS Content Link headers!',
    );
  }

  headers['X-Base-Editing-Url'] = baseEditingUrl;

  if (draftEnabled) {
    headers['X-Include-Drafts'] = 'true';
  }

  const client = fetchWithContentLink;

  const response = await client('https://graphql.datocms.com/', {
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
    throw new Error(`Invalid GraphQL request: ${body.errors}`);
  }

  return body.data;
}
