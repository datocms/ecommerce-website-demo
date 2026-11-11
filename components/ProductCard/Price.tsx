import { cx } from '@/lib/classNames';
import { formatPrice } from '@/lib/formatPrice';

// Spoken before each price: screen readers do not announce the strikethrough
const SR_SALE = 'Sale price';
const SR_ORIGINAL = 'Original price';

const SIZE_CLASSES = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' };

type Props = {
  price: number;
  salePrice?: number | null;
  onSale: boolean;
  currencySymbol: string;
  /** sm: cards, md: ProductCard size=lg, lg: product page */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function Price({
  price,
  salePrice,
  onSale,
  currencySymbol,
  size = 'sm',
  className,
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
          <span className="text-sale">
            <span className="sr-only">{SR_SALE}: </span>
            {formatPrice(currencySymbol, salePrice)}
          </span>
          <s
            className={`font-normal text-mute ${size === 'lg' ? 'text-[0.75em]' : 'text-[0.9375em]'}`}
          >
            <span className="sr-only">{SR_ORIGINAL}: </span>
            {formatPrice(currencySymbol, price)}
          </s>
        </>
      ) : (
        <span>{formatPrice(currencySymbol, price)}</span>
      )}
    </p>
  );
}
