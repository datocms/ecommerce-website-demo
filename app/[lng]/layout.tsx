import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import ServerOnlyScript from '@/components/Common/ServerOnlyScript';
import ContentLink from '@/components/DraftMode/ContentLink';
import DraftModeToggle from '@/components/DraftMode/DraftModeToggle';
import { RESTORE_DISMISSED_ANNOUNCEMENT } from '@/lib/dismissedAnnouncement';
import type { GlobalPageProps } from '@/lib/globalPageProps';
import { getAvailableLocales, toLanguageTag } from '@/lib/i18n';
import { setRequestLocale } from '@/lib/requestLocale';
import { getSiteUrl } from '@/lib/siteUrl';
import '@/styles/global.css';

const sans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
  display: 'swap',
});

type Props = GlobalPageProps & {
  children: React.ReactNode;
};

// Prerenders every page that has no other dynamic segment, once per locale
export async function generateStaticParams() {
  const locales = await getAvailableLocales();
  return locales.map((lng) => ({ lng }));
}

// Makes the canonical, hreflang and share-image URLs absolute
export function generateMetadata(): Metadata {
  return { metadataBase: new URL(getSiteUrl()) };
}

// The root layout sits under [lng], so <html> carries the page's language
export default async function RootLayout({ children, params }: Props) {
  const { lng } = await params;
  const locales = await getAvailableLocales();
  // proxy.ts only lets file-like paths through without a locale: they get the default 404
  if (!locales.some((locale) => locale === lng)) notFound();
  setRequestLocale(lng);

  const { isEnabled: isDraft } = await draftMode();
  return (
    // The inline script below adds a data attribute to <html> before hydration
    <html
      lang={toLanguageTag(lng)}
      className={sans.variable}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col bg-white font-sans text-base text-ink antialiased">
        <ServerOnlyScript code={RESTORE_DISMISSED_ANNOUNCEMENT} />
        {children}
        <DraftModeToggle isDraft={isDraft} />
        {isDraft && <ContentLink />}
      </body>
    </html>
  );
}
