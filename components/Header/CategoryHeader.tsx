'use client';

import type {
  DropdownMenuRecord,
  LayoutQuery,
  LinkItemRecord,
  SiteLocale,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useRef, useState } from 'react';
import { Image as DatoImage, type ResponsiveImageType } from 'react-datocms';
import Cart from './Cart';
import HoveringSearch from './HoveringSearch';
import LanguageSelector from './LanguageSelector';

type PropTypes = {
  languages: SiteLocale[];
  data: LayoutQuery;
  globalPageProps: GlobalPageProps;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CategoryHeader({
  globalPageProps,
  languages,
  data,
}: PropTypes) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [searchIsOpen, setSerachIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get('productName') ?? '',
  );
  const [cartIsOpen, setCartIsOpen] = useState(false);
  const router = useRouter();
  const searchBar = useRef<HTMLInputElement>(null);

  const links = data.layout?.menu.filter(
    (item) => item._modelApiKey === 'link_item',
  ) as LinkItemRecord[];

  const categories = data.layout?.menu.filter(
    (item) => item._modelApiKey === 'dropdown_menu',
  ) as DropdownMenuRecord[];

  return (
    <>
      <Cart setOpen={setCartIsOpen} open={cartIsOpen} />
      <div className={'bg-white'}>
        {/* Mobile menu */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pb-2 pt-5">
                    <button
                      type="button"
                      className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setOpen(false)}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as="div" className="mt-2">
                    <div className="border-b border-gray-200">
                      <Tab.List className="-mb-px flex space-x-8 px-4">
                        {categories.map((category) => (
                          <Tab
                            key={category.id}
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? 'border-primary text-primary'
                                  : 'border-transparent text-gray-900',
                                'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium',
                              )
                            }
                          >
                            {category.label}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                      {categories.map((category) => (
                        <Tab.Panel
                          key={category.id}
                          className="space-y-10 px-4 pb-8 pt-10"
                        >
                          <div className="grid grid-cols-2 gap-x-4">
                            <div className="group relative text-sm">
                              {category.newArrival.details.image
                                .responsiveImage && (
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                  <DatoImage
                                    data={
                                      category.newArrival.details.image
                                        .responsiveImage
                                    }
                                    className="h-full w-full object-contain"
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="50% 50%"
                                  />
                                </div>
                              )}
                              <a
                                href={`/${globalPageProps.params.lng}/products?${category.newArrival._modelApiKey}s=${category.newArrival.id}`}
                                className="mt-6 block font-medium text-gray-900"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {category.newArrival.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                New Arrival
                              </p>
                            </div>

                            <div className="group relative text-sm">
                              {category.trending.details.image
                                .responsiveImage && (
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                  <DatoImage
                                    data={
                                      category.trending.details.image
                                        .responsiveImage
                                    }
                                    className="h-full w-full object-contain"
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="50% 50%"
                                  />
                                </div>
                              )}
                              <a
                                href={`/${globalPageProps.params.lng}/products?${category.trending._modelApiKey}s=${category.trending.id}`}
                                className="mt-6 block font-medium text-gray-900"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {category.trending.name}
                              </a>
                              <p aria-hidden="true" className="mt-1">
                                Trending
                              </p>
                            </div>
                          </div>
                          {category.column.map((column) => (
                            <div key={column.id}>
                              <p
                                id={`${category.id}-${column.id}-heading-mobile`}
                                className="font-medium text-gray-900"
                              >
                                {column.label}
                              </p>
                              <ul
                                role="list"
                                aria-labelledby={`${category.id}-${column.id}-heading-mobile`}
                                className="mt-6 flex flex-col space-y-6"
                              >
                                {column.item.map((item) => (
                                  <li key={item.name} className="flow-root">
                                    <a
                                      href={`/${globalPageProps.params.lng}/products?${item._modelApiKey}s=${item.id}`}
                                      className="-m-2 block p-2 text-gray-500"
                                    >
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                    {links?.map((link) => (
                      <div key={link.id} className="flow-root">
                        <a
                          href={`/${globalPageProps.params.lng}/${link.slug}`}
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          {link.label}
                        </a>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <header className="relative z-30 bg-white">
          <nav
            aria-label="Top"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="border-b border-gray-200">
              <div className="flex h-16 items-center">
                <button
                  type="button"
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Logo */}
                <Link
                  href={`/${globalPageProps.params.lng}/home`}
                  className="relative -m-2 ml-4 flex w-12 lg:ml-0"
                >
                  <DatoImage
                    data={
                      data.layout?.logo.responsiveImage as ResponsiveImageType
                    }
                    className="object-contain"
                  />
                </Link>

                {/* Flyout menus */}
                <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8">
                    {categories?.map((category) => (
                      <Popover key={category.label} className="flex">
                        {({ open, close }) => (
                          <>
                            <div className="relative flex">
                              <Popover.Button
                                className={classNames(
                                  open
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-700 hover:text-gray-800',
                                  'relative z-10 -mb-px flex cursor-pointer items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out focus:outline-none',
                                )}
                              >
                                {category.label}
                              </Popover.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                <div
                                  className="absolute inset-0 top-1/2 bg-white shadow"
                                  aria-hidden="true"
                                />

                                <div className="relative bg-white">
                                  <div className="mx-auto max-w-7xl px-8">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                      <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                        <Link
                                          onClick={close}
                                          href={`/${globalPageProps.params.lng}/products?${category.newArrival._modelApiKey}s=${category.newArrival.id}`}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          {category.newArrival.details.image
                                            .responsiveImage && (
                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                              <DatoImage
                                                data={
                                                  category.newArrival.details
                                                    .image.responsiveImage
                                                }
                                                className="h-full w-full object-contain"
                                                layout="fill"
                                                objectFit="cover"
                                                objectPosition="50% 50%"
                                              />
                                            </div>
                                          )}
                                          <p
                                            aria-hidden="true"
                                            className="text-md mt-6 font-bold text-primary/80"
                                          >
                                            {data.generalInterface?.trending}
                                          </p>
                                          <a
                                            href={'item.href'} //change
                                            className="6 mt-1 block font-medium text-gray-900"
                                          >
                                            <span
                                              className="absolute inset-0 z-10"
                                              aria-hidden="true"
                                            />
                                            {category.newArrival?.name}
                                          </a>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            {data.generalInterface?.shopNow}
                                          </p>
                                        </Link>
                                        <Link
                                          onClick={close}
                                          href={`/${globalPageProps.params.lng}/products?${category.trending._modelApiKey}s=${category.trending.id}`}
                                          className="group relative text-base sm:text-sm"
                                        >
                                          {category.trending.details.image
                                            .responsiveImage && (
                                            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                              <DatoImage
                                                data={
                                                  category.trending.details
                                                    .image.responsiveImage
                                                }
                                                className="h-full w-full object-contain"
                                                layout="fill"
                                                objectFit="cover"
                                                objectPosition="50% 50%"
                                              />
                                            </div>
                                          )}
                                          <p
                                            aria-hidden="true"
                                            className="text-md mt-6 font-bold text-primary/80"
                                          >
                                            {data.generalInterface?.new}
                                          </p>
                                          <div className="mt-1 block font-medium text-gray-900">
                                            <span
                                              className="absolute inset-0 z-10"
                                              aria-hidden="true"
                                            />
                                            {category.trending?.name}
                                          </div>
                                          <p
                                            aria-hidden="true"
                                            className="mt-1"
                                          >
                                            {data.generalInterface?.shopNow}
                                          </p>
                                        </Link>
                                      </div>
                                      <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                        {category.column.map((section) => (
                                          <div key={section.label}>
                                            <p
                                              id={`${section.label}-heading`}
                                              className="font-medium text-gray-900"
                                            >
                                              {section.label}
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby={`${section.label}-heading`}
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {section.item.map((item) => (
                                                <li
                                                  key={item.name}
                                                  className="flex"
                                                >
                                                  <Link
                                                    href={`/${globalPageProps.params.lng}/products?${item._modelApiKey}s=${item.id}`}
                                                    className="hover:text-gray-800"
                                                    onClick={close}
                                                  >
                                                    {item.name}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    ))}

                    {links?.map((link) => (
                      <Link
                        key={link.label}
                        href={`/${globalPageProps.params.lng}/${link.slug}`}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </Popover.Group>

                <div className="ml-auto flex items-center">
                  <div className="mr-8 flex lg:ml-8 lg:mr-0">
                    <Suspense>
                      <LanguageSelector
                        languages={languages}
                        currencySymbol={data.generalInterface?.currencySymbol}
                      />
                    </Suspense>
                  </div>

                  {/* Search */}
                  <div className="hidden items-center justify-center md:flex lg:ml-6">
                    <input
                      type="text"
                      ref={searchBar}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={
                        data.generalInterface?.searchPlaceholder ||
                        'Search a clothing piece'
                      }
                      className="h-10 rounded-full border-slate-300 bg-white px-5 pr-10 text-sm outline-none focus:outline-none focus:ring-0"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          router.push(
                            `/${globalPageProps.params.lng}/products?productName=${searchValue}`,
                          );
                          setSerachIsOpen(false);
                        }
                      }}
                    />
                    <a
                      href="#"
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon
                        onClick={() => {
                          if (!searchIsOpen) {
                            setSerachIsOpen(true);
                            searchBar.current?.focus();
                            return;
                          }
                          if (!searchValue) {
                            setSerachIsOpen(false);
                            return;
                          }
                          router.push(
                            `/${globalPageProps.params.lng}/products?productName=${searchValue}`,
                          );
                          setSerachIsOpen(false);
                        }}
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </a>
                  </div>

                  {/* Cart */}
                  <div
                    onClick={() => setCartIsOpen(true)}
                    className="ml-4 flow-root lg:ml-6"
                  >
                    <a href="#" className="group -m-2 flex items-center p-2">
                      <ShoppingBagIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        0
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
}
