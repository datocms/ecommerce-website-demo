import { getFallbackLocale } from '@/app/i18n/settings';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { draftMode, headers } from 'next/headers';
import type {
  BuildVariablesFn,
  ContentPage,
  RealtimeUpdatesPage,
} from './types';

export function generateWrapper<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>(options: {
  query: TypedDocumentNode<TResult, TVariables>;
  buildVariables?: BuildVariablesFn<PageProps, TVariables>;
  contentComponent: ContentPage<PageProps, TResult>;
  realtimeComponent: RealtimeUpdatesPage<PageProps, TResult, TVariables>;
}) {
  return async function Page(unsanitizedPageProps: PageProps) {
    const fallbackLocale = await getFallbackLocale();
    const { isEnabled: isDraft } = draftMode();

    const { searchParams, ...pagePropsWithoutSearchParams } =
      unsanitizedPageProps as PageProps & {
        searchParams?:
          | URLSearchParams
          | Record<string, string | string[] | undefined>;
      };

    const requestHeaders = headers();
    const headerValue = requestHeaders.get('x-datocms-visual-editing');
    const headerEditToggle = headerValue == null ? null : headerValue === '1';

    const visualEditingEnabled = (() => {
      if (!searchParams) {
        return headerEditToggle ?? false;
      }

      if (typeof (searchParams as URLSearchParams).get === 'function') {
        const raw = (searchParams as URLSearchParams).get('edit');
        if (raw) {
          return ['1', 'true', 'on'].includes(raw);
        }
        return headerEditToggle ?? false;
      }

      if (typeof searchParams === 'object') {
        const rawEdit = (searchParams as Record<string, string | string[] | undefined>).edit;

        if (Array.isArray(rawEdit)) {
          if (rawEdit.some((value) => ['1', 'true', 'on'].includes(value))) {
            return true;
          }
          if (rawEdit.some((value) => ['0', 'false', 'off'].includes(value))) {
            return false;
          }
          return headerEditToggle ?? false;
        }

        if (typeof rawEdit === 'string') {
          if (['1', 'true', 'on'].includes(rawEdit)) {
            return true;
          }
          if (['0', 'false', 'off'].includes(rawEdit)) {
            return false;
          }
          return headerEditToggle ?? false;
        }
      }

      return headerEditToggle ?? false;
    })();

    const pageProps = pagePropsWithoutSearchParams as unknown as PageProps;

    const baseVariables =
      options.buildVariables?.({
        ...pageProps,
        fallbackLocale,
      }) || ({} as TVariables);

    const variables = visualEditingEnabled
      ? ({
          ...baseVariables,
          visualEditing: true,
        } as TVariables)
      : baseVariables;

    const data = await queryDatoCMS(options.query, variables, {
      isDraft,
      visualEditing: visualEditingEnabled,
    });

    const { realtimeComponent: RealTime, contentComponent: Content } = options;

    return isDraft ? (
      <RealTime
        token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
        query={options.query}
        variables={variables}
        initialData={data}
        pageProps={pageProps}
      />
    ) : (
      <Content {...pageProps} data={data} />
    );
  };
}
