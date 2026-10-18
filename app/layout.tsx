import { Geist } from 'next/font/google';
import { draftMode } from 'next/headers';
import ContentLink from '@/components/ContentLink';
import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';

// Variable weight: UI text at 400-600, display headings at 600
const sans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
  display: 'swap',
});

type Params = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Params) {
  const { isEnabled: isDraft } = await draftMode();
  return (
    <html className={sans.variable}>
      <body className="flex min-h-svh flex-col bg-white font-sans text-base text-ink antialiased">
        {children}
        <ScrollToTop isDraft={isDraft} />
        {isDraft && <ContentLink />}
      </body>
    </html>
  );
}
