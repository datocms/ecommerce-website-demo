import {
  LegalPageDocument,
  type LegalPageQuery,
  type LegalPageQueryVariables,
} from '@/graphql/types/graphql';

export type PageProps = {
  params: Promise<{
    lng: string;
    slug: string;
  }>;
};

export type Query = LegalPageQuery;
export type Variables = LegalPageQueryVariables;

export const query = LegalPageDocument;
