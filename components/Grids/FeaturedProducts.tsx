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

  // Below md a snap rail that runs edge to edge; each card sits in its own 4-row grid, so a short
  // name leaves no gap. The rail's 8px of block padding (taken back with -my-2) leaves room for the
  // cards' focus ring, which the scroller would otherwise clip. From md the wrappers drop out and
  // the cards share the grid's rows (names, brands and prices line up), aligned to the shell's
  // content edges. It rises as one block (reveal): a scroller's cards must not move inside it,
  // and display:contents wrappers cannot move at all
  const fourUp = relatedProducts.length >= 4;

  return (
    <section className="pt-(--section-gap)">
      <div
        className={`rail no-scrollbar reveal -my-2 flex snap-x snap-mandatory gap-x-3 overflow-x-auto py-2 md:-mb-(--card-row-gap) md:mt-0 md:grid md:snap-none md:grid-cols-3 md:gap-x-4 md:overflow-visible md:py-0 md:[--card-row-gap:2rem] lg:[--card-row-gap:2.5rem] ${fourUp ? 'xl:grid-cols-4' : ''}`}
      >
        {relatedProducts.map((product) => {
          return (
            <div
              key={product.id}
              className="grid w-[72vw] shrink-0 snap-start grid-rows-[auto_auto_1fr_auto] sm:w-[40vw] md:contents"
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
                sizes={`(min-width: 1440px) ${fourUp ? '330px' : '445px'}, (min-width: 1280px) ${fourUp ? '24vw' : '32vw'}, (min-width: 768px) 32vw, (min-width: 640px) 40vw, 72vw`}
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
