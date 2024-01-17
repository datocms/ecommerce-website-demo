import Image from 'next/image';
import Link from 'next/link';
import SvgRenderer from '../Common/SvgRenderer';
import { FooterQuery, LegalPageRecord, SiteLocale } from '@/graphql/generated';
import { notFound } from 'next/navigation';
import { primaryColor } from '@/app/i18n/settings';
import ReactMarkdown from 'react-markdown';
import { Image as DatoImage, ResponsiveImageType } from 'react-datocms';

type Props = {
  data: FooterQuery;
  lng: SiteLocale;
};

const Footer = ({ data, lng }: Props) => {
  return (
    <footer className="mx-auto max-w-7xl bg-white pt-4 sm:pt-6 lg:pt-8">
      {data.generalInterface?.displayNewsletterFooter && (
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-2 border-b border-t py-6 md:flex-row">
            <div className="mb-3 text-center md:mb-0 md:text-left">
              <span className="font-bold uppercase tracking-widest text-gray-800">
                {data.generalInterface?.newsletter}
              </span>
              <p className="text-gray-500">
                {data.generalInterface?.subscribeToOurNewsletter}
              </p>
            </div>

            <form className="flex w-full gap-2 md:max-w-md">
              <input
                placeholder={data.generalInterface?.emailPlaceholder ?? 'Email'}
                className="w-full flex-1 rounded border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-500 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />

              <button className="inline-block rounded bg-primary px-8 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-primary/80 focus-visible:ring active:bg-indigo-700 md:text-base">
                {data.generalInterface?.newsletterButton}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="pt-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-16 grid grid-cols-2 gap-y-12 md:grid-cols-4 lg:grid-cols-6 lg:gap-8">
            <div className="col-span-full lg:col-span-2 flex flex-col items-center justify-center text-center md:block md:my-auto">
              <div className="mb-4 flex items-center lg:-mt-2">
                <Link
                  href="/"
                  className="relative inline-flex h-12 w-12 items-center gap-2 text-xl font-bold text-black md:text-2xl"
                  aria-label="logo"
                >
                  <DatoImage
                    data={
                      data.layout?.footerLogo
                        ?.responsiveImage as ResponsiveImageType
                    }
                    className="h-full w-full object-contain"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="50% 50%"
                  />
                </Link>
                <span className="relative inline-flex items-center gap-2 pl-2 text-lg font-semibold text-black md:text-2xl">
                  {data.layout?.footerTitle}
                </span>
              </div>

              <p className="mb-6 text-gray-500 md:pr-8">
                {data.layout?.footerSubtitle}
              </p>

              <div className="flex gap-4">
                {data.layout?.socialMediaLinks.map((social) => {
                  return (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
                      key={social.id}
                    >
                      <SvgRenderer url={social.icon.url} />
                    </a>
                  );
                })}
              </div>
            </div>

            {data.layout?.footerColumns.map((column) => {
              return (
                <div key={column.id}>
                  <div className="mb-4 font-bold uppercase tracking-widest text-gray-800 text-center md:text-start -ml-4">
                    {column.label}
                  </div>

                  <nav className="flex flex-col gap-4 items-center md:items-start -ml-4">
                    {column.footerItem.map((item) => {
                      return (
                        <div key={item.id}>
                          <Link
                            href={`/${lng}/${item.slug}`}
                            className="text-gray-500 transition duration-100 hover:text-primary active:text-primary/80"
                          >
                            {item.label}
                          </Link>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>

          <div className="border-t py-8 text-center text-sm text-gray-400">
            {data.layout?.copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
