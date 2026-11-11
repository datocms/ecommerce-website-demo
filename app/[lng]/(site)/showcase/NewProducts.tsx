import { ArrowRightIcon } from '@heroicons/react/24/outline';
import OptionalLink from '@/components/Common/OptionalLink';
import ProductCard from '@/components/ProductCard';
import { productPath } from '@/lib/routes';
import CtaLabel, { type Cta } from './CtaLabel';
import type { Showcase } from './meta';

type Props = {
  lng: string;
  title: Showcase['newProductsTitle'];
  products: Showcase['newProducts'];
  cta?: Cta;
  currencySymbol: string;
  saleLabel: string | null | undefined;
  salePriceLabel: string | undefined;
  originalPriceLabel: string | undefined;
};

export default function NewProducts({
  lng,
  title,
  products,
  cta,
  currencySymbol,
  saleLabel,
  salePriceLabel,
  originalPriceLabel,
}: Props) {
  // An odd product count leaves a gap in the two-column grid; the CTA fills it as a tile
  const endCta = cta && products.length % 2 === 1 ? cta : undefined;

  return (
    <section
      aria-labelledby="new-arrivals-title"
      className="shell pt-(--section-gap)"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-4">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <h2 id="new-arrivals-title" className="title-section lg:pr-6">
              {title}
            </h2>
            {cta && !endCta && (
              <OptionalLink
                href={cta.href}
                className="btn mt-8 hidden max-w-full lg:inline-flex"
              >
                <CtaLabel label={cta.label} />
              </OptionalLink>
            )}
          </div>
        </div>
        {/* Several rows, so each card reveals on its own (reveal-stagger is for one row) */}
        <div className="-mb-(--card-row-gap) grid grid-cols-2 gap-x-3 [--card-row-gap:2.5rem] md:gap-x-4 lg:col-span-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              className="reveal"
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
              salePriceLabel={salePriceLabel}
              originalPriceLabel={originalPriceLabel}
              sizes="(min-width: 1440px) 443px, (min-width: 1024px) 31vw, 46vw"
              size="lg"
              titleAs="h3"
            />
          ))}
          {/* Only the square is the link, so its focus ring wraps what shows */}
          {endCta && (
            <div className="reveal row-span-4 mb-(--card-row-gap)">
              <OptionalLink
                href={endCta.href}
                className="group flex aspect-[4/5] items-center justify-center bg-mist p-6 text-center outline-offset-4"
              >
                <span className="tlink">
                  {endCta.label}
                  <ArrowRightIcon aria-hidden="true" className="stroke-2" />
                </span>
              </OptionalLink>
            </div>
          )}
        </div>
        {cta && !endCta && (
          <OptionalLink
            href={cta.href}
            className="btn-line w-full max-sm:[--btn-px:1rem] sm:w-auto sm:justify-self-start lg:hidden"
          >
            <CtaLabel label={cta.label} />
          </OptionalLink>
        )}
      </div>
    </section>
  );
}
