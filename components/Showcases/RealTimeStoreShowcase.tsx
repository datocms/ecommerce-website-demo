'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import {
  SiteLocale,
  StoresQuery,
  StoresQueryVariables,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import StoreShowcase from './StoreShowcase';

export default function RealTimeStoreShowcase({
  initialData,
  token,
  query,
  variables,
  locale,
}: {
  initialData: StoresQuery;
  variables: StoresQueryVariables;
  query: TypedDocumentNode<StoresQuery, StoresQueryVariables>;
  locale: SiteLocale;
  token: string;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data || !data.allStores.length) return <></>;

  return <StoreShowcase data={data} />;
}
