'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import Section from './Sections';
import {
  CollectionMetadata,

  PageQuery,
  PageQueryVariables,
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
  initialData: PageQuery;
  variables: PageQueryVariables;
  query: TypedDocumentNode<PageQuery, PageQueryVariables>;
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

  if (!data || !data.page) return <></>;

  return (
    <Section
      locale={locale}
      sections={data.page.sections as any} //TODO TYPE LATER
    />
  );
}
