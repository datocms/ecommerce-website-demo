import type { Query as LayoutQuery } from '@/app/[lng]/meta';

type Props = {
  data: LayoutQuery;
};

// Site-wide fallbacks: the title and description from the DatoCMS global SEO settings, the
// site favicon, and the viewport
export default function SiteMeta({ data }: Props) {
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
