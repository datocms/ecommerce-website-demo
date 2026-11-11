import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import CookieNotice from '@/components/Layout/CookieNotice';
import { readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import FooterBrand from './FooterBrand';
import FooterColumns from './FooterColumns';
import LegalBar from './LegalBar';
import NewsletterSignup from './NewsletterSignup';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

export default function Footer({ data, globalPageProps }: Props) {
  const { lng } = globalPageProps.params;
  const generalInterface = data.generalInterface;
  const footerTitle = data.layout?.footerTitle;
  const footerSubtitle = data.layout?.footerSubtitle;
  const copyrightText = data.layout?.copyrightText;
  const footerLogoImage = data.layout?.footerLogo?.responsiveImage;
  const footerLogo =
    footerLogoImage && readFragment(ResponsiveImageFragment, footerLogoImage);
  const showNewsletter = !!generalInterface?.displayNewsletterFooter;
  const columns = data.layout?.footerColumns ?? [];
  const socials = data.layout?.socialMediaLinks ?? [];
  const cookieNotice = data.layout?.cookieNotice;

  return (
    <>
      <footer className="surface-ink mt-(--section-gap)">
        {showNewsletter && (
          <>
            <NewsletterSignup generalInterface={generalInterface} />
            <div className="shell">
              <div className="h-px bg-line" />
            </div>
          </>
        )}

        <div
          className={`shell grid gap-12 pb-16 lg:grid-cols-12 lg:gap-4 ${showNewsletter ? 'pt-12 md:pt-14' : 'pt-(--band-y)'}`}
        >
          <FooterBrand
            lng={lng}
            title={footerTitle}
            logo={footerLogo}
            subtitle={footerSubtitle}
            socials={socials}
          />
          {columns.length > 0 && <FooterColumns lng={lng} columns={columns} />}
        </div>

        <LegalBar
          copyrightText={copyrightText}
          locales={data._site.locales}
          currencySymbol={generalInterface?.currencySymbol}
          currencySymbols={generalInterface?._allCurrencySymbolLocales}
        />
      </footer>

      {/* After the footer, so the sticky bar comes to rest under it */}
      {cookieNotice && <CookieNotice cookieNotice={cookieNotice} />}
    </>
  );
}
