import {
  ProductDocument,
  ProductModelOrderBy,
  type ProductQuery,
  type ProductQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
  filterParams?: {
    page?: string;
    orderBy?: ProductModelOrderBy;
    productName?: string;
    collections?: string;
    brands?: string;
    materials?: string;
  };
};

export type Query = ProductQuery;
export type Variables = ProductQueryVariables;

export const query = ProductDocument;
