'use client';

import type { Query as LayoutQuery } from '@/app/[lng]/meta';

type Props = {
  generalInterface: LayoutQuery['generalInterface'];
};

// On the footer grid, so the form lines up with the link columns below
export default function NewsletterSignup({ generalInterface }: Props) {
  return (
    <div className="shell grid gap-6 py-12 md:py-14 lg:grid-cols-12 lg:items-end lg:gap-4">
      <div className="lg:col-span-4 xl:col-span-5">
        {generalInterface?.newsletter && (
          <p className="eyebrow text-mute">{generalInterface.newsletter}</p>
        )}
        <h2 className="title-card mt-2 text-balance first:mt-0">
          {generalInterface?.subscribeToOurNewsletter}
        </h2>
      </div>
      {/* Demo only: no newsletter provider is wired up */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-6"
      >
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {generalInterface?.emailPlaceholder ?? 'Email'}
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          autoComplete="email"
          placeholder={generalInterface?.emailPlaceholder ?? 'Email'}
          className="input-line min-w-0 flex-1"
        />
        <button type="submit" className="btn shrink-0 px-8">
          {generalInterface?.newsletterButton}
        </button>
      </form>
    </div>
  );
}
