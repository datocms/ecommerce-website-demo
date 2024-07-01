import {
  HomeDocument,
  type HomeQuery,
  type HomeQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps;

export type Query = HomeQuery;
export type Variables = HomeQueryVariables;

export const query = HomeDocument;
