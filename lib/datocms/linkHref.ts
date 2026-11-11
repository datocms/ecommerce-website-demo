import { stripStega } from '@datocms/content-link';
import { type FragmentOf, graphql, readFragment } from './graphql';
import { recordToWebsiteRoute } from './recordToWebsiteRoute';

// The record a link points to (a link block's `record`, or a Structured Text `itemLink`), with
// what its href needs. On RecordInterface, so every one of those unions can spread it.
export const LinkRecordFragment = graphql(/* GraphQL */ `
  fragment LinkRecordFragment on RecordInterface {
    id
    _modelApiKey
    ... on ProductRecord {
      slug
    }
    ... on LegalPageRecord {
      slug
    }
  }
`);

type LinkRecord = FragmentOf<typeof LinkRecordFragment>;

// A link block (SimpleButton, LinkItem or FooterItem): `page` counts only without a `record`
type LinkTarget = {
  record: LinkRecord | null;
  page: string | null;
};

/** The page of a linked record: the catalog filtered by it, a product page or a legal page. */
export function recordHref(lng: string, record: LinkRecord) {
  const data = readFragment(LinkRecordFragment, record);
  return recordToWebsiteRoute(
    { id: data.id, slug: 'slug' in data ? data.slug : undefined },
    data._modelApiKey,
    lng,
  );
}

// `page` is a text field, so draft values carry Content Link stega characters, which must stay
// out of the comparison
function pageHref(lng: string, page: string | null) {
  switch (stripStega(page ?? '')) {
    case 'products':
      return `/${lng}/products`;
    case 'sale':
      // The catalog, products on sale first
      return `/${lng}/products?orderBy=onSale_DESC`;
    case 'showcase':
      return `/${lng}/showcase`;
    case 'stores':
      return `/${lng}/stores`;
    default:
      return null;
  }
}

/** A link block's href, or null when it has neither a record nor a page. */
export function linkHref(lng: string, link: LinkTarget) {
  return link.record ? recordHref(lng, link.record) : pageHref(lng, link.page);
}
