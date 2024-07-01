import DatoImage from '@/components/DatoImage';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import {
  MaterialProductFragmentFragmentDoc,
  ProductGeneralInterfaceFragmentDoc,
  ProductInfoSectionFragmentDoc,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import type { Maybe } from 'graphql/jsutils/Maybe';
import Link from 'next/link';

type Props = {
  ProductInfoFragment: FragmentType<typeof ProductInfoSectionFragmentDoc>;
  MaterialFragment: Maybe<
    FragmentType<typeof MaterialProductFragmentFragmentDoc>
  >;
  globalPageProps: GlobalPageProps;
  generalInterfaceFragment: Maybe<
    FragmentType<typeof ProductGeneralInterfaceFragmentDoc>
  >;
};

const ProductInfoSection = ({
  ProductInfoFragment,
  MaterialFragment,
  globalPageProps,
  generalInterfaceFragment,
}: Props) => {
  const {
    materials,
    style: styleString,
    weather: weatherString,
    occasions: occasionsString,
    more,
  } = getFragmentData(
    ProductGeneralInterfaceFragmentDoc,
    generalInterfaceFragment,
  ) ?? {};

  const { material, style, weather, occasions } = getFragmentData(
    ProductInfoSectionFragmentDoc,
    ProductInfoFragment,
  );

  const { details, name, id } =
    getFragmentData(MaterialProductFragmentFragmentDoc, MaterialFragment) ?? {};
  return (
    <div className="bg-white pt-2">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="w-full overflow-hidden rounded-lg border bg-gray-50 shadow-sm">
          <div className="mx-auto flex max-w-screen-lg flex-col  items-center gap-8 p-8 lg:flex-row">
            <div className=" ml-6 flex w-2/3 grid-cols-2 flex-col justify-center gap-8 md:grid lg:ml-0">
              <div className="group flex gap-4">
                <div className="group-hover:bg- primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/80 text-white shadow-lg transition duration-100 md:h-12 md:w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="512pt"
                    height="512pt"
                    viewBox="0 0 512 512"
                    id="yarn"
                    className="h-6 w-6"
                    stroke="none"
                    fill="white"
                  >
                    <title>Materials</title>
                    <path
                      stroke="white"
                      d="m286.023438 482c-8.285157 0-15.023438-6.738281-15.023438-15.023438 0-8.285156 6.738281-15.023437 15.023438-15.023437h110.898437c24.824219 0 45.023437-20.199219 45.023437-45.023437 0-24.828126-20.199218-45.023438-45.023437-45.023438h-96.890625c55.144531-34.710938 91.871094-96.117188 91.871094-165.953125 0-108.050781-87.902344-195.953125-195.949219-195.953125-108.050781 0-195.953125 87.902344-195.953125 195.953125 0 108.046875 87.902344 195.949219 195.953125 195.949219h200.96875c8.28125 0 15.023437 6.742187 15.023437 15.023437 0 8.285157-6.742187 15.023438-15.023437 15.023438h-110.898437c-24.824219 0-45.023438 20.199219-45.023438 45.023437 0 24.828125 20.199219 45.027344 45.023438 45.027344h225.976562v-30zm-238.804688-359.59375c43.355469 2.585938 82.457031 26.003906 105.359375 62.386719-10.921875 1.488281-21.71875 3.546875-32.359375 6.152343-19.65625-24.472656-49.203125-38.800781-81.023438-38.800781-1.109374 0-2.21875.019531-3.328124.054688 2.835937-10.371094 6.65625-20.335938 11.351562-29.792969zm74.117188-74.65625c12.566406-6.351562 26.042968-11.152344 40.183593-14.148438 24.84375 13.703126 46.984375 31.234376 65.996094 52.277344-6.925781 7.433594-13.460937 15.125-19.582031 23.082032-23.671875-27.128907-53.386719-48.089844-86.597656-61.210938zm127.621093 17.128906c-11.394531-12.507812-23.785156-23.898437-37.101562-34.113281 20.785156 1.988281 40.464843 7.824219 58.316406 16.785156-7.300781 5.460938-14.386719 11.238281-21.214844 17.328125zm-218.957031 131.074219c0-4.476563.183594-8.910156.535156-13.300781 2.863282-.332032 5.753906-.507813 8.660156-.507813 18.339844 0 35.621094 6.691407 48.964844 18.492188-19.160156 6.9375-37.640625 15.761719-55.226562 26.398437-1.917969-10.074218-2.933594-20.460937-2.933594-31.082031zm165.953125 15.902344c55.335937 0 108.449219 15.5625 154.332031 45.105469-3.738281 9.429687-8.328125 18.429687-13.65625 26.921874-41.65625-27.542968-89.96875-42.027343-140.675781-42.027343-50.710937 0-99.019531 14.484375-140.679687 42.027343-5.328126-8.492187-9.914063-17.492187-13.65625-26.921874 45.882812-29.542969 98.996093-45.105469 154.335937-45.105469zm165.949219-15.902344c0 10.621094-1.011719 21.007813-2.929688 31.082031-12.054687-7.289062-24.527344-13.726562-37.355468-19.289062 10.363281-15.25 23.179687-28.640625 37.929687-39.679688 1.542969 9.070313 2.355469 18.382813 2.355469 27.886719zm-69.035156.972656c-9.921876-3.183593-20.007813-5.878906-30.234376-8.066406 9.929688-17.328125 22.167969-33.308594 36.539063-47.679687 11.820313-11.820313 24.808594-22.242188 38.730469-31.113282 5.21875 8.59375 9.671875 17.699219 13.28125 27.21875-23.5 15.488282-43.367188 35.804688-58.316406 59.640625zm27.164062-111.042969c-15.105469 9.796876-29.207031 21.214844-42.074219 34.082032-18.941406 18.941406-34.621093 40.378906-46.714843 63.832031-10.71875-1.183594-21.550782-1.820313-32.460938-1.914063 14.078125-30.78125 33.503906-58.671874 57.964844-83.128906 12.578125-12.582031 26.277344-23.949218 40.800781-33.929687 8.128906 6.316406 15.65625 13.367187 22.484375 21.058593zm-230.546875-17.121093c39.605469 10.636719 74.855469 33.671875 100.742187 65.773437-5.785156 9.308594-11.074218 18.90625-15.851562 28.789063-25.414062-37.015625-64.953125-62.089844-109.410156-69.144531 7.253906-9.316407 15.476562-17.835938 24.519531-25.417969zm-15.992187 239.066406c36.359374-23.574219 78.375-35.972656 122.460937-35.972656s86.097656 12.398437 122.457031 35.972656c-7.042968 7.703125-14.796875 14.746094-23.167968 21.015625-30.027344-17.6875-64.136719-26.988281-99.292969-26.988281-35.152344 0-69.261719 9.300781-99.289063 26.988281-8.367187-6.269531-16.125-13.308594-23.167968-21.015625zm53.453124 39.03125c21.519532-9.851563 44.96875-15.003906 69.007813-15.003906 24.035156 0 47.484375 5.152343 69.007813 15.003906-21.027344 9.652344-44.398438 15.042969-69.007813 15.042969s-47.984375-5.390625-69.007813-15.042969zm0 0"
                    />
                  </svg>
                </div>

                <div>
                  <div className="mb-1 font-semibold">{materials}</div>
                  <p className="text-sm text-gray-500">{material}</p>
                </div>
              </div>

              <div className="group flex gap-4">
                <div className="group-hover:bg- primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/80 text-white shadow-lg transition duration-100   md:h-12 md:w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 32 32"
                    viewBox="0 0 32 32"
                    id="cloth"
                    className="h-6 w-6"
                  >
                    <title>Style</title>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke-miterlimit="10"
                      stroke-width="2"
                      d="M15,3H6v26h20V14C19.925,14,15,9.075,15,3z"
                    />
                    <line
                      x1="22"
                      x2="22"
                      y1="23"
                      y2="25"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke-miterlimit="10"
                      stroke-width="2"
                      d="M19.922 16.713c.668.297 1.362.547 2.078.745V19M14.342 12.429c.506.624 1.06 1.206 1.658 1.742M11.541 7c.193.695.434 1.37.72 2.021"
                    />
                  </svg>
                </div>

                <div>
                  <div className="mb-1 font-semibold">{styleString}</div>
                  <p className="text-sm text-gray-500">{style}</p>
                </div>
              </div>

              <div className="group flex gap-4">
                <div className="group-hover:bg- primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/80 text-white shadow-lg transition duration-100   md:h-12 md:w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Weather</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke-width="2"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>

                <div>
                  <div className="mb-1 font-semibold">{weatherString}</div>
                  <p className="text-sm text-gray-500">{weather}</p>
                </div>
              </div>

              <div className="group flex gap-4">
                <div className="group-hover:bg- primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/80 text-white shadow-lg transition duration-100   md:h-12 md:w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    id="clock"
                    fill="white"
                  >
                    <title>Occasion</title>
                    <path d="M12,6a.99974.99974,0,0,0-1,1v4.38379L8.56934,12.60693a.99968.99968,0,1,0,.89843,1.78614l2.98145-1.5A.99874.99874,0,0,0,13,12V7A.99974.99974,0,0,0,12,6Zm0-4A10,10,0,1,0,22,12,10.01146,10.01146,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20Z" />
                  </svg>
                </div>

                <div>
                  <div className="mb-1 font-semibold">{occasionsString}</div>
                  <p className="text-sm text-gray-500">{occasions}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border md:w-1/2 lg:w-1/3">
              {details?.image.responsiveImage && (
                <div className="relative h-48 bg-gray-100">
                  <DatoImage
                    fragment={details.image.responsiveImage}
                    className="h-full w-full object-cover object-center"
                    objectFit="cover"
                    objectPosition="50% 50%"
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-2 bg-white p-3">
                <p className="text-sm text-gray-500">{name}</p>

                <Link
                  href={`/${globalPageProps.params.lng}/products/?materials=${id}`}
                  className="inline-block shrink-0 rounded-lg border bg-white px-3 py-1 text-sm font-semibold text-primary outline-none ring-indigo-300 transition duration-100 hover:bg-gray-50 focus-visible:ring active:bg-gray-100"
                >
                  {more}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
