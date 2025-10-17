/**
 * Per-locale realtime client shell
 * - Creates a route-scoped client component that renders the shared view and
 *   subscribes to Listen updates via the generic realtime wrapper.
 */
'use client';

import { generateRealtimeComponent } from '@/components/WithRealTimeUpdates/generateRealtime';
import LiveContent from './LiveContent';
import type { PageProps, Query, Variables } from './meta';

// Assemble the client-only wrapper that receives live payloads.
const RealTime = generateRealtimeComponent<PageProps, Query, Variables>({
  clientContentComponent: LiveContent,
});

export default RealTime;
