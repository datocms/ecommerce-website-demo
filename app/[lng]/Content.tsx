import CustomColor from '@/components/Common/CustomColor';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Meta from '@/components/Meta';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

// Shared layout view: reused by both server and client renderers.
export function LayoutContentView({
  data,
  children,
  ...globalPageProps
}: PageProps & {
  data: Query;
}) {
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
}

// Server component entry point.
const Content: ContentPage<PageProps, Query> = (props) => {
  return <LayoutContentView {...props} />;
};

export default Content;
