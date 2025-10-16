'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';
import { ShowcaseContentView } from './Content';

// Client renderer used by the SSE subscription; mirrors the server output.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <ShowcaseContentView {...props} />;
};

export default LiveContent;
