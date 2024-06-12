import getAvailableLocales from '@/app/i18n/settings';
import Footer from '@/components/Footer';
import HeaderRenderer from '@/components/Header/HeaderRenderer';
import type { SiteLocale } from '@/graphql/types/graphql';
import '@/styles/global.css';
import { draftMode } from 'next/headers';

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
  return <>{children}</>;
}
