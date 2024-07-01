import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { draftMode } from 'next/headers';

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export default function RootLayout({ children, params: { lng } }: Params) {
  const { isEnabled: isDraft } = draftMode();
  return (
    <html lang={lng}>
      <body className={'tracking-tight antialiased'}>{children}</body>
      <ScrollToTop isDraft={isDraft} />
    </html>
  );
}
