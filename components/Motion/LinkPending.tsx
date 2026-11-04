'use client';

import { useLinkStatus } from 'next/link';

// Inside a <Link>: a hidden data-pending marker while that navigation loads, for CSS
// (has-data-pending:, pending-dim)
export default function LinkPending() {
  const { pending } = useLinkStatus();
  return pending ? <span data-pending hidden /> : null;
}
