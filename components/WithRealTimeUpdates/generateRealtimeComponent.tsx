import type { GlobalPageProps } from '@/lib/globalPageProps';
import WithRealTimeUpdates from './index';
import type { ContentPage, RealtimeUpdatesPage } from './types';

export function generateRealtimeComponent<
  PageProps extends GlobalPageProps,
  TResult = unknown,
  TVariables = Record<string, unknown>,
>({
  contentComponent: Content,
}: {
  contentComponent: ContentPage<PageProps, TResult>;
}) {
  const RealTime: RealtimeUpdatesPage<PageProps, TResult, TVariables> = (
    props,
  ) => {
    return (
      <WithRealTimeUpdates {...props}>
        {(contentProps) => <Content {...contentProps} />}
      </WithRealTimeUpdates>
    );
  };

  return RealTime;
}
