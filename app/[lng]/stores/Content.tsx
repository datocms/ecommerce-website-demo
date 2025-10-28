/**
 * Stores page: server entry that validates data and delegates to
 * a client-only view for interactivity while preserving server markup shape.
 */
import { notFound } from 'next/navigation';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';
import StoresContentClient from './StoresContentClient';

// Server-side entry: validate data, then delegate to the client implementation.
/** Server entry that checks for at least one store and renders the client view. */
const Content: ContentPage<PageProps, Query> = ({ data, ...pageProps }) => {
  if (!data.allStores || data.allStores.length === 0) {
    notFound();
  }

  return <StoresContentClient data={data} {...pageProps} />;
};

export default Content;
