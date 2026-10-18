import CustomColor from '@/components/Common/CustomColor';
import DocumentLang from '@/components/Common/DocumentLang';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Meta from '@/components/Meta';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  const lang = globalPageProps.params.lng.replaceAll('_', '-');
  return (
    <div lang={lang} className="contents">
      <DocumentLang lang={lang} />
      <Meta data={data} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-base focus:font-bold focus:text-cream focus:outline-ink"
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
