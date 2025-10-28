/**
 * @fileoverview Grid of related/featured products with price display and
 * localized links. Adds edit attributes for price fields.
 */
import Link from 'next/link';
import { getFragmentData } from '@/graphql/types';
import {
  ProductGeneralInterfaceFragmentDoc,
  type ProductQuery,
} from '@/graphql/types/graphql';
import { getProductPriceEditAttributes } from '@/utils/datocmsVisualEditing';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import DatoImage from '../DatoImage';

type PropTypes = {
  /** Product query used to read related products. */
  data: ProductQuery;
  /** Locale-aware page props for link building. */
  globalPageProps: GlobalPageProps;
};

/** Render a responsive grid of featured products. */
const FeaturedProducts = ({ data, globalPageProps }: PropTypes) => {
  const general = getFragmentData(
    ProductGeneralInterfaceFragmentDoc,
    data.generalInterface ?? null,
  );
  const sale = general?.sale;
  const currencySymbol = general?.currencySymbol;
  const locale = globalPageProps.params.lng;

  return (
    <div className="bg-white px-16 py-6 sm:py-8 lg:mx-56 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-3">
          {data.product?.relatedProducts.map((product) => {
            const isOnSale = product?.sale === 'on_sale';
            const editingUrl = (product as { _editingUrl?: string | null })
              ._editingUrl;
            const priceEditAttributes = getProductPriceEditAttributes(
              editingUrl,
              locale,
            );
            const salePriceEditAttributes = getProductPriceEditAttributes(
              editingUrl,
              locale,
              { fieldPath: 'sale_price' },
            );
            const firstProductImage = product.productImages[0];

            if (!firstProductImage?.responsiveImage) {
              return null;
            }
            return (
              <div key={product.id}>
                <Link
                  href={`/${globalPageProps.params.lng}/product/${product.slug}`}
                  className="group relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
                >
                  <div className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-105">
                    <DatoImage
                      fragment={firstProductImage.responsiveImage}
                      altOverride={firstProductImage.alt ?? null}
                      className="h-full w-full object-contain"
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 50%"
                    />
                  </div>

                  {isOnSale && (
                    <div className="absolute bottom-2 left-0 flex gap-2">
                      <span className="rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                        {sale}
                      </span>
                    </div>
                  )}
                </Link>

                <div className="flex items-start justify-between gap-2 px-2">
                  <div className="flex flex-col">
                    <Link
                      href={`/${globalPageProps.params.lng}/product/${product.slug}`}
                      className="text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl"
                    >
                      {product.name}
                    </Link>
                    <span className="text-gray-500">{product.brand?.name}</span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className="font-bold text-gray-600 lg:text-lg"
                      {...(isOnSale
                        ? salePriceEditAttributes
                        : priceEditAttributes)}
                      data-datocms-edit-target
                    >
                      {currencySymbol}
                      {isOnSale ? product.salePrice : product.price}
                    </span>
                    {isOnSale && (
                      <span
                        className="text-sm text-red-500 line-through"
                        {...priceEditAttributes}
                        data-datocms-edit-target
                      >
                        {currencySymbol}
                        {product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
