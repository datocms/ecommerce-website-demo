'use client';

import type { ClientContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';
import { ProductContentView } from './Content';

// Client renderer that reuses the server view so stega attributes survive.
const LiveContent: ClientContentPage<PageProps, Query> = (props) => {
  return <ProductContentView {...props} />;
};

export default LiveContent;
