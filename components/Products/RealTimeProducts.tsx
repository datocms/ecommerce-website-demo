'use client';

import {
  type ProductQuery,
  type ProductQueryVariables,
  ProductsQueryVariables,
  type SiteLocale,
} from '@/graphql/types/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';
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
  query: TypedDocumentNode<ProductQuery, ProductQueryVariables>;
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

  if (!data || !data.product) return null;

  return <Product data={data} lng={locale} />;
}
