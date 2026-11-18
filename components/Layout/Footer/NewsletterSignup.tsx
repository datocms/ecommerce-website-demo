'use client';

import { useState } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/(site)/meta';
import { DemoNotice } from '@/components/Common/DemoActionButton';

type Props = {
  generalInterface: LayoutQuery['generalInterface'];
};

const NEWSLETTER_NOTICE =
  'To collect newsletter sign-ups, an integration with an email tool like Mailchimp or Klaviyo is necessary.';

// On the footer grid, so the form lines up with the link columns below
export default function NewsletterSignup({ generalInterface }: Props) {
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <div className="shell grid gap-4 py-8 lg:grid-cols-12 lg:items-center">
      <h2 className="title-item text-balance lg:col-span-4 xl:col-span-5">
        {generalInterface?.subscribeToOurNewsletter}
      </h2>
      {/* Demo only: no newsletter provider is wired up */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setNoticeOpen(true);
        }}
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
      <DemoNotice
        open={noticeOpen}
        onClose={() => setNoticeOpen(false)}
        text={NEWSLETTER_NOTICE}
      />
    </div>
  );
}
