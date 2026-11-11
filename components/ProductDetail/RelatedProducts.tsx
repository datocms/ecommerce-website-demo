import type { Product } from '@/app/[lng]/product/[slug]/meta';
import ProductCard from '@/components/ProductCard';
import { readFragment } from '@/lib/datocms/graphql';
import { productPath } from '@/lib/productPath';
import { type ProductPageLabels, ProductPageLabelsFragment } from './fragments';

type Props = {
  products: Product['relatedProducts'];
  labels: ProductPageLabels;
  lng: string;
};

export default function RelatedProducts({ products, labels, lng }: Props) {
  const { sale, currencySymbol } =
    readFragment(ProductPageLabelsFragment, labels) ?? {};

  if (products.length === 0) return null;

  const fourUp = products.length >= 4;

  // Below md a snap rail (py-2 and -my-2 keep the cards' focus rings unclipped); from md the
  // wrappers are display:contents, so the cards share the grid's rows. It reveals as one block:
  // cards must not move inside a scroller
  return (
    <section className="pt-(--section-gap)">
      <div
        className={`rail no-scrollbar reveal -my-2 flex snap-x snap-mandatory gap-x-3 overflow-x-auto py-2 md:-mb-(--card-row-gap) md:mt-0 md:grid md:snap-none md:grid-cols-3 md:gap-x-4 md:overflow-visible md:py-0 md:[--card-row-gap:2rem] lg:[--card-row-gap:2.5rem] ${fourUp ? 'xl:grid-cols-4' : ''}`}
      >
        {products.map((product) => {
          return (
            <div
              key={product.id}
              className="grid w-[72vw] shrink-0 snap-start grid-rows-[auto_auto_1fr_auto] sm:w-[40vw] md:contents"
            >
              <ProductCard
                href={productPath(lng, product.slug)}
                name={product.name}
                brand={product.brand.name}
                image={product.productImages[0]?.responsiveImage}
                hoverImage={product.productImages[1]?.responsiveImage}
                price={product.price}
                salePrice={product.salePrice}
                onSale={product.onSale}
                currencySymbol={currencySymbol ?? ''}
                saleLabel={sale}
                sizes={`(min-width: 1440px) ${fourUp ? '330px' : '445px'}, (min-width: 1280px) ${fourUp ? '24vw' : '32vw'}, (min-width: 768px) 32vw, (min-width: 640px) 40vw, 72vw`}
                titleAs="p"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
