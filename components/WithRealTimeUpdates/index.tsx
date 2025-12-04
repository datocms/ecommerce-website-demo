import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuerySubscription } from 'react-datocms/use-query-subscription';
import type { GlobalPageProps } from '@/utils/globalPageProps';

export default function WithRealTimeUpdates<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  initialData,
  token,
  query,
  variables,
  children,
  pageProps,
}: {
  initialData: TResult;
  variables: TVariables;
  query: TypedDocumentNode<TResult, TVariables>;
  children: (
    props: PageProps & {
      data: TResult;
    },
  ) => React.ReactNode;
  pageProps: PageProps;
  token: string;
}) {
  const { data } = useQuerySubscription({
    query,
    variables,
    token,
    initialData,
    preview: true,
  });

  if (!data) return null;

  return children({ ...pageProps, data });
}
