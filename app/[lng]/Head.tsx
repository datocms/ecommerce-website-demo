import queryDatoCMS from '@/utils/queryDatoCMS';
import { getFallbackLocale } from '../i18n/settings';
import { MetaDocument, SiteLocale } from '@/graphql/generated';

export default async function Head() {
  const fallbackLng = await getFallbackLocale();
  const data = await queryDatoCMS(MetaDocument, {
    fallbackLocale: [fallbackLng],
  });

  return (
    <>
      <title>{data._site.globalSeo?.fallbackSeo?.title}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={
          data._site.globalSeo?.fallbackSeo?.description ||
          'Visit https://www.datocms.com/marketplace/starters for more starters'
        }
      />
      <link rel="icon" href={data._site.favicon?.url} />
    </>
  );
}
