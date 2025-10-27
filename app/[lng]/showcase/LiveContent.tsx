/**
 * Client renderer for the showcase page used by realtime updates.
 */
'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import { ShowcaseContentView } from './Content';
import type { PageProps, Query } from './meta';

// Client renderer used by the SSE subscription; mirrors the server output.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <ShowcaseContentView {...props} />;
};

export default LiveContent;
