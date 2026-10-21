import { graphql } from '@/lib/datocms/graphql';

// UI labels for the product page, from the General Interface singleton
export const ProductPageLabelsFragment = graphql(/* GraphQL */ `
  fragment ProductPageLabelsFragment on GeneralInterfaceRecord {
    currencySymbol
    weather
    style
    size
    shippingText
    secondaryButton
    sale
    reviews
    reviewButton
    primaryButton
    priceUndertext
    occasions
    more
    materials
    color
  }
`);
