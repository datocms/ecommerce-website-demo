'use client';

import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import { Suspense } from 'react';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import SocialLink from '@/components/Common/SocialLink';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import CookieNotice, {
  useCookieNoticeOpen,
} from '@/components/Layout/CookieNotice';
import LanguageSelector from '@/components/Layout/LanguageSelector';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import Wordmark from './Wordmark';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

// --draft-toggle-w is published by DraftModeToggle
const CLEAR_OF_DRAFT_TOGGLE =
  'max(var(--gutter), calc(var(--draft-toggle-w, 0px) + min(var(--draft-toggle-w, 0px), 1.5rem) + var(--gutter) - max(0px, (100vw - 90rem) / 2)))';

const Footer = ({ data, globalPageProps }: Props) => {
  const { lng } = globalPageProps.params;
  const generalInterface = data.generalInterface;
  const footerTitle = data.layout?.footerTitle;
  const footerLogo = data.layout?.footerLogo?.responsiveImage
    ? readFragment(
        ResponsiveImageFragment,
        data.layout.footerLogo.responsiveImage,
      )
    : null;
  const showNewsletter = !!generalInterface?.displayNewsletterFooter;
  const columns = data.layout?.footerColumns ?? [];
  const socials = data.layout?.socialMediaLinks ?? [];
  const cookieNoticeOpen = useCookieNoticeOpen();
  const cookieNotice = data.layout?.cookieNotice;
  const cookieNoticeVisible = cookieNoticeOpen && !!cookieNotice;
  // Named by the title, else by the logo's alt text, else "Home"
  const homeLabel = footerTitle
    ? stripStega(footerTitle)
    : footerLogo?.alt
      ? undefined
      : 'Home';

  return (
    <>
      {/* overflow-y-clip: the wordmark waiting below its line never lengthens the page; x stays
          visible so focus rings are not cut off */}
      <footer className="surface-ink mt-(--section-gap) overflow-y-clip">
        {showNewsletter && (
          <>
            {/* One slim row: the invitation on the left, the field on the right, both on the
                footer's own grid so the form lines up with the link columns below */}
            <div className="shell grid gap-6 py-12 md:py-14 lg:grid-cols-12 lg:items-end lg:gap-4">
              <div className="lg:col-span-4 xl:col-span-5">
                {generalInterface?.newsletter && (
                  <p className="eyebrow text-mute">
                    {generalInterface.newsletter}
                  </p>
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
            <div className="shell">
              <div className="h-px bg-line" />
            </div>
          </>
        )}

        <div
          className={`shell grid gap-12 pb-16 lg:grid-cols-12 lg:gap-4 ${showNewsletter ? 'pt-12 md:pt-14' : 'pt-(--band-y)'}`}
        >
          <div className="lg:col-span-4">
            {(footerLogo || footerTitle) && (
              <Link
                href={`/${lng}/home`}
                aria-label={homeLabel}
                className="inline-flex outline-offset-4"
              >
                {footerLogo && (
                  <RSCImage
                    data={footerTitle ? { ...footerLogo, alt: '' } : footerLogo}
                    usePlaceholder={false}
                    sizes="40px"
                    imgClassName="logo-white"
                    imgStyle={{ height: '2.5rem', width: 'auto' }}
                  />
                )}
                {!footerLogo && footerTitle && (
                  <span className="title-item tracking-[-0.03em]">
                    {footerTitle}
                  </span>
                )}
              </Link>
            )}
            {data.layout?.footerSubtitle && (
              <p className="mt-6 max-w-[18.75rem] text-md text-pretty text-mute first:mt-0">
                {data.layout.footerSubtitle}
              </p>
            )}
            {socials.length > 0 && (
              // -ml-3: the first glyph sits on the content edge
              <div className="mt-8 -ml-3 flex first:mt-0">
                {socials.map((social) => (
                  <SocialLink key={social.id} social={social} />
                ))}
              </div>
            )}
          </div>

          {columns.length > 0 && (
            // From md the tracks never shrink below their longest word (1fr keeps an auto
            // minimum and the links stop hyphenating), so a German compound stays whole; below
            // xl the group also takes the spare column beside the brand block
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[repeat(4,1fr)] lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-6">
              {columns.map((column) => (
                <div key={column.id} className="min-w-0 md:min-w-auto">
                  <h2 className="eyebrow hyphens-auto wrap-break-word">
                    {column.label}
                  </h2>
                  <ul className="mt-5 space-y-3.5">
                    {column.footerItem.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/${lng}/${stripStega(item.slug)}`}
                          className="text-sm hyphens-auto wrap-break-word text-mute transition-colors duration-150 hover:text-white md:hyphens-manual"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {footerTitle && (
          <div className="shell overflow-x-clip">
            <Wordmark text={footerTitle} />
          </div>
        )}

        {/* Legal bar. The fixed draft toggle (48px, 16px off the bottom edge) comes to rest
            centred in it at the page end: the bar is 80px from md, and on phones the language
            switch lines up with it. The right padding keeps the bar's content clear of it. */}
        <div className="border-t border-line">
          <div
            className="shell flex flex-col items-start gap-1 pt-5 pb-4.5 text-xs text-mute md:min-h-20 md:flex-row md:items-center md:justify-between md:gap-6 md:py-3"
            style={{ paddingRight: CLEAR_OF_DRAFT_TOGGLE }}
          >
            <p className="text-balance tabular-nums">
              {data.layout?.copyrightText}
            </p>
            <Suspense>
              <LanguageSelector
                languages={data._site.locales}
                currencySymbol={generalInterface?.currencySymbol}
                placement="above-start-md-end"
                chevron
                className="-mx-2.5 min-h-11 px-2.5 text-ink-2 hover:text-white aria-expanded:text-white [&>svg:first-child]:size-4"
              />
            </Suspense>
          </div>
        </div>
      </footer>

      {/* After the footer, so the sticky bar comes to rest under it */}
      {cookieNoticeVisible && <CookieNotice cookieNotice={cookieNotice} />}
    </>
  );
};

export default Footer;
