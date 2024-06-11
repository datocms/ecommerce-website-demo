import '@/styles/global.css';
import { SiteLocale } from '@/graphql/types/graphql';
import getAvailableLocales from '@/app/i18n/settings';
import { GlobalPageProps } from '@/utils/globalPageProps';
import ScrollToTop from '@/components/ScrollToTop';
import { draftMode } from 'next/headers';

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
  params: { lng },
}: Params) {
  const { isEnabled: isDraft } = draftMode();
  return (
    <html lang={lng}>
      <body className={`tracking-tight antialiased`}>{children}</body>
      <ScrollToTop isDraft={isDraft} />
    </html>
  );
}
