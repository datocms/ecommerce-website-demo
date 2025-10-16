'use client';

import { generateRealtimeComponent } from '@/components/WithRealTimeUpdates/generateRealtime';
import LiveContent from './LiveContent';
import type { PageProps, Query, Variables } from './meta';

// Client-only realtime layer for the Stores route.
const RealTime = generateRealtimeComponent<PageProps, Query, Variables>({
  clientContentComponent: LiveContent,
});

export default RealTime;
