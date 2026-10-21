'use client';

import { useLinkStatus } from 'next/link';

// Inside a <Link>: flags the document while that navigation is on its way, so listing results
// dim (pending-dim) and a nav link keeps its bar (has-data-pending:). Prefetched destinations
// skip the pending phase, so nothing flickers.
export default function LinkPending() {
  const { pending } = useLinkStatus();
  return pending ? <span data-pending hidden /> : null;
}
