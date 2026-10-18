'use client';

import { stripStega } from '@datocms/content-link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense, useEffect, useRef } from 'react';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import SvgRenderer from '../Common/SvgRenderer';
import CookiesNotice, { useCookieNoticeOpen } from '../Header/CookiesNotice';
import LanguageSelector from '../Header/LanguageSelector';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

// The giant wordmark, fitted to the content width. Bricolage has an optical-size axis,
// so glyph widths are not linear in font size: measure the ink at the current size and
// rescale until it converges, then shift the ink onto the content's left edge.
const Wordmark = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const plain = stripStega(text).trim();

  useEffect(() => {
    const element = ref.current;
    const context = document.createElement('canvas').getContext('2d');
    if (!element || !context || !plain) return;

    let width = 0;
    const fit = () => {
      width = element.clientWidth;
      if (!width) return;
      let size = 100;
      let metrics = context.measureText(plain);
      element.style.transform = '';
      for (let step = 0; step < 5; step++) {
        element.style.fontSize = `${size}px`;
        const style = getComputedStyle(element);
        context.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
        context.letterSpacing = style.letterSpacing;
        metrics = context.measureText(plain);
        const ink =
          metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        if (!ink) return;
        size = (size * width) / ink;
      }
      element.style.fontSize = `${size.toFixed(2)}px`;
      element.style.transform = `translateX(${metrics.actualBoundingBoxLeft.toFixed(2)}px)`;
    };

    fit();
    document.fonts.ready.then(fit);
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== width) fit();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [plain]);

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="giant text-sage select-none"
      // Close to the fitted size before the script runs: the content width at about
      // 0.43em per glyph
      style={{
        fontSize: `calc((min(100vw, 90rem) - 2 * var(--gutter)) / ${Math.max(plain.length, 1) * 0.43})`,
      }}
    >
      {text}
    </p>
  );
};

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
  const cookieBar = cookieNoticeOpen && !!cookieNotice;

  return (
    <>
      <footer className="surface-forest mt-(--section-gap) rounded-t-card">
        <div className="shell pt-16 lg:pt-20">
          <div className="grid gap-12 xl:grid-cols-12 xl:gap-x-10">
            {showNewsletter && (
              <div className="xl:col-span-5">
                {generalInterface?.newsletter && (
                  <p className="pretitle bg-butter">
                    {generalInterface.newsletter}
                  </p>
                )}
                <h2 className="title-lg mt-6 max-w-[12em]">
                  {generalInterface?.subscribeToOurNewsletter}
                </h2>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-8 flex max-w-120 gap-2"
                >
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    {generalInterface?.emailPlaceholder ?? 'Email'}
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder={generalInterface?.emailPlaceholder ?? 'Email'}
                    className="input-line h-14 min-w-0 flex-1 px-6"
                  />
                  <button type="submit" className="btn-butter h-14 shrink-0">
                    {generalInterface?.newsletterButton}
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="stroke-[2.4]"
                    />
                  </button>
                </form>
              </div>
            )}

            {columns.length > 0 && (
              <div
                className={[
                  'grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4',
                  showNewsletter
                    ? 'xl:col-span-6 xl:col-start-7 xl:pt-3'
                    : 'xl:col-span-12',
                ].join(' ')}
              >
                {columns.map((column) => (
                  <div key={column.id} className="min-w-0">
                    <h2 className="eyebrow hyphens-auto wrap-break-word text-butter">
                      {column.label}
                    </h2>
                    <ul className="mt-5 grid gap-3">
                      {column.footerItem.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/${lng}/${stripStega(item.slug)}`}
                            className="text-base hyphens-auto wrap-break-word text-cream/85 transition-colors duration-150 hover:text-white"
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

          {/* Brand row: logo tile and subtitle, socials on the right */}
          <div className="mt-16 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
            <div className="flex items-center gap-4">
              <Link
                href={`/${lng}/home`}
                aria-label={
                  footerTitle
                    ? stripStega(footerTitle)
                    : footerLogo?.alt
                      ? undefined
                      : 'Home'
                }
                className="grid size-14 shrink-0 place-items-center rounded-image bg-cream"
              >
                {footerLogo && (
                  <RSCImage
                    data={footerTitle ? { ...footerLogo, alt: '' } : footerLogo}
                    usePlaceholder={false}
                    sizes="40px"
                    imgClassName="mix-blend-multiply"
                    imgStyle={{ height: '2.5rem', width: 'auto' }}
                  />
                )}
              </Link>
              {data.layout?.footerSubtitle && (
                <p className="max-w-[30ch] text-md leading-snug font-medium text-pretty text-cream/85">
                  {data.layout.footerSubtitle}
                </p>
              )}
            </div>

            {socials.length > 0 && (
              <div className="flex gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      stripStega(social.name ?? '') || stripStega(social.url)
                    }
                    className="icon-btn size-12 bg-white/10 text-cream ring-1 ring-white/15 hover:bg-butter hover:bg-none hover:text-ink"
                  >
                    <SvgRenderer url={social.icon.url} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerTitle && (
            <div className="mt-10 overflow-x-clip pb-4 lg:mt-14 lg:pb-6">
              <Wordmark text={footerTitle} />
            </div>
          )}
        </div>

        {/* Legal bar: while the fixed draft toggle shows (it steps aside for the cookie
            notice), the bar is the toggle plus its bottom offset above and below, so at
            the page end the toggle comes to rest centred in it, right of the language switch.
            Phones stack the copyright over the switch, which lines up with the toggle. */}
        <div className="bg-forest-deep">
          <div
            className={[
              'shell flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-xs text-cream/75',
              cookieBar
                ? ''
                : 'min-h-[calc(3rem+2*var(--inset))] max-sm:flex-col max-sm:items-start max-sm:justify-center max-sm:pt-4 max-sm:pb-[calc(var(--inset)+0.125rem)]',
            ].join(' ')}
            style={{
              paddingRight:
                'max(var(--gutter), calc(var(--draft-toggle-w, 0px) + min(var(--draft-toggle-w, 0px), var(--inset)) + var(--gutter) - max(0px, (100vw - 90rem) / 2)))',
            }}
          >
            <p className="text-balance tabular-nums">
              {data.layout?.copyrightText}
            </p>
            {/* On the right edge even when it wraps; on the left under the copyright when stacked */}
            <div className={cookieBar ? 'ml-auto' : 'ml-auto max-sm:ml-0'}>
              <Suspense>
                <LanguageSelector
                  languages={data._site.locales}
                  currencySymbol={generalInterface?.currencySymbol}
                  placement={cookieBar ? 'above-end' : 'above-start-sm-end'}
                  tone="dark"
                  className="-mx-3 min-h-11 rounded-full px-3 text-cream hover:bg-white/10 aria-expanded:bg-white/10"
                />
              </Suspense>
            </div>
          </div>
        </div>
      </footer>

      {/* After the footer, so the sticky card comes to rest under it */}
      {cookieBar && <CookiesNotice cookieNotice={cookieNotice} />}
    </>
  );
};

export default Footer;
