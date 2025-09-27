import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';
import DatoContentLinkClient from '@/components/preview/DatoContentLinkClient';
import type {
  AsyncGlobalPageProps,
  GlobalPageProps,
} from '@/utils/globalPageProps';
import { draftMode } from 'next/headers';
import { Suspense } from 'react';

type Params = AsyncGlobalPageProps<GlobalPageProps> & {
  children: React.ReactNode;
};

export default async function RootLayout({ children, params }: Params) {
  const resolvedParams = (await params) as GlobalPageProps['params'] | undefined;

  const lng = resolvedParams?.lng ?? 'en';
  const { isEnabled: isDraft } = await draftMode();
  const baseEditingUrl = process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL;

  return (
    <html lang={lng}>
      <body className="tracking-tight antialiased" suppressHydrationWarning>
        {children}
        <Suspense fallback={null}>
          <ScrollToTop isDraft={isDraft} />
          {isDraft && baseEditingUrl ? (
            <DatoContentLinkClient baseEditingUrl={baseEditingUrl} />
          ) : null}
        </Suspense>
      </body>
    </html>
  );
}
