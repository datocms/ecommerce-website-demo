/**
 * Per-locale layout wrapper
 * - Reuses the same server/client composition as pages: server-side data fetch
 *   plus client realtime when draft mode is active.
 */
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.lng,
  fallbackLocale: [fallbackLocale],
});

const layout = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default layout;
