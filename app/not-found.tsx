import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import DocumentLang from '@/components/Common/DocumentLang';
import { FOREST_CARD } from '@/components/Sections/ui';

const NotFound = () => {
  return (
    <main className="shell grid min-h-svh grid-rows-[1fr_auto] gap-3 py-3 sm:gap-4 sm:py-4 lg:grid-cols-12 lg:grid-rows-1">
      <DocumentLang lang="en" />
      <div className="relative min-h-[42svh] overflow-hidden rounded-card bg-oat lg:order-last lg:col-span-7 lg:min-h-0">
        <Image
          src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=1600"
          alt="A person stands behind a red-tinted, foggy surface with hands pressed against it, wearing a cap and jacket."
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[50%_25%]"
        />
      </div>

      <div className={`${FOREST_CARD} flex flex-col lg:col-span-5`}>
        <p className="font-display text-[7.5rem] leading-[0.78] font-bold tracking-[-0.045em] text-cream tabular-nums sm:text-[10.5rem] xl:text-[13rem]">
          404
        </p>
        <div className="mt-12 lg:mt-auto lg:pt-12">
          <h1 className="title-lg">Page not found</h1>
          <p className="mt-5 max-w-[30em] text-md text-pretty text-cream/85 sm:text-lg">
            The page you’re looking for doesn’t exist.
          </p>
          <Link href="/" className="btn-butter mt-8">
            Go home
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
