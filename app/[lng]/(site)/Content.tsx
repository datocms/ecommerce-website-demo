import CustomColor from '@/components/Layout/CustomColor';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  children,
  ...globalPageProps
}) => {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:inline-flex focus:min-h-13 focus:items-center focus:bg-ink focus:px-6 focus:text-sm focus:font-semibold focus:text-white"
      >
        {data.generalInterface?.skipToContent}
      </a>
      <Header data={data} globalPageProps={globalPageProps} />
      {data.layout?.accentColor && (
        <CustomColor
          r={data.layout.accentColor.red}
          g={data.layout.accentColor.green}
          b={data.layout.accentColor.blue}
        />
      )}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer globalPageProps={globalPageProps} data={data} />
    </>
  );
};

export default Content;
