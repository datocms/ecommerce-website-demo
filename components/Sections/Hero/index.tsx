import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import type { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import DatoStructuredText from '@/components/DatoStructuredText';
import Rise from '@/components/Motion/Rise';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { productsPath } from '@/lib/routes';
import { HeroSectionFragment } from './fragments';
import HeroLinks from './HeroLinks';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  lng: string;
  /** General interface "Shop now" label; the button links to the catalog */
  shopNow?: string | null;
  /** Show the second photo here: only when the page has no divider to carry it */
  withAdditionalImage?: boolean;
};

// Heights, not an aspect ratio with a max height: WebKit leaves a gap beside a capped ratio box.
// Phones keep the photo short so the headline shows on the first screen.
const PHOTO_COLUMN =
  '-mx-(--gutter) h-[min(110vw,50svh)] md:h-[min(125vw,62svh)] lg:order-2 lg:col-span-7 lg:mx-0 lg:h-auto lg:bleed-r';

function HeroPhotos({
  image,
  additionalImage,
}: {
  image: FragmentOf<typeof ResponsiveImageFragment> | null;
  additionalImage: FragmentOf<typeof ResponsiveImageFragment> | null;
}) {
  const mainPhoto = image && (
    <DatoImage
      fragment={image}
      layout="fill"
      objectFit="cover"
      objectPosition="50% 8%"
      sizes={
        additionalImage
          ? '(min-width: 1024px) 41vw, 67vw'
          : '(min-width: 1024px) 62vw, 100vw'
      }
      priority
    />
  );

  if (!additionalImage) {
    return <div className={`${MEDIA} settle ${PHOTO_COLUMN}`}>{mainPhoto}</div>;
  }

  return (
    <div className={`grid grid-cols-[2fr_1fr] gap-3 lg:gap-4 ${PHOTO_COLUMN}`}>
      <div className={`${MEDIA} settle h-full`}>{mainPhoto}</div>
      <div className={`${MEDIA} settle h-full`}>
        <DatoImage
          fragment={additionalImage}
          layout="fill"
          objectFit="cover"
          sizes="(min-width: 1024px) 21vw, 33vw"
        />
      </div>
    </div>
  );
}

export default function Hero({
  fragment,
  lng,
  shopNow,
  withAdditionalImage,
}: Props) {
  const {
    id,
    heroTitle,
    heroSubtitle,
    heroImage,
    additionalImage,
    socialLabel,
    featuredCollections,
    socials,
  } = readFragment(HeroSectionFragment, fragment);
  const titleId = `${id}-title`;

  return (
    <section aria-labelledby={titleId}>
      {/* min-h, not h: a long localized title can grow the row past --hero-h */}
      <div className="shell grid lg:min-h-(--hero-h) lg:grid-cols-12 lg:gap-4">
        <HeroPhotos
          image={heroImage.responsiveImage}
          additionalImage={
            withAdditionalImage ? additionalImage.responsiveImage : null
          }
        />

        <div className="flex flex-col justify-center pt-8 lg:order-1 lg:col-span-5 lg:py-12">
          <h1 id={titleId} className="title-hero">
            <Rise>{heroTitle}</Rise>
          </h1>
          {/* Right padding only below the title, which may use the whole column */}
          <div className="enter-stagger lg:pr-10 xl:pr-14 [--delay:200ms]">
            {heroSubtitle && (
              <DatoStructuredText
                data={heroSubtitle}
                className="mt-5 max-w-[29.375rem] text-base leading-[1.6] text-ink-2 lg:mt-8 lg:text-lg lg:text-pretty"
              />
            )}
            {shopNow && (
              <div className="mt-8">
                <Link href={productsPath(lng)} className="btn w-full sm:w-auto">
                  {shopNow}
                  <ArrowRightIcon aria-hidden="true" className="stroke-2" />
                </Link>
              </div>
            )}
            <HeroLinks
              lng={lng}
              collections={featuredCollections}
              socials={socials}
              socialLabel={socialLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
