import { toNextMetadata } from 'react-datocms/seo';
import { generateMetadataFn } from '@/components/WithRealTimeUpdates/generateMetadataFn';
import { generateWrapper } from '@/components/WithRealTimeUpdates/generateWrapper';
import type { BuildVariablesFn } from '@/components/WithRealTimeUpdates/types';
import type { SiteLocale } from '@/lib/i18n';
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

// Site-wide defaults: the favicons, and the title and description from the DatoCMS global SEO
// settings for routes without SEO tags of their own, such as the catalog. Next.js merges each
// page's generateMetadata over these key by key, so a page's own tags win, and it adds the
// viewport tag itself.
export const generateMetadata = generateMetadataFn<PageProps, Query, Variables>(
  {
    query,
    buildVariables,
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
  buildVariables,
  contentComponent: Content,
  realtimeComponent: RealTime,
});

export default Layout;
