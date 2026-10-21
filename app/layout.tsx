import { Geist } from 'next/font/google';
import { draftMode } from 'next/headers';
import ContentLink from '@/components/DraftMode/ContentLink';
import DraftModeToggle from '@/components/DraftMode/DraftModeToggle';
import '@/styles/global.css';

// Variable weight: UI text at 400-600, display headings at 600
const sans = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const { isEnabled: isDraft } = await draftMode();
  return (
    // lang is set per locale by DocumentLang: this layout renders above the [lng] segment
    <html className={sans.variable}>
      <body className="flex min-h-svh flex-col bg-white font-sans text-base text-ink antialiased">
        {children}
        <DraftModeToggle isDraft={isDraft} />
        {isDraft && <ContentLink />}
      </body>
    </html>
  );
}
