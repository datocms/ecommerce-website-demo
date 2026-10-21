import { stripStega } from '@datocms/content-link';
import { notFound } from 'next/navigation';
import BuyBox from '@/components/ProductDetail/BuyBox';
import { ProductPageLabelsFragment } from '@/components/ProductDetail/fragments';
import ProductDescription from '@/components/ProductDetail/ProductDescription';
import ProductGallery from '@/components/ProductDetail/ProductGallery';
import RelatedProducts from '@/components/ProductDetail/RelatedProducts';
import Reviews from '@/components/ProductDetail/Reviews';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  const { product } = data;
  if (!product) {
    notFound();
  }

  const isOnSale = stripStega(product.sale) === 'on_sale';
  const { sale } =
    readFragment(ProductPageLabelsFragment, data.generalInterface) ?? {};

  return (
    <>
      <div className="shell grid lg:grid-cols-12 lg:gap-4 lg:pt-8">
        <ProductGallery
          images={product.productImages}
          productName={product.name}
          saleTag={isOnSale ? sale : undefined}
        />
        <BuyBox
          product={product}
          labels={data.generalInterface}
          lng={globalPageProps.params.lng}
          isOnSale={isOnSale}
        />
      </div>
      <ProductDescription
        product={product}
        labels={data.generalInterface}
        globalPageProps={globalPageProps}
      />
      <RelatedProducts data={data} globalPageProps={globalPageProps} />
      <Reviews data={data} globalPageProps={globalPageProps} />
    </>
  );
};

export default Content;
