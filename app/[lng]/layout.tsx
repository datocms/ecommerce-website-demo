import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import type { SiteLocale } from '@/graphql/types/graphql';
import Content from './Content';
import RealTime from './RealTime';
import { type PageProps, type Query, type Variables, query } from './meta';

const buildVariables: BuildVariablesFn<PageProps, Variables> = ({
  params,
  fallbackLocale,
}) => ({
  locale: params.lng as SiteLocale,
  fallbackLocale: [fallbackLocale],
});

const layout = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default layout;
