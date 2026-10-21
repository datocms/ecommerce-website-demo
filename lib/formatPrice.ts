// A price as the store shows it: the General Interface currency symbol, then two decimals
export const formatPrice = (symbol: string, value: number) =>
  `${symbol}${value.toFixed(2)}`;
