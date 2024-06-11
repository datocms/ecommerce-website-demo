import {
  LegalPageDocument,
  type LegalPageQuery,
  type LegalPageQueryVariables,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export type PageProps = GlobalPageProps & {
  params: {
    slug: string;
  };
};

export type Query = LegalPageQuery;
export type Variables = LegalPageQueryVariables;

export const query = LegalPageDocument;
