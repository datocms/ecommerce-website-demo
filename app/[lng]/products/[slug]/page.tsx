import { getFallbackLocale } from '@/app/i18n/settings';
import Product from '@/components/Products/Product';
import {
  LegalDocument,
  ProductDocument,
  SiteLocale,
} from '@/graphql/generated';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';

type Params = {
  params: {
    slug: string;
    lng: SiteLocale;
  };
};

const ProductsPage = async ({ params: { slug, lng } }: Params) => {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    ProductDocument,
    {
      slug,
      locale: lng,
      fallbackLocale: [fallbackLng],
    },
    isEnabled
  );

  return (
    <>
      {!isEnabled && <Product data={data} lng={lng} />}
      {/* {isEnabled && (
        <RealTimeLegal
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={LegalDocument}
          variables={{ slug, locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )} */}
    </>
  );
};

export default ProductsPage;
