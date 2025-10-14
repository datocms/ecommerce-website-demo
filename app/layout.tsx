import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';
import DatoVisualEditingBridge from '@/components/preview/DatoVisualEditingBridge';
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
  const datoEnvironment = process.env.NEXT_PUBLIC_DATO_ENVIRONMENT;

  return (
    <html lang={lng}>
      <body className="tracking-tight antialiased" suppressHydrationWarning>
        {children}
        <Suspense fallback={null}>
          <ScrollToTop isDraft={isDraft} />
          {baseEditingUrl ? (
            <DatoVisualEditingBridge
              baseEditingUrl={baseEditingUrl}
              environment={datoEnvironment}
              isDraft={isDraft}
            />
          ) : null}
        </Suspense>
      </body>
    </html>
  );
}
