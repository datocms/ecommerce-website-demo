'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';
import { HomeContentView } from './Content';

// Client-side wrapper used by the realtime subscription; simply reuses the
// server view so markup (and stega fields) stay identical across renders.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <HomeContentView {...props} />;
};

export default LiveContent;
