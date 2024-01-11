import { getFallbackLocale } from '@/app/i18n/settings';
import RealTimeShowcase from '@/components/Showcases/RealTimeShowcase';
import ShowcasePage from '@/components/Showcases/ShowcasePage';
import { ShowcaseDocument, SiteLocale } from '@/graphql/generated';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

type Params = {
  params: {
    lng: SiteLocale;
    slug: string;
  };
};

const Showcase = async ({ params: { lng, slug } }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    ShowcaseDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  if (!data.showcase) notFound();

  return (
    <>
      {!isEnabled && <ShowcasePage lng={lng} data={data} />}
      {isEnabled && (
        <RealTimeShowcase
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={ShowcaseDocument}
          variables={{ locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
};

export default Showcase;
