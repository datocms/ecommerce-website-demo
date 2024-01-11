import { getFallbackLocale } from '@/app/i18n/settings';
import StoreShowcase from '@/components/Showcases/StoreShowcase';
import { SiteLocale, StoreRecord, StoresDocument } from '@/graphql/generated';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    lng: SiteLocale;
    slug: string;
  };
};

const Stores = async ({ params: { lng, slug } }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    StoresDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  if (!data.allStores.length) notFound();

  return <StoreShowcase translationString={data.generalInterface?.findOnMaps} allStores={data.allStores as StoreRecord[]} />;
};

export default Stores;
