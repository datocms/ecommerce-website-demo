import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import DocumentLang from '@/components/Common/DocumentLang';
import { MEDIA } from '@/components/Sections/ui';

// No header or footer here (it renders outside [lng]): the photo runs to the viewport's edges
// and, on phones, takes whatever height the text leaves. From lg the 4:5 photo fills its column
// by height, so 80vh wide, on screens narrower than 8:5 (48:35 once the column is 7/12 at xl)
const NotFound = () => {
  return (
    <main className="grid min-h-svh grid-rows-[minmax(17.5rem,1fr)_auto] lg:grid-cols-12 lg:grid-rows-1">
      <DocumentLang lang="en" />
      <div className={`${MEDIA} lg:order-last lg:col-span-6 xl:col-span-7`}>
        <Image
          src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=1600"
          alt="A person stands behind a red-tinted, foggy surface with hands pressed against it, wearing a cap and jacket."
          fill
          priority
          sizes="(min-width: 1280px) and (max-aspect-ratio: 48/35) 80vh, (min-width: 1280px) 59vw, (min-width: 1024px) and (max-aspect-ratio: 8/5) 80vh, (min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[50%_25%]"
        />
      </div>

      {/* Below sm the full-width button would end under the draft toggle (fixed, 16px + 48px off
          the bottom), so the column leaves that corner free */}
      <div className="flex flex-col px-(--gutter) pt-10 pb-20 sm:pb-12 lg:col-span-6 lg:justify-center lg:py-16 lg:pr-14 xl:col-span-5">
        <p className="-ml-[0.025em] text-[8.25rem] leading-[0.8] font-semibold tracking-[-0.06em] tabular-nums sm:text-[10.5rem] lg:text-[12.5rem] xl:text-[16rem]">
          404
        </p>
        <div className="mt-10 lg:mt-14">
          <h1 className="title-statement">Page not found</h1>
          <p className="mt-5 max-w-[30em] text-md leading-[1.6] text-pretty text-ink-2 lg:text-lg lg:leading-[1.6]">
            The page you’re looking for doesn’t exist.
          </p>
          <Link href="/" className="btn mt-8 w-full sm:w-auto">
            Go home
            <ArrowRightIcon aria-hidden="true" className="stroke-2" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
