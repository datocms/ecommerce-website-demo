// gql.tada setup: a typed graphql() for this project's DatoCMS schema. Types come from
// ./graphql-env.d.ts; run `npm run generate-schema` after changing models in DatoCMS.

import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.js';

/**
 * The Content Delivery API exposes a number of custom GraphQL scalar types. For
 * each one, we must manually define an appropriate TypeScript type mapping.
 *
 * https://www.datocms.com/docs/content-delivery-api/custom-scalar-types
 */
export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    BooleanType: boolean;
    CustomData: Record<string, string>;
    Date: string;
    DateTime: string;
    FloatType: number;
    IntType: number;
    ItemId: string;
    JsonField: unknown;
    MetaTagAttributes: Record<string, string>;
    UploadId: string;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
