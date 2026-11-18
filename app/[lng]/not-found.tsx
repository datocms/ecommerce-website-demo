import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { draftMode } from 'next/headers';
import OptionalLink from '@/components/Common/OptionalLink';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import DatoStructuredText from '@/components/DatoStructuredText';
import Rise from '@/components/Motion/Rise';
import { graphql } from '@/lib/datocms/graphql';
import { LinkRecordFragment, linkHref } from '@/lib/datocms/linkHref';
import { queryDatoCMS } from '@/lib/datocms/queryDatoCMS';
import { getFallbackLocale, type SiteLocale } from '@/lib/i18n';
import { getRequestLocale } from '@/lib/requestLocale';

const query = graphql(
  /* GraphQL */ `
    query NotFoundPage($locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
      notFoundPage(locale: $locale, fallbackLocales: $fallbackLocale) {
        title
        description {
          value
        }
        image {
          responsiveImage(imgixParams: { w: 1600, fit: max, auto: format }) {
            ...ResponsiveImageFragment
          }
        }
        button {
          label
          page
          record {
            ...LinkRecordFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment, LinkRecordFragment],
);

// Rendered by the root layout alone, so no header or footer: the photo runs to the viewport's edges
export default async function NotFound() {
  const fallbackLocale = await getFallbackLocale();
  const lng = getRequestLocale() ?? fallbackLocale;
  const { isEnabled: isDraft } = await draftMode();
  const { notFoundPage } = await queryDatoCMS(
    query,
    { locale: lng as SiteLocale, fallbackLocale: [fallbackLocale] },
    isDraft,
  );
  if (!notFoundPage) return null;
  const { title, description, image, button } = notFoundPage;

  return (
    <main className="grid min-h-svh grid-rows-[minmax(17.5rem,1fr)_auto] lg:grid-cols-12 lg:grid-rows-1">
      <title>{title}</title>
      <div
        className={`${MEDIA} settle lg:order-last lg:col-span-6 xl:col-span-7`}
      >
        {image.responsiveImage && (
          <DatoImage
            fragment={image.responsiveImage}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 25%"
            // From lg the 4:5 photo is as wide as 80vh when the screen is narrower than 8:5 (48:35 at xl)
            sizes="(min-width: 1280px) and (max-aspect-ratio: 48/35) 80vh, (min-width: 1280px) 59vw, (min-width: 1024px) and (max-aspect-ratio: 8/5) 80vh, (min-width: 1024px) 50vw, 100vw"
            priority
          />
        )}
      </div>

      {/* pb-20 below sm keeps the full-width button clear of the fixed draft toggle */}
      <div className="flex flex-col px-(--gutter) pt-10 pb-20 sm:pb-12 lg:col-span-6 lg:justify-center lg:py-16 lg:pr-14 xl:col-span-5">
        <p className="-ml-[0.025em] text-[8.25rem] leading-[0.8] font-semibold tracking-[-0.06em] tabular-nums sm:text-[10.5rem] lg:text-[12.5rem] xl:text-[16rem]">
          <Rise>404</Rise>
        </p>
        <div className="enter-stagger mt-10 lg:mt-14 [--delay:200ms]">
          <h1 className="title-statement">{title}</h1>
          <div className="mt-5 max-w-[30em] text-md leading-[1.6] text-pretty text-ink-2 lg:text-lg lg:leading-[1.6]">
            <DatoStructuredText data={description} />
          </div>
          <OptionalLink
            href={linkHref(lng, button)}
            className="btn mt-8 w-full sm:w-auto"
          >
            {button.label}
            <ArrowRightIcon aria-hidden="true" className="stroke-2" />
          </OptionalLink>
        </div>
      </div>
    </main>
  );
}
