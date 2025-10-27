/**
 * Client renderer for product pages used by realtime updates.
 * - Reuses the server view to avoid DOM replacement.
 */
'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import { ProductContentView } from './Content';
import type { PageProps, Query } from './meta';

// Client renderer that reuses the server view so stega attributes survive.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <ProductContentView {...props} />;
};

export default LiveContent;
