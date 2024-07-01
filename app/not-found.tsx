import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <>
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
                href={'/'}
                className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
              >
                Go home
              </Link>
            </div>

            <div className="relative h-80 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=600"
                loading="lazy"
                alt="A person stands behind a red-tinted, foggy surface with hands pressed against it, wearing a cap and jacket."
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
