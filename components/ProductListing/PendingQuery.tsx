'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react';

// Pending query: quick successive clicks build on each other instead of on the
// URL of the navigation that hasn't landed yet
function usePendingQueryState(onPush?: (query: string) => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.toString());
  useEffect(() => {
    setQuery(searchParams.toString());
  }, [searchParams]);

  // In a transition, so isPending lasts until the new listing commits. The drawer passes
  // the "filter" type: its grid updates behind the scrim, without the swap
  function pushQueryParam(
    key: string,
    value: string,
    transitionTypes?: string[],
  ) {
    const params = new URLSearchParams(query);
    params.set(key, value);
    params.delete('page');
    const next = params.toString();
    setQuery(next);
    onPush?.(next);
    startTransition(() => {
      router.push(`?${next}`, { scroll: false, transitionTypes });
    });
  }

  return {
    pendingParams: new URLSearchParams(query),
    pushQueryParam,
    isPending,
  };
}

const PendingQueryContext = createContext<ReturnType<
  typeof usePendingQueryState
> | null>(null);

/** Lets the toolbar sort tabs and the drawer build on the same pending query */
export function PendingQueryProvider({
  children,
  onPush,
}: {
  children: ReactNode;
  /** Called with each query a sort or filter change navigates to */
  onPush?: (query: string) => void;
}) {
  const pendingQuery = usePendingQueryState(onPush);
  return (
    <PendingQueryContext.Provider value={pendingQuery}>
      {children}
      {/* Dims the results (pending-dim) while the listing is on its way */}
      {pendingQuery.isPending && <span data-pending hidden />}
    </PendingQueryContext.Provider>
  );
}

export function usePendingQuery() {
  const pendingQuery = useContext(PendingQueryContext);
  if (!pendingQuery)
    throw new Error('Sort and filter controls need a PendingQueryProvider');
  return pendingQuery;
}
