import { getFallbackLocale } from '@/app/i18n/settings';
import RealTimeStoreShowcase from '@/components/Showcases/RealTimeStoreShowcase';
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

  return (
    <>
      {!isEnabled && <StoreShowcase data={data} />}
      {isEnabled && (
        <RealTimeStoreShowcase
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={StoresDocument}
          variables={{ locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
};

export default Stores;
