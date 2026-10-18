import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SvgRenderer from '@/components/Common/SvgRenderer';
import DatoImage from '@/components/DatoImage';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import { seasonTint } from '../season';
import { FOREST_CARD } from '../ui';
import { HeroSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof HeroSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** General interface "Shop now" label; the button links to the catalog */
  shopNow?: string | null;
};

const TILE_COLUMNS = ['', 'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3'];

const Hero = ({ fragment, globalPageProps, shopNow }: Props) => {
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
  const hasTiles = featuredCollections.length > 0;
  // From xl up to four tiles share a fixed-height block under the side photo; longer lists size
  // their rows to the tiles and the photo gives up the height instead
  const fixedTiles = featuredCollections.length <= 4;
  // Season names up to eight letters (Spring, Frühling) fit the narrowest tiles at full size;
  // longer ones (Primavera, Printemps) step down a size earlier
  const longNames = featuredCollections.some((collection) =>
    stripStega(collection.name ?? '')
      .split(/\s+/)
      .some((word) => Array.from(word).length > 8),
  );
  const titleId = `${id}-title`;

  // xl: forest card (5 cols) | main photo (4) | side photo over the season tiles (3).
  // Below xl the card spans the row, then the photos pair up, then the tiles; on phones the
  // main photo comes first and the card overlaps its bottom edge.
  return (
    <section aria-labelledby={titleId} className="pt-1">
      <div className="shell grid grid-cols-2 gap-3 sm:gap-4 xl:min-h-(--hero-h) xl:grid-cols-12">
        <div
          className={`@container relative z-10 order-2 col-span-2 mx-2 -mt-24 flex flex-col justify-between shadow-pop sm:order-1 sm:mx-0 sm:mt-0 sm:shadow-none xl:col-span-5 ${FOREST_CARD}`}
        >
          <div>
            {/* On small phones the title scales down so a nine-letter word (Encuentra) fits the card
                with some room to spare */}
            <h1
              id={titleId}
              className="hero-title max-sm:text-[min(3.75rem,21.5cqw)]"
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="mt-6 max-w-[34em] text-md leading-[1.6] text-pretty text-cream/85 xl:text-lg xl:leading-[1.6]">
                {heroSubtitle}
              </p>
            )}
            {shopNow && (
              <div className="mt-8">
                <Link href={`/${lng}/products`} className="btn-butter">
                  {shopNow}
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
          {/* From xl the card stretches with the photos and the socials row sits at its foot */}
          {socials.length > 0 && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/15 pt-6 sm:mt-10">
              {socialLabel && (
                <p className="text-sm font-semibold text-cream/80">
                  {socialLabel}
                </p>
              )}
              <ul className="ml-auto flex gap-2">
                {socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        stripStega(social.name ?? '') || stripStega(social.url)
                      }
                      className="relative grid size-10 place-items-center rounded-full ring-1 ring-white/20 transition-colors after:absolute after:-inset-0.5 hover:bg-butter hover:text-ink [&_svg]:size-[1.125rem]"
                    >
                      <SvgRenderer url={social.icon.url} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative order-1 col-span-2 aspect-[4/5] overflow-hidden rounded-card bg-oat sm:order-2 sm:col-span-1 xl:col-span-4 xl:aspect-auto">
          {heroImage.responsiveImage && (
            <DatoImage
              fragment={heroImage.responsiveImage}
              layout="fill"
              objectFit="cover"
              objectPosition="50% 25%"
              sizes="(min-width: 1280px) 31vw, (min-width: 640px) 50vw, 100vw"
              priority
            />
          )}
        </div>

        <div className="contents xl:order-3 xl:col-span-3 xl:flex xl:flex-col xl:gap-4">
          <div
            className={`relative order-3 min-h-[17.5rem] overflow-hidden rounded-card bg-oat sm:col-span-1 sm:aspect-[4/5] sm:min-h-0 xl:aspect-auto xl:flex-1 ${hasTiles ? 'col-span-1' : 'col-span-2'}`}
          >
            {additionalImage.responsiveImage && (
              <DatoImage
                fragment={additionalImage.responsiveImage}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 30%"
                sizes="(min-width: 1280px) 22vw, 50vw"
              />
            )}
          </div>
          {hasTiles && (
            <ul
              className={`order-4 col-span-1 grid grid-cols-1 gap-2 sm:col-span-2 sm:gap-4 xl:auto-rows-fr xl:grid-cols-2 xl:[&>li:last-child:nth-child(odd)]:col-span-2 ${TILE_COLUMNS[featuredCollections.length] ?? 'sm:grid-cols-4'} ${fixedTiles ? 'xl:h-[clamp(15.625rem,21vw,18.75rem)]' : ''}`}
            >
              {featuredCollections.map((collection) => (
                <li key={collection.id} className="flex">
                  <Link
                    href={`/${lng}/products?collections=${collection.id}`}
                    className={`group @container flex h-16 w-full items-center justify-between gap-2 rounded-nav pr-3 pl-4 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 sm:h-[9.375rem] sm:flex-col-reverse sm:items-start sm:p-4 xl:h-full ${seasonTint(collection.slug) ?? 'bg-oat'}`}
                  >
                    {/* 18px on the narrowest phone rows, where the arrow also gives way to the name; a
                        long name takes 24px only when the tile has room */}
                    <span
                      className={`title-sm min-w-0 ${longNames ? 'max-sm:@max-[9rem]:text-[1.125rem] sm:text-[1.3125rem] sm:@min-[6.875rem]:text-[1.5rem]' : 'max-sm:@max-[8.5rem]:text-[1.125rem]'}`}
                    >
                      {collection.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-white/75 transition-colors group-hover:bg-ink group-hover:text-cream max-sm:@max-[8rem]:hidden sm:self-end"
                    >
                      <ArrowUpRightIcon className="size-4 stroke-[2.4]" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
