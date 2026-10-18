import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { draftMode } from 'next/headers';
import ContentLink from '@/components/ContentLink';
import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';

const sans = Figtree({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-figtree',
  display: 'swap',
});

// Variable weight plus the optical-size axis, so big headlines get the display cut
const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
});

type Params = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Params) {
  const { isEnabled: isDraft } = await draftMode();
  return (
    <html className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-svh flex-col bg-cream font-sans text-base text-ink antialiased">
        {children}
        <ScrollToTop isDraft={isDraft} />
        {isDraft && <ContentLink />}
      </body>
    </html>
  );
}
