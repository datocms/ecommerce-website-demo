import type { SiteLocale } from '@/graphql/types/graphql';

// Type for incoming page props (params as Promise - Next.js 16)
export type GlobalPageProps = {
  params: Promise<{
    lng: string;
  }>;
};

// Type for resolved page props (after awaiting params)
export type ResolvedGlobalPageProps = {
  params: {
    lng: string;
  };
};

// Helper to cast string lng to SiteLocale for GraphQL operations
export function asSiteLocale(lng: string): SiteLocale {
  return lng as SiteLocale;
}

export function buildUrl(globalPageProps: ResolvedGlobalPageProps, path?: string) {
  return `/${globalPageProps.params.lng}${path || ''}`;
}
