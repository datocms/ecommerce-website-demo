import type { SiteLocale } from '@/graphql/types/graphql';

export type GlobalPageProps = {
  params: {
    lng: SiteLocale;
  };
};

export function buildUrl(globalPageProps: GlobalPageProps, path?: string) {
  return `/${globalPageProps.params.lng}${path || ''}`;
}
