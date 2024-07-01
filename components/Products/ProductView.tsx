'use client';

import { getFragmentData } from '@/graphql/types';
import {
  ProductGeneralInterfaceFragmentDoc,
  type ProductQuery,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import DatoImage from '../DatoImage';

type Props = {
  data: ProductQuery;
  globalPageProps: GlobalPageProps;
};

const allSizes = ['xs', 's', 'm', 'l', 'xl'];

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

  const isOnSale = data.product?.sale === 'on_sale';

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
                            className="h-full w-full object-contain"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="50% 50%"
                          />
                        )}
                      </div>
                    );

                  return (
                    <div
                      key={image.id}
                      className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 transition duration-200 hover:scale-105 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedImage(image);
                      }}
                    >
                      {image.responsiveImage && (
                        <DatoImage
                          fragment={image.responsiveImage}
                          className="h-full w-full object-contain"
                          layout="fill"
                          objectFit="cover"
                          objectPosition="50% 50%"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 md:h-80 lg:col-span-4 lg:h-full">
                <div className="h-[500px] sm:h-[650px] md:h-full">
                  {selectedImage?.responsiveImage && (
                    <DatoImage
                      fragment={selectedImage?.responsiveImage}
                      className="h-full w-full object-contain"
                      layout="fill"
                      objectFit="cover"
                      objectPosition="50% 50%"
                    />
                  )}
                </div>

                {isOnSale && (
                  <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm uppercase tracking-wider text-white">
                    {sale}
                  </span>
                )}

                <a
                  href="#"
                  className="absolute right-4 top-4 inline-block rounded-lg border bg-white px-3.5 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-primary/30 transition duration-100 hover:bg-gray-100 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </a>
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
                  <span className="text-sm">{data.product.reviewAverage}</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <span className="text-sm text-gray-500 transition duration-100">
                  {data.product.numberOfReviews} {reviews}
                </span>
              </div>

              <div className="mb-4 md:mb-6">
                <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">
                  {color}
                </span>

                <div className="flex flex-wrap gap-2">
                  {data.product.productVariations.map((variation) => {
                    if (variation.color.hex === selectedColor)
                      return (
                        <span
                          key={variation.id}
                          style={{ backgroundColor: variation.color.hex }}
                          className="h-8 w-8 rounded-full border ring-2 ring-gray-800 ring-offset-1 transition duration-100"
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
                        onClick={() => {
                          setSelectedColor(variation.color.hex);
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-8 md:mb-10">
                <span className="mb-3 inline-block text-sm font-semibold text-gray-500 md:text-base">
                  {size}
                </span>

                <div className="flex flex-wrap gap-3">
                  {allSizes.map((size) => {
                    if (
                      (
                        data.product?.productVariations.find(
                          (item) => item.color.hex === selectedColor,
                        )?.availableSizes as Array<string>
                      ).find((item) => item === size)
                    ) {
                      if (selectedSize === size)
                        return (
                          <span
                            key={size}
                            className="border-primary/90-500 flex h-8 w-12 cursor-default items-center justify-center rounded-md border bg-primary/90 text-center text-sm font-semibold text-white"
                          >
                            {size.toUpperCase()}
                          </span>
                        );
                      return (
                        <button
                          key={size}
                          type="button"
                          className="flex h-8 w-12 items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-800 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                          onClick={() => {
                            setSelectedSize(size);
                          }}
                        >
                          {size.toUpperCase()}
                        </button>
                      );
                    }
                    return (
                      <span
                        key={size}
                        className="flex h-8 w-12 cursor-not-allowed items-center justify-center rounded-md border bg-white text-center text-sm font-semibold text-gray-400"
                      >
                        {size.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                {isOnSale && (
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">
                      {currencySymbol} {data.product.salePrice}
                    </span>
                    <span className="mb-0.5 text-red-500 line-through">
                      {currencySymbol} {data.product.price}
                    </span>
                  </div>
                )}

                {!isOnSale && (
                  <div className="">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">
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
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke-width="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>

                <span className="text-sm">{shippingText}</span>
              </div>

              <div className="flex w-[90%] flex-col gap-2.5">
                <a
                  href="#"
                  className="inline-block flex-1 rounded-lg bg-primary/90 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary/40 transition duration-100 hover:bg-primary focus-visible:ring active:bg-primary/50 sm:flex-none md:text-base"
                >
                  {primaryButton}
                </a>

                <a
                  href="#"
                  className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  {secondaryButton}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
