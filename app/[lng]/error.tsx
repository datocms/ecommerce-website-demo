'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

// Shown when a page cannot be rendered, typically because DatoCMS is unreachable: the text
// cannot come from the CMS, so it stays in English
export default function ErrorPage({ error, retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center px-(--gutter) py-16">
      <div className="w-full max-w-[34rem]">
        <h1 className="title-statement">Something went wrong</h1>
        <p className="mt-5 text-md leading-[1.6] text-pretty text-ink-2 lg:text-lg lg:leading-[1.6]">
          This page could not be loaded. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={retry}
          className="btn mt-8 w-full sm:w-auto"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
