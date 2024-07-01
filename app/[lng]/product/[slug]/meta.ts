import {
  ProductDocument,
  type ProductQuery,
  type ProductQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = ProductQuery;
export type Variables = ProductQueryVariables;

export const query = ProductDocument;
