'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Section from './Sections';
import {
  CollectionMetadata,
  HomeQuery,
  HomeQueryVariables,
  SiteLocale,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export default function RealTimeSections({
  initialData,
  token,
  query,
  variables,
  locale,
}: {
  initialData: HomeQuery;
  variables: HomeQueryVariables;
  query: TypedDocumentNode<HomeQuery, HomeQueryVariables>;
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

  if (!data || !data.home) return <></>;

  return (
    <Section
      locale={locale}
      sections={data.home.sections as any} //TODO TYPE LATER
    />
  );
}
