import { toNextMetadata } from 'react-datocms/seo';
import { buildLocaleVariables } from '@/components/WithRealTimeUpdates/buildLocaleVariables';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import Content from './Content';
import { type PageProps, type Query, query, type Variables } from './meta';
import RealTime from './RealTime';

// Site-wide defaults (favicons, and the fallback title and description from the DatoCMS global SEO
// settings); each page's generateMetadata overrides them key by key
export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables: buildLocaleVariables,
    generate: (data) => ({
      ...toNextMetadata(data._site.faviconMetaTags),
      title: data._site.globalSeo?.fallbackSeo?.title,
      description:
        data._site.globalSeo?.fallbackSeo?.description ||
        'Visit https://www.datocms.com/marketplace/starters for more starters',
    }),
  },
);

const Layout = generateWrapper<PageProps, Query, Variables>({
  query,
  buildVariables: buildLocaleVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Layout;
