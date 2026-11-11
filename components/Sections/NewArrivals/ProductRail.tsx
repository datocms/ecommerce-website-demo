import ProductCard from '@/components/ProductCard';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { productPath } from '@/lib/productPath';
import { ProductRailFragment } from './fragments';

type Props = {
  /** Scroller id, for RailControls and RailProgress */
  id: string;
  products: FragmentOf<typeof ProductRailFragment>[];
  lng: string;
  currencySymbol: string;
  saleLabel?: string | null;
};

// 4¼ cards from lg, so the next one is always in view. Each <li> is the 4-row grid ProductCard's
// subgrid needs; py-2/-my-2 leave room for the cards' focus rings.
export default function ProductRail({
  id,
  products,
  lng,
  currencySymbol,
  saleLabel,
}: Props) {
  return (
    <ul
      id={id}
      className="rail reveal-stagger no-scrollbar flex snap-x snap-mandatory -my-2 gap-4 overflow-x-auto py-2 has-focus-visible:snap-none"
    >
      {products.map((fragment) => {
        const product = readFragment(ProductRailFragment, fragment);
        return (
          <li
            key={product.id}
            className="grid w-[72%] shrink-0 snap-start grid-rows-[auto_auto_1fr_auto] sm:w-[40%] lg:w-[calc((min(100vw,90rem)-8rem)/4.25)]"
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
              currencySymbol={currencySymbol}
              saleLabel={saleLabel}
              sizes="(min-width: 1440px) 310px, (min-width: 1024px) 22vw, (min-width: 640px) 40vw, 72vw"
            />
          </li>
        );
      })}
    </ul>
  );
}
