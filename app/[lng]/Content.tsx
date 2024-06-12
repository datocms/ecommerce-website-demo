import CustomColor from '@/components/Common/CustomColor';
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
  return (
    <>
      <Meta data={data} />
      <Header data={data} globalPageProps={globalPageProps} />
      <CustomColor
        r={data.layout?.mainColor.red || 74}
        g={data.layout?.mainColor.green || 247}
        b={data.layout?.mainColor.blue || 108}
      />
      {children}
      <Footer globalPageProps={globalPageProps} data={data} />
    </>
  );
};

export default Content;
