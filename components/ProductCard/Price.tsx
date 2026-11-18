import { cx } from '@/lib/classNames';
import { formatPrice } from '@/lib/formatPrice';

const SIZE_CLASSES = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };

type Props = {
  price: number;
  salePrice?: number | null;
  onSale: boolean;
  currencySymbol: string;
  /** Spoken before each price: screen readers do not announce the strikethrough */
  salePriceLabel?: string;
  originalPriceLabel?: string;
  /** sm: cards, md: ProductCard size=lg, lg: product page */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** Content Link targets for each price (see fieldEditUrl), only set in draft mode */
  editUrls?: { price?: string; salePrice?: string };
};

export default function Price({
  price,
  salePrice,
  onSale,
  currencySymbol,
  salePriceLabel,
  originalPriceLabel,
  size = 'sm',
  className,
  editUrls,
}: Props) {
  const showSale = onSale && salePrice != null;
  return (
    <p
      className={cx(
        'flex flex-wrap items-baseline gap-x-2 font-semibold tabular-nums',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {showSale ? (
        <>
          <span
            data-datocms-content-link-url={editUrls?.salePrice}
            className="text-sale"
          >
            <span className="sr-only">{salePriceLabel}: </span>
            {formatPrice(currencySymbol, salePrice)}
          </span>
          <s
            data-datocms-content-link-url={editUrls?.price}
            className={`font-normal text-mute ${size === 'lg' ? 'text-[0.75em]' : 'text-[0.9375em]'}`}
          >
            <span className="sr-only">{originalPriceLabel}: </span>
            {formatPrice(currencySymbol, price)}
          </s>
        </>
      ) : (
        <span data-datocms-content-link-url={editUrls?.price}>
          {formatPrice(currencySymbol, price)}
        </span>
      )}
    </p>
  );
}
