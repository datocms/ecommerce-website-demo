import { graphql } from '@/lib/datocms/graphql';

export const ProductGeneralInterfaceFragment = graphql(/* GraphQL */ `
  fragment ProductGeneralInterfaceFragment on GeneralInterfaceRecord {
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
