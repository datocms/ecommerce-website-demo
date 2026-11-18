import { buildLocaleVariables } from '@/components/WithRealTimeUpdates/buildLocaleVariables';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import { buildPageMetadata } from '@/lib/datocms/pageMetadata';
import { storesPath } from '@/lib/routes';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables: buildLocaleVariables,
    // The stores page has no record of its own
    generate: (data) =>
      buildPageMetadata(data, { title: data.generalInterface?.stores ?? '' }),
    alternatePath: (locale) => storesPath(locale),
  },
);

const Page = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: buildLocaleVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Page;
