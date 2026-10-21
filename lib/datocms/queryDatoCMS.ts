import { executeQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';

/**
 * Runs a gql.tada query against the DatoCMS Content Delivery API. Published: published-content
 * token, cached by Next and tagged "datocms" (purged by /api/revalidateCache). Draft: draft token,
 * never cached, and with Content Link metadata for visual editing. excludeInvalid matches the
 * X-Exclude-Invalid header used by `npm run generate-schema`.
 */
export async function queryDatoCMS<
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(
  document: TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  return executeQuery(document, {
    token: isDraft
      ? process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN!
      : process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN!,
    variables,
    includeDrafts: isDraft,
    excludeInvalid: true,
    ...(isDraft
      ? {
          contentLink: 'v1',
          baseEditingUrl: process.env.DATOCMS_BASE_EDITING_URL,
        }
      : {}),
    requestInitOptions: {
      cache: isDraft ? 'no-store' : 'force-cache',
      next: isDraft ? undefined : { tags: ['datocms'] },
    },
  });
}
