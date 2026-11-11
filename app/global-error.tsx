'use client';

type Props = {
  retry: () => void;
};

// Replaces the root layout when it fails, so it renders its own document without the site's styles
export default function GlobalError({ retry }: Props) {
  return (
    <html lang="en">
      <body
        style={{
          display: 'grid',
          minHeight: '100svh',
          margin: 0,
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div>
          <h1>Something went wrong</h1>
          <p>This page could not be loaded. Please try again in a moment.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
