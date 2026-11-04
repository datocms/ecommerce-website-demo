import { Geist } from 'next/font/google';
import { draftMode } from 'next/headers';
import ContentLink from '@/components/DraftMode/ContentLink';
import DraftModeToggle from '@/components/DraftMode/DraftModeToggle';
import '@/styles/global.css';

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
    // lang is set per locale in app/[lng]/Content.tsx
    <html className={sans.variable}>
      <body className="flex min-h-svh flex-col bg-white font-sans text-base text-ink antialiased">
        {children}
        <DraftModeToggle isDraft={isDraft} />
        {isDraft && <ContentLink />}
      </body>
    </html>
  );
}
