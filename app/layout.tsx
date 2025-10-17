/**
 * Root layout
 * - Mounts the Visual Editing bridge before rendering page content so the
 *   realtime layer can reuse a single controller.
 * - Keeps middleware free from visual-editing concerns; draft detection lives
 *   here via `draftMode()`.
 */
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
        {/* Mount the visual-editing controller before page content so
            realtime listeners find it on first render. */}
        {baseEditingUrl ? (
          <DatoVisualEditingBridge
            baseEditingUrl={baseEditingUrl}
            environment={datoEnvironment}
            isDraft={isDraft}
          />
        ) : null}
        {children}
        <Suspense fallback={null}>
          <ScrollToTop isDraft={isDraft} />
        </Suspense>
      </body>
    </html>
  );
}
