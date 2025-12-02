import {
  ProductDocument,
  type ProductQuery,
  type ProductQueryVariables,
} from '@/graphql/types/graphql';

export type PageProps = {
  params: Promise<{
    lng: string;
    slug: string;
  }>;
};

export type Query = ProductQuery;
export type Variables = ProductQueryVariables;

export const query = ProductDocument;
