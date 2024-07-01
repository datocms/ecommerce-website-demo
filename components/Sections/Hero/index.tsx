import SvgRenderer from '@/components/Common/SvgRenderer';
import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { HeroSectionFragmentDoc } from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import Link from 'next/link';

type Props = {
  fragment: FragmentType<typeof HeroSectionFragmentDoc>;
  globalPageProps: GlobalPageProps;
};

const Hero = ({ fragment, globalPageProps }: Props) => {
  const {
    heroTitle,
    heroSubtitle,
    heroImage,
    additionalImage,
    socialLabel,
    featuredCollections,
    socials,
  } = getFragmentData(HeroSectionFragmentDoc, fragment);
  return (
    <>
      <div className="mx-auto max-w-7xl bg-white pb-6 pt-14 sm:pb-8 lg:pb-12">
        <section className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-8 flex flex-wrap justify-between md:mb-16">
            <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
              <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">
                {heroTitle}
              </h1>

              <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">
                {heroSubtitle}
              </p>
            </div>
            <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
              <div className="relative left-12 top-12 z-10 -ml-12 h-[550px] w-[550px] overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
                <DatoImage
                  fragment={heroImage.responsiveImage}
                  className="h-full w-full object-cover object-center"
                  objectFit="cover"
                  objectPosition="50% 50%"
                />
              </div>

              <div className="h-[550px] w-[550px] overflow-hidden rounded-lg bg-gray-100 shadow-lg">
                <DatoImage
                  fragment={additionalImage.responsiveImage}
                  className="h-full w-full object-cover object-center"
                  objectFit="cover"
                  objectPosition="50% 50%"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex h-12 w-80 divide-x overflow-hidden rounded-lg border">
              {featuredCollections.map((collection) => (
                <Link
                  href={`/${globalPageProps.params.lng}/products?collections=${collection.id}`}
                  className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
                  key={collection.id}
                >
                  {collection.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400 sm:text-base">
                {socialLabel ?? 'SOCIALS'}
              </span>
              <span className="h-px w-12 bg-gray-400" />

              <div className="flex gap-4">
                {socials.map((social) => (
                  <Link
                    className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
                    href={social.url}
                    key={social.id}
                  >
                    <SvgRenderer url={social.icon.url} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;
