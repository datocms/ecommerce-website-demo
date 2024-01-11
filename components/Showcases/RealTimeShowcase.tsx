'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import {
  ShowcaseQuery,
  ShowcaseQueryVariables,
  SiteLocale,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import ShowcasePage from './ShowcasePage';

export default function RealTimeShowcase({
  initialData,
  token,
  query,
  variables,
  locale,
}: {
  initialData: ShowcaseQuery;
  variables: ShowcaseQueryVariables;
  query: TypedDocumentNode<ShowcaseQuery, ShowcaseQueryVariables>;
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

  if (!data || !data.showcase) return <></>;

  return <ShowcasePage data={data} lng={locale} />;
}