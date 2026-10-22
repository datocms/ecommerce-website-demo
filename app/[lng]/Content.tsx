import CustomColor from '@/components/Layout/CustomColor';
import DocumentLang from '@/components/Layout/DocumentLang';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  const lang = globalPageProps.params.lng.replaceAll('_', '-');
  // <html> is rendered by the root layout, outside [lng]: this wrapper carries lang in the
  // server HTML, and DocumentLang syncs <html lang> after hydration.
  return (
    <div lang={lang} className="contents">
      <DocumentLang lang={lang} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:inline-flex focus:min-h-13 focus:items-center focus:bg-ink focus:px-6 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header data={data} globalPageProps={globalPageProps} />
      {data.layout?.mainColor && (
        <CustomColor
          r={data.layout.mainColor.red}
          g={data.layout.mainColor.green}
          b={data.layout.mainColor.blue}
        />
      )}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer globalPageProps={globalPageProps} data={data} />
    </div>
  );
};

export default Content;
