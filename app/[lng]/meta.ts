import {
  LayoutDocument,
  type LayoutQuery,
  type LayoutQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  children: React.ReactNode;
};

export type Query = LayoutQuery;
export type Variables = LayoutQueryVariables;

export const query = LayoutDocument;
