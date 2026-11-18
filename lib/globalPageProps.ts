// Props Next.js passes to every route under app/[lng]
export type GlobalPageProps = {
  params: Promise<{
    lng: string;
  }>;
};

// A route's props after awaiting params (Next.js passes params as a Promise)
export type ResolvedPageProps<T extends GlobalPageProps> = Omit<T, 'params'> & {
  params: Awaited<T['params']>;
};

export type ResolvedGlobalPageProps = ResolvedPageProps<GlobalPageProps>;
