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
    // The stores page has no record of its own, so it uses the first store's SEO tags
    generate: (data) => data.allStores[0]?.seo,
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: buildLocaleVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
