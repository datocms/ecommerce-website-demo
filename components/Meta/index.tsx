import type { LayoutQuery } from '@/graphql/types/graphql';

type PropTypes = {
  data: LayoutQuery;
};

export default function Meta({ data }: PropTypes) {
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
