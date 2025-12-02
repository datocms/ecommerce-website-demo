import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';
import { draftMode } from 'next/headers';

type Params = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Params) {
  const { isEnabled: isDraft } = await draftMode();
  return (
    <html>
      <body className={'tracking-tight antialiased'}>
        {children}
        <ScrollToTop isDraft={isDraft} />
      </body>
    </html>
  );
}
