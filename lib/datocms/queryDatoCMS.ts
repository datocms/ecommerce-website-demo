import { executeQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';
import { requireEnv } from '@/lib/requireEnv';

/**
 * Runs a query against the Content Delivery API. Published reads are cached under the "datocms" tag
 * that /api/revalidateCache purges; draft reads skip the cache and carry Content Link metadata.
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
    token: requireEnv(
      isDraft
        ? 'DATOCMS_DRAFT_CONTENT_CDA_TOKEN'
        : 'DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN',
    ),
    variables,
    includeDrafts: isDraft,
    // Same as X-Exclude-Invalid in `npm run generate-schema`, so results match the generated types
    excludeInvalid: true,
    ...(isDraft
      ? {
          contentLink: 'v1',
          baseEditingUrl: requireEnv('DATOCMS_BASE_EDITING_URL'),
        }
      : {}),
    requestInitOptions: {
      cache: isDraft ? 'no-store' : 'force-cache',
      next: isDraft ? undefined : { tags: ['datocms'] },
    },
  });
}
