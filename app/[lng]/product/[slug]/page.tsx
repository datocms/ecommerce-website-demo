import { getFallbackLocale } from '@/app/i18n/settings';
import Product from '@/components/Products/Product';
import RealTimeProducts from '@/components/Products/RealTimeProducts';
import {
  LegalDocument,
  ProductDocument,
  SiteLocale,
} from '@/graphql/types/graphql';
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
      {isEnabled && (
        <RealTimeProducts
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={ProductDocument}
          variables={{ slug, locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
};

export default ProductsPage;
