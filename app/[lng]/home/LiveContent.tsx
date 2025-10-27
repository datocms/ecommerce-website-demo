/**
 * Client renderer used by the realtime layer.
 * - Renders the exact same view the server used so React patches in place.
 * - This preserves stega markers and keeps overlays stable across updates.
 */
'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import { HomeContentView } from './Content';
import type { PageProps, Query } from './meta';

// Client-side wrapper used by the realtime subscription; simply reuses the
// server view so markup (and stega fields) stay identical across renders.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <HomeContentView {...props} />;
};

export default LiveContent;
