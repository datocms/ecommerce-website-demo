export const formatPrice = (symbol: string, value: number) =>
  `${symbol}${value.toFixed(2)}`;

type PriceProps = {
  price: number;
  salePrice?: number | null;
  onSale: boolean;
  currencySymbol: string;
  /** sm: 17px (cards), md: 20px (spotlights), lg: 24px, 26px from sm (product page) */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  srSaleLabel?: string;
  srOriginalLabel?: string;
};

export default function Price({
  price,
  salePrice,
  onSale,
  currencySymbol,
  size = 'sm',
  className,
  srSaleLabel = 'Sale price',
  srOriginalLabel = 'Original price',
}: PriceProps) {
  const showSale = onSale && salePrice != null;
  return (
    <p
      className={[
        'flex flex-wrap items-baseline gap-x-2 tabular-nums',
        {
          sm: 'text-md',
          md: 'text-xl',
          lg: 'text-2xl sm:text-[1.625rem] sm:leading-8',
        }[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showSale ? (
        <>
          <span className="font-bold text-sale">
            <span className="sr-only">{srSaleLabel}: </span>
            {formatPrice(currencySymbol, salePrice)}
          </span>
          <s className="font-medium text-muted">
            <span className="sr-only">{srOriginalLabel}: </span>
            {formatPrice(currencySymbol, price)}
          </s>
        </>
      ) : (
        <span className="font-bold">{formatPrice(currencySymbol, price)}</span>
      )}
    </p>
  );
}
