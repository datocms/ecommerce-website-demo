'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';
import { LayoutContentView } from './Content';

// Mirrors the server layout component so realtime updates can reuse the same
// structure without duplicating markup.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <LayoutContentView {...props} />;
};

export default LiveContent;
