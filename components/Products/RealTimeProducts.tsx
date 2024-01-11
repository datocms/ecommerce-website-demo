'use client';

import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import {
  ProductQuery,
  ProductQueryVariables,
  ProductsQueryVariables,
  SiteLocale,
} from '@/graphql/generated';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import Product from './Product';

export default function RealTimeProducts({
  initialData,
  token,
  query,
  variables,
  locale,
}: {
  initialData: ProductQuery;
  variables: ProductQueryVariables;
  query: TypedDocumentNode<ProductQuery, ProductsQueryVariables>;
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

  if (!data || !data.product) return <></>;

  return <Product data={data} lng={locale} />;
}
