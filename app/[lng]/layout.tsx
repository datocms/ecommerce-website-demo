import ScrollToTop from '@/components/ScrollToTop';
import '@/styles/global.css';
import { draftMode } from 'next/headers';
import { CustomColorDocument, SiteLocale } from '@/graphql/generated';
import getAvailableLocales from '@/app/i18n/settings';
import CustomColor from '@/components/Common/CustomColor';
import queryDatoCMS from '@/utils/queryDatoCMS';
import Footer from '@/components/Footer';
import HeaderRenderer from '@/components/Header/HeaderRenderer';

type Params = {
  children: React.ReactNode;
  params: {
    lng: SiteLocale;
  };
};

export async function generateStaticParams() {
  const languages = await getAvailableLocales();
  return languages.map((language) => {
    language;
  });
}

export default async function RootLayout({
  children,
  params: { lng },
}: Params) {
  const { isEnabled } = draftMode();
  const data = await queryDatoCMS(CustomColorDocument, {}, isEnabled);

  return (
    <>
      <HeaderRenderer lng={lng} isDraft={isEnabled} />
      <CustomColor
        r={data.layout?.mainColor.red || 135}
        g={data.layout?.mainColor.green || 235}
        b={data.layout?.mainColor.blue || 206}
      />
      {children}
      <Footer lng={lng} />
      <ScrollToTop lng={lng} isDraft={isEnabled} />
    </>
  );
}
