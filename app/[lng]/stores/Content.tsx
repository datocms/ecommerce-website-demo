import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { notFound } from 'next/navigation';
import type { PageProps, Query } from './meta';
import StoresContentClient from './StoresContentClient';

// Server-side entry: validate data, then delegate to the client implementation.
const Content: ContentPage<PageProps, Query> = ({ data, ...pageProps }) => {
  if (!data.allStores || data.allStores.length === 0) {
    notFound();
  }

  return <StoresContentClient data={data} {...pageProps} />;
};

export default Content;
