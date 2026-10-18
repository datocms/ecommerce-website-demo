import { stripStega } from '@datocms/content-link';
import ProductCard from '@/components/Common/ProductCard';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ProductRailFragment } from './fragments';

type Props = {
  /** Scroller id, for RailControls */
  id: string;
  products: FragmentOf<typeof ProductRailFragment>[];
  lng: string;
  currencySymbol: string;
  saleLabel?: string | null;
  className?: string;
};

// Full-width snap rail of product cards: starts on the content edge, bleeds off the viewport.
// Each item is a 4-row grid for the card's subgrid (photo / brand / name / price); the last row
// takes the slack, so the price follows the name. Snapping pauses while keyboard focus is inside,
// so tabbing moves the rail only as far as RailControls scrolls to reveal a hidden card.
export default function ProductRail({
  id,
  products,
  lng,
  currencySymbol,
  saleLabel,
  className,
}: Props) {
  return (
    <ul
      id={id}
      className={[
        'rail no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto py-1 has-focus-visible:snap-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {products.map((fragment) => {
        const product = readFragment(ProductRailFragment, fragment);
        return (
          <li
            key={product.id}
            className="grid w-[72vw] max-w-[18.75rem] shrink-0 snap-start grid-rows-[auto_auto_auto_1fr] sm:w-[18.75rem]"
          >
            <ProductCard
              href={`/${lng}/product/${stripStega(product.slug)}`}
              name={product.name}
              brand={product.brand?.name}
              image={product.productImages[0]?.responsiveImage}
              hoverImage={product.productImages[1]?.responsiveImage}
              price={product.price}
              salePrice={product.salePrice}
              onSale={stripStega(product.sale) === 'on_sale'}
              currencySymbol={currencySymbol}
              saleLabel={saleLabel}
              sizes="(min-width: 640px) 300px, 72vw"
              data-datocms-content-link-group
            />
          </li>
        );
      })}
    </ul>
  );
}
