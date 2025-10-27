'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import { LegalContentView } from './Content';
import type { PageProps, Query } from './meta';

// Client wrapper for realtime data; renders the same markup as the server.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <LegalContentView {...props} />;
};

export default LiveContent;
