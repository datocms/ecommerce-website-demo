/**
 * @fileoverview 404 page that pulls a fallback image from the Layout query
 * and offers a link back home.
 */
import Link from 'next/link';
import { getFallbackLocale } from '@/app/i18n/settings';
import DatoImage from '@/components/DatoImage';
import { LayoutDocument, type LayoutQuery } from '@/graphql/types/graphql';
import { imageCoverProps } from '@/utils/imageProps';
import queryDatoCMS from '@/utils/queryDatoCMS';

/** Choose a best-effort image to display on the 404 page. */
const resolveNotFoundImage = (layout?: LayoutQuery['layout']) => {
  const candidates = [
    layout?.popup?.popupImage,
    layout?.logo,
    layout?.footerLogo,
  ].filter(Boolean) as NonNullable<LayoutQuery['layout']>['logo'][];

  for (const candidate of candidates) {
    if (candidate?.responsiveImage) {
      return candidate;
    }
  }

  return null;
};

/** Render a friendly not-found page with a home link. */
const NotFound = async () => {
  const fallbackLocale = await getFallbackLocale();
  const data = await queryDatoCMS(LayoutDocument, {
    locale: fallbackLocale,
    fallbackLocale: [fallbackLocale],
  });

  const notFoundImage = resolveNotFoundImage(data.layout ?? undefined);

  return (
    <div className="flex h-screen items-center justify-center bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-lg px-4 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32">
            <p className="mb-4 text-sm font-semibold uppercase text-red-500 md:text-base">
              Error 404
            </p>
            <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-left md:text-3xl">
              Page not found
            </h1>

            <p className="mb-8 text-center text-gray-500 sm:text-left md:text-lg">
              The page you’re looking for doesn’t exist.
            </p>

            <Link
              href="/"
              className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
            >
              Go home
            </Link>
          </div>

          <div className="relative h-80 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
            {notFoundImage?.responsiveImage && (
              <DatoImage
                fragment={notFoundImage.responsiveImage}
                altOverride={notFoundImage.alt}
                className="absolute inset-0 h-full w-full object-cover object-center"
                {...imageCoverProps()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
