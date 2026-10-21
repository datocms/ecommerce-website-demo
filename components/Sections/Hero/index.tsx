import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Rise from '@/components/Common/Rise';
import SocialLink from '@/components/Common/SocialLink';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import { HeroSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** General interface "Shop now" label; the button links to the catalog */
  shopNow?: string | null;
  /** Show the second photo here: only when the page has no divider to carry it */
  withAdditionalImage?: boolean;
};

// One signature photo running to the right edge (edge to edge on phones, on top), the title,
// line and button beside it, and the featured collections and socials as one quiet line under
// a hairline. The hero's second photo belongs to the first divider (home Content); without
// one it tiles beside the first photo here, so the field never goes missing.
const Hero = ({
  fragment,
  globalPageProps,
  shopNow,
  withAdditionalImage,
}: Props) => {
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
  const { lng } = globalPageProps.params;
  const titleId = `${id}-title`;
  const hasLinksRow = featuredCollections.length > 0 || socials.length > 0;
  const additionalPhoto = withAdditionalImage
    ? additionalImage.responsiveImage
    : null;
  const mainPhoto = heroImage.responsiveImage && (
    <DatoImage
      fragment={heroImage.responsiveImage}
      layout="fill"
      objectFit="cover"
      objectPosition="50% 8%"
      sizes={
        additionalPhoto
          ? '(min-width: 1024px) 41vw, 67vw'
          : '(min-width: 1024px) 62vw, 100vw'
      }
      priority
    />
  );

  return (
    <section aria-labelledby={titleId}>
      {/* From lg the row is --hero-h tall (set on the page wrapper) and the photo fills it;
          min-h rather than h lets a long localized title grow the row */}
      <div className="shell grid lg:min-h-(--hero-h) lg:grid-cols-12 lg:gap-4">
        {/* justify-self-stretch: a grid item with an aspect ratio otherwise shrinks to it, so a
            capped height (tablets) would narrow the photo instead of cropping it */}
        <div
          // settle goes on the photo's own well: this element for one photo, each of the pair's
          // wells for two
          className={`${additionalPhoto ? 'grid grid-cols-[2fr_1fr] gap-3 lg:gap-4' : `${MEDIA} settle`} -mx-(--gutter) aspect-[4/5] max-h-[62svh] justify-self-stretch lg:order-2 lg:col-span-7 lg:mx-0 lg:aspect-auto lg:max-h-none lg:bleed-r`}
        >
          {additionalPhoto ? (
            <>
              <div className={`${MEDIA} settle h-full`}>{mainPhoto}</div>
              <div className={`${MEDIA} settle h-full`}>
                <DatoImage
                  fragment={additionalPhoto}
                  layout="fill"
                  objectFit="cover"
                  sizes="(min-width: 1024px) 21vw, 33vw"
                />
              </div>
            </>
          ) : (
            mainPhoto
          )}
        </div>

        {/* The title may use the whole column (Finden Sie / Ihren Stil stays on two lines); the
            rest keeps its distance from the photo */}
        <div className="flex flex-col justify-center pt-8 lg:order-1 lg:col-span-5 lg:py-12">
          <h1 id={titleId} className="title-hero">
            <Rise>{heroTitle}</Rise>
          </h1>
          <div className="enter-stagger lg:pr-10 xl:pr-14 [--delay:200ms]">
            {heroSubtitle && (
              <p className="mt-5 max-w-[29.375rem] text-base leading-[1.6] text-ink-2 lg:mt-8 lg:text-lg lg:text-pretty">
                {heroSubtitle}
              </p>
            )}
            {shopNow && (
              <div className="mt-8">
                <Link
                  href={`/${lng}/products`}
                  className="btn w-full sm:w-auto"
                >
                  {shopNow}
                  <ArrowRightIcon aria-hidden="true" className="stroke-2" />
                </Link>
              </div>
            )}
            {hasLinksRow && (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 border-t border-line pt-3 lg:mt-14">
                {featuredCollections.length > 0 && (
                  <ul className="flex flex-wrap items-center gap-x-2.5">
                    {featuredCollections.map((collection, index) => (
                      <li
                        key={collection.id}
                        className="flex items-center gap-x-2.5"
                      >
                        {index > 0 && (
                          <span aria-hidden="true" className="text-ink/30">
                            ·
                          </span>
                        )}
                        <Link
                          href={`/${lng}/products?collections=${collection.id}`}
                          className="inline-flex min-h-11 items-center text-md font-medium underline-offset-4 hover:underline"
                        >
                          {collection.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {socials.length > 0 && (
                  <div className="flex items-center gap-2">
                    {socialLabel && (
                      <p className="text-sm text-mute">{socialLabel}</p>
                    )}
                    {/* The last glyph lines up with the end of the hairline */}
                    <ul className="-mr-3 flex">
                      {socials.map((social) => (
                        <li key={social.id}>
                          <SocialLink social={social} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
