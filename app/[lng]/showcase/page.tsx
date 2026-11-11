import { buildLocaleVariables } from '@/components/WithRealTimeUpdates/buildLocaleVariables';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables: buildLocaleVariables,
    generate: (data) => data.showcase?.seo,
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: buildLocaleVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
