import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { LayoutQuery } from '@/graphql/types/graphql';
import Link from 'next/link';
import { type Dispatch, Fragment, type SetStateAction } from 'react';
import { getProductPriceEditAttributes } from '@/utils/datocmsVisualEditing';
import DatoImage from '../DatoImage';

type CartProduct = LayoutQuery['cartProducts'][number];

type PropTypes = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  products: CartProduct[];
  currencySymbol: string;
  locale: string;
};

const DEFAULT_QUANTITY = 1;

const formatPrice = (value: number) => value.toFixed(2);

export default function Cart({
  open,
  setOpen,
  products,
  currencySymbol,
  locale,
}: PropTypes) {
  const cartItems = products.reduce<
    Array<{
      product: CartProduct;
      price: number;
      responsiveImage: NonNullable<CartProduct['productImages'][number]['responsiveImage']>;
    }>
  >((accumulator, product) => {
    if (!product?.productImages?.length) {
      return accumulator;
    }

    const responsiveImage = product.productImages[0]?.responsiveImage;

    if (!responsiveImage) {
      return accumulator;
    }

    const isOnSale = product.sale === 'on_sale' && product.salePrice != null;
    const price = isOnSale && product.salePrice != null ? product.salePrice : product.price;

    accumulator.push({
      product,
      price,
      responsiveImage,
    });

    return accumulator;
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * DEFAULT_QUANTITY,
    0,
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed right-0 top-1/2 z-50 w-[440px] drop-shadow-sm">
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg p-4 text-center sm:flex-row md:p-8">
              <div>
                <h1 className="text-3xl font-semibold text-primary">
                  This is a DatoCMS Demo
                </h1>
                <p className="text-md">
                  To use the cart, and enable purchases, an integration with
                  Shopify or Commercelayer is necessary{' '}
                </p>
              </div>
            </div>
          </div>
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 blur-sm">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cartItems.length === 0 && (
                              <li className="py-6 text-sm text-gray-500">
                                No products in the cart yet.
                              </li>
                            )}
                            {cartItems.map(({ product, price, responsiveImage }) => (
                              <li key={product.id} className="flex py-6">
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <DatoImage
                                    fragment={responsiveImage}
                                    className="h-full w-full object-cover object-center"
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="50% 50%"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link href={`/${locale}/product/${product.slug}`}>
                                          {product.name}
                                        </Link>
                                      </h3>
                                      <p
                                        className="ml-4"
                                        {...getProductPriceEditAttributes(
                                          (product as { _editingUrl?: string | null })
                                            ._editingUrl,
                                          locale,
                                        )}
                                        data-datocms-edit-target
                                      >
                                        {currencySymbol}
                                        {formatPrice(price)}
                                      </p>
                                    </div>
                                    {product.brand?.name && (
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.brand.name}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {DEFAULT_QUANTITY}
                                    </p>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-primary hover:text-primary/80"
                                        aria-label={`Remove ${product.name} from cart`}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>
                          {currencySymbol}
                          {formatPrice(subtotal)}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <Link
                          href={`/${locale}/products`}
                          className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/80"
                        >
                          Checkout
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-primary hover:text-primary/80"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
