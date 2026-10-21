// Props Next.js passes to every route under app/[lng]; Resolved* is the same after awaiting params.
export type GlobalPageProps = {
  params: Promise<{
    lng: string;
  }>;
};

export type ResolvedGlobalPageProps = {
  params: {
    lng: string;
  };
};
