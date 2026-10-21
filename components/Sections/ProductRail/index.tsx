import { stripStega } from '@datocms/content-link';
import ProductCard from '@/components/Common/ProductCard';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ProductRailFragment } from './fragments';

type Props = {
  /** Scroller id, for RailControls and RailProgress */
  id: string;
  products: FragmentOf<typeof ProductRailFragment>[];
  lng: string;
  currencySymbol: string;
  saleLabel?: string | null;
  className?: string;
};

// Full-width snap rail of product cards: starts on the content edge, bleeds off the viewport.
// From lg four cards and a quarter show, so there is always a next one in sight. Each item is a
// 4-row grid for the card's subgrid (photo / name / brand / price). The items stretch to the
// tallest card and the brand row takes the slack, so the brand stays under the name and every
// price sits on one line. py-2 (taken back by -my-2) leaves room for the cards' focus rings, 4px
// out. Snapping pauses while keyboard focus is inside, so tabbing moves the rail only as far as
// RailControls scrolls to reveal a hidden card.
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
        'rail reveal-stagger no-scrollbar flex snap-x snap-mandatory -my-2 gap-4 overflow-x-auto py-2 has-focus-visible:snap-none',
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
            className="grid w-[72%] shrink-0 snap-start grid-rows-[auto_auto_1fr_auto] sm:w-[40%] lg:w-[calc((min(100vw,90rem)-8rem)/4.25)]"
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
              sizes="(min-width: 1440px) 310px, (min-width: 1024px) 22vw, (min-width: 640px) 40vw, 72vw"
              data-datocms-content-link-group
            />
          </li>
        );
      })}
    </ul>
  );
}
