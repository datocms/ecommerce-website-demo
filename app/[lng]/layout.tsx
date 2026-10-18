import type { SiteLocale } from '@/app/i18n/settings';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

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
