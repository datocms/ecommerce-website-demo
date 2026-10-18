import { stripStega } from '@datocms/content-link';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import ProductCard from '@/components/Common/ProductCard';
import { ProductGeneralInterfaceFragment } from '@/components/Products/Product/GeneralInferface/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';

type PropTypes = {
  data: ProductQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

const FeaturedProducts = ({ data, globalPageProps }: PropTypes) => {
  const { sale, currencySymbol } =
    readFragment(ProductGeneralInterfaceFragment, data.generalInterface) ?? {};

  const relatedProducts = data.product?.relatedProducts ?? [];
  if (relatedProducts.length === 0) return null;

  // Below md a flex snap rail that bleeds off the right edge; each card sits in its own 4-row grid,
  // so a short name leaves no gap. From md the wrappers drop out and the cards share the grid's rows
  const fourUp = relatedProducts.length >= 4;

  return (
    <section className="pt-(--section-gap)">
      <div
        className={`rail no-scrollbar flex snap-x snap-mandatory gap-x-3 overflow-x-auto py-1 sm:gap-x-4 md:-mb-4 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:py-0 md:[--card-row-gap:1rem] ${fourUp ? 'xl:grid-cols-4' : ''}`}
      >
        {relatedProducts.map((product) => {
          return (
            <div
              key={product.id}
              className="grid w-[72vw] max-w-[18.75rem] shrink-0 snap-start grid-rows-[auto_auto_auto_1fr] sm:w-[18.75rem] md:contents"
            >
              <ProductCard
                href={`/${globalPageProps.params.lng}/product/${stripStega(product.slug)}`}
                name={product.name}
                brand={product.brand?.name}
                image={product.productImages[0]?.responsiveImage}
                hoverImage={product.productImages[1]?.responsiveImage}
                price={product.price}
                salePrice={product.salePrice}
                onSale={stripStega(product.sale || '') === 'on_sale'}
                currencySymbol={currencySymbol ?? ''}
                saleLabel={sale}
                sizes={`(min-width: 1440px) ${fourUp ? '340px' : '450px'}, (min-width: 1280px) ${fourUp ? '24vw' : '32vw'}, (min-width: 768px) 32vw, min(72vw, 300px)`}
                titleAs="p"
                data-datocms-content-link-group
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;
