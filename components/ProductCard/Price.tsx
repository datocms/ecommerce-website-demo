import { formatPrice } from '@/lib/formatPrice';

// Spoken before each price: screen readers do not announce the strikethrough
const SR_SALE = 'Sale price';
const SR_ORIGINAL = 'Original price';

type Props = {
  price: number;
  salePrice?: number | null;
  onSale: boolean;
  currencySymbol: string;
  /** sm: 16px (cards), md: 18px (ProductCard size=lg), lg: 24px (product page) */
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
      className={[
        'flex flex-wrap items-baseline gap-x-2 font-semibold tabular-nums',
        { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showSale ? (
        <>
          <span className="text-sale">
            <span className="sr-only">{SR_SALE}: </span>
            {formatPrice(currencySymbol, salePrice)}
          </span>
          {/* Regular weight and smaller: 15px beside a 16px card price, 18px beside the
              product page's 24px */}
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
