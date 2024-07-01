import {
  ShowcaseDocument,
  type ShowcaseQuery,
  type ShowcaseQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps;

export type Query = ShowcaseQuery;
export type Variables = ShowcaseQueryVariables;

export const query = ShowcaseDocument;
