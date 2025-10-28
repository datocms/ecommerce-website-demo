'use client';

/**
 * @fileoverview Product detail page view. Handles image gallery selection,
 * color/size selection UI, and renders edit attributes for key fields.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { getFragmentData } from '@/graphql/types';
import {
  ProductGeneralInterfaceFragmentDoc,
  type ProductQuery,
} from '@/graphql/types/graphql';
import {
  getProductFieldEditAttributes,
  getProductPriceEditAttributes,
} from '@/utils/datocmsVisualEditing';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { imageFillCoverProps } from '@/utils/imageProps';
import { isOnSaleFlag } from '@/utils/productFields';
import DatoImage from '../DatoImage';

type Props = {
  /** Full product query payload for the detail page. */
  data: ProductQuery;
  /** Locale-aware page props for links and formatting. */
  globalPageProps: GlobalPageProps;
};

const allSizes = ['xs', 's', 'm', 'l', 'xl'];

/** Presentational detail view for a single product. */
const ProductView = ({ data, globalPageProps }: Props) => {
  if (!data.product) notFound();

  const [selectedColor, setSelectedColor] = useState(
    data.product.productVariations[0].color.hex,
  );

  const [selectedSize, setSelectedSize] = useState(
    (data.product.productVariations[0].availableSizes as Array<string>)[0], //narrow down of json field with checkbox field editor
  );

  const [selectedImage, setSelectedImage] = useState(
    data.product.productImages[0],
  );

  const isOnSale = isOnSaleFlag(data.product?.sale);
  const locale = globalPageProps.params.lng;
  const productEditingUrl = (data.product as { _editingUrl?: string | null })
    ._editingUrl;
  const priceEditAttributes = getProductPriceEditAttributes(
    productEditingUrl,
    locale,
  );
  const salePriceEditAttributes = getProductPriceEditAttributes(
    productEditingUrl,
    locale,
    {
      fieldPath: 'sale_price',
    },
  );
  const reviewAverageEditAttributes = getProductFieldEditAttributes(
    productEditingUrl,
    locale,
    'review_average',
  );
  const numberOfReviewsEditAttributes = getProductFieldEditAttributes(
    productEditingUrl,
    locale,
    'number_of_reviews',
  );
  const selectedVariationIndex = data.product.productVariations.findIndex(
    (item) => item.color.hex === selectedColor,
  );
  const selectedVariation =
    selectedVariationIndex > -1
      ? data.product.productVariations[selectedVariationIndex]
      : null;
  const selectedVariationSizes =
    (selectedVariation?.availableSizes as Array<string>) ?? [];

  const {
    sale,
    reviews,
    color,
    size,
    currencySymbol,
    priceUndertext,
    shippingText,
    primaryButton,
    secondaryButton,
  } =
    getFragmentData(
      ProductGeneralInterfaceFragmentDoc,
      data.generalInterface,
    ) ?? {};

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full justify-center bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-8 w-full max-w-[1080px] md:ml-20 lg:ml-56">
          <div className="grid w-full items-center gap-8 md:ml-4 md:grid-cols-2">
            <div className="grid flex-shrink-0 gap-4 lg:h-full lg:grid-cols-5">
              <div className="order-last flex gap-4 lg:order-none lg:flex-col">
                {data.product.productImages.map((image) => {
                  if (image === selectedImage)
                    return (
                      <div
                        key={image.id}
                        className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100"
                      >
                        {image.responsiveImage && (
                          <DatoImage
                            fragment={image.responsiveImage}
                            altOverride={image.alt ?? null}
                            className="h-full w-full object-contain"
                            {...imageFillCoverProps()}
                          />
                        )}
                      </div>
                    );

                  return (
                    <button
                      type="button"
                      key={image.id}
                      className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 transition duration-200 hover:scale-105 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedImage(image);
                      }}
                    >
                      {image.responsiveImage && (
                        <DatoImage
                          fragment={image.responsiveImage}
                          altOverride={image.alt ?? null}
                          className="h-full w-full object-contain"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="50% 50%"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 md:h-80 lg:col-span-4 lg:h-full">
                <div className="h-[500px] sm:h-[650px] md:h-full">
                  {selectedImage?.responsiveImage && (
                    <DatoImage
                      fragment={selectedImage?.responsiveImage}
                      altOverride={selectedImage?.alt ?? null}
                      className="h-full w-full object-contain"
                      {...imageFillCoverProps()}
                    />
                  )}
                </div>

                {isOnSale && (
                  <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
                    {sale}
                  </span>
                )}

                <button
                  type="button"
                  aria-label="Add to favorites"
                  className="absolute right-4 top-4 inline-block rounded-lg border bg-white px-3.5 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-primary/30 transition duration-100 hover:bg-gray-100 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Favorite</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mx-auto flex w-80 flex-col items-center justify-center text-center md:mx-0 md:block md:text-left">
              <div className="mb-2 md:mb-3">
                <Link
                  href={`/${globalPageProps.params.lng}/products?brands=${data.product.brand.id}`}
                  className="mb-0.5 inline-block cursor-pointer text-gray-500 hover:underline"
                >
                  {data.product.brand?.name}
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                  {data.product.name}
                </h2>
              </div>

              <div className="mb-6 flex items-center gap-3 md:mb-10">
                <div className="flex h-7 items-center gap-1 rounded-full bg-primary/90 px-2 text-white">
                  <span
                    className="text-sm"
                    {...reviewAverageEditAttributes}
                    data-datocms-edit-target
                  >
                    {data.product.reviewAverage}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <title>Star</title>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <span className="text-sm text-gray-500 transition duration-100">
                  <span
                    {...numberOfReviewsEditAttributes}
                    data-datocms-edit-target
                  >
                    {data.product.numberOfReviews}
                  </span>{' '}
                  {reviews}
                </span>
              </div>

              <div className="mb-4 md:mb-6">
                <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">
                  {color}
                </span>

                <div className="flex flex-wrap gap-2">
                  {data.product.productVariations.map(
                    (variation, variationIndex) => {
                      const colorEditAttributes = getProductFieldEditAttributes(
                        productEditingUrl,
                        locale,
                        [
                          'product_variations',
                          variationIndex.toString(),
                          'color',
                        ],
                      );

                      if (variation.color.hex === selectedColor)
                        return (
                          <span
                            key={variation.id}
                            style={{ backgroundColor: variation.color.hex }}
                            className="h-8 w-8 rounded-full border ring-2 ring-gray-800 ring-offset-1 transition duration-100"
                            {...colorEditAttributes}
                            data-datocms-edit-target
                          />
                        );
                      return (
                        <button
                          key={variation.id}
                          type="button"
                          style={{ backgroundColor: variation.color.hex }}
                          className={
                            'h-8 w-8 rounded-full border ring-2 ring-transparent ring-offset-1 transition duration-100 hover:ring-gray-200'
                          }
                          {...colorEditAttributes}
                          data-datocms-edit-target
                          onClick={() => {
                            setSelectedColor(variation.color.hex);
                          }}
                        />
                      );
                    },
                  )}
                </div>
              </div>

              <div className="mb-8 md:mb-10">
                <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">
                  {size}
                </span>

                <div className="flex flex-wrap gap-3">
                  {allSizes.map((sizeOption) => {
                    const availableIndex =
                      selectedVariationSizes.indexOf(sizeOption);
                    const sizeEditAttributes =
                      availableIndex > -1 && selectedVariationIndex > -1
                        ? getProductFieldEditAttributes(
                            productEditingUrl,
                            locale,
                            [
                              'product_variations',
                              selectedVariationIndex.toString(),
                              'available_sizes',
                              availableIndex.toString(),
                            ],
                          )
                        : null;

                    if (availableIndex > -1) {
                      if (selectedSize === sizeOption)
                        return (
                          <span
                            key={sizeOption}
                            className="border-primary/90-500 flex h-8 w-12 cursor-default items-center justify-center rounded-md border bg-primary/90 text-center text-sm font-semibold text-white"
                            {...(sizeEditAttributes ?? {})}
                            data-datocms-edit-target={
                              sizeEditAttributes ? true : undefined
                            }
                          >
                            {sizeOption.toUpperCase()}
                          </span>
                        );
                      return (
                        <button
                          key={sizeOption}
                          type="button"
                          className="flex h-8 w-12 items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-800 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                          {...(sizeEditAttributes ?? {})}
                          data-datocms-edit-target={
                            sizeEditAttributes ? true : undefined
                          }
                          onClick={() => {
                            setSelectedSize(sizeOption);
                          }}
                        >
                          {sizeOption.toUpperCase()}
                        </button>
                      );
                    }
                    return (
                      <span
                        key={sizeOption}
                        className="flex h-8 w-12 cursor-not-allowed items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-400"
                      >
                        {sizeOption.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                {isOnSale && (
                  <div className="flex items-end gap-2">
                    <span
                      className="text-xl font-bold text-gray-800 md:text-2xl"
                      {...salePriceEditAttributes}
                      data-datocms-edit-target
                    >
                      {currencySymbol} {data.product.salePrice}
                    </span>
                    <span
                      className="mb-0.5 text-red-500 line-through"
                      {...priceEditAttributes}
                      data-datocms-edit-target
                    >
                      {currencySymbol} {data.product.price}
                    </span>
                  </div>
                )}

                {!isOnSale && (
                  <div className="">
                    <span
                      className="text-xl font-bold text-gray-800 md:text-2xl"
                      {...priceEditAttributes}
                      data-datocms-edit-target
                    >
                      {currencySymbol} {data.product.price}
                    </span>
                  </div>
                )}

                <span className="text-sm text-gray-500">{priceUndertext}</span>
              </div>

              <div className="mb-6 flex items-center gap-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Shipping</title>
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>

                <span className="text-sm">{shippingText}</span>
              </div>

              <div className="flex w-[90%] flex-col gap-2.5">
                <button
                  type="button"
                  className="inline-block flex-1 rounded-lg bg-primary/90 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary/40 transition duration-100 hover:bg-primary focus-visible:ring active:bg-primary/50 sm:flex-none md:text-base"
                >
                  {primaryButton}
                </button>

                <button
                  type="button"
                  className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  {secondaryButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
