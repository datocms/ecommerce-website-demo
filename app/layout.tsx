import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';
import DatoContentLinkClient from '@/components/preview/DatoContentLinkClient';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { draftMode } from 'next/headers';

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export default function RootLayout({ children, params: { lng } }: Params) {
  const { isEnabled: isDraft } = draftMode();
  const baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL;

  return (
    <html lang={lng}>
      <body className={'tracking-tight antialiased'}>
        {children}
        <ScrollToTop isDraft={isDraft} />
        {isDraft && baseEditingUrl ? (
          <DatoContentLinkClient baseEditingUrl={baseEditingUrl} />
        ) : null}
      </body>
    </html>
  );
}
