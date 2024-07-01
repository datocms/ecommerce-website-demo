import {
  StoresDocument,
  type StoresQuery,
  type StoresQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps;

export type Query = StoresQuery;
export type Variables = StoresQueryVariables;

export const query = StoresDocument;
