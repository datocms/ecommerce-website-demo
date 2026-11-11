import type { TadaDocumentNode } from 'gql.tada';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  toNextMetadata,
} from 'react-datocms/seo';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import { resolveRoute } from './resolveRoute';
import type { BuildVariablesFn } from './types';

export function generateMetadataFn<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TadaDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  // DatoCMS meta tags (_seoMetaTags, faviconMetaTags), or a Metadata object for anything else
  generate: (
    data: TResult,
  ) => TitleMetaLinkTag[] | SeoOrFaviconTag[] | Metadata | undefined;
}) {
  return async function generateMetadata(
    nextPageProps: PageProps,
  ): Promise<Metadata> {
    const { isEnabled: isDraft } = await draftMode();
    const { variables } = await resolveRoute(
      nextPageProps,
      options.buildVariables,
    );
    const data = await queryDatoCMS(options.query, variables, isDraft);
    const generated = options.generate(data);

    if (!generated) return {};
    return Array.isArray(generated) ? toNextMetadata(generated) : generated;
  };
}
