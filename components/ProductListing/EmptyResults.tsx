import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import LinkPending from '@/components/Motion/LinkPending';
import { readFragment } from '@/lib/datocms/graphql';
import { productsPath } from '@/lib/routes';
import {
  type ProductListingLabels,
  ProductListingLabelsFragment,
} from './fragments';

type Props = {
  /** Products matching the filters, across all pages */
  count: number;
  totalPages: number;
  lng: string;
  /** The current listing URL without ?page */
  firstPageHref: string;
  labels: ProductListingLabels;
};

// Shown in place of the grid: either nothing matches, or the page number is past the last page
export default function EmptyResults({
  count,
  totalPages,
  lng,
  firstPageHref,
  labels,
}: Props) {
  const {
    noResultsTitle,
    noResultsText,
    viewAllProducts,
    emptyPageTitle,
    emptyPageText,
    backToFirstPage,
  } = readFragment(ProductListingLabelsFragment, labels) ?? {};
  const noMatches = count === 0;
  const { title, body, href, cta } = noMatches
    ? {
        title: noResultsTitle,
        body: noResultsText,
        href: productsPath(lng),
        cta: viewAllProducts,
      }
    : {
        title: emptyPageTitle,
        body: emptyPageText?.replace('{page}', String(totalPages)),
        href: firstPageHref,
        cta: backToFirstPage,
      };

  return (
    <div className="flex flex-col items-center bg-mist px-6 py-20 text-center lg:py-28">
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center bg-white [&>svg]:size-6.5"
      >
        <MagnifyingGlassIcon />
      </span>
      <h2 className="title-card mt-8 max-w-[14em] text-balance">{title}</h2>
      <p className="mt-4 max-w-[40ch] text-md text-pretty text-ink-2 tabular-nums">
        {body}
      </p>
      <Link href={href} className="btn mt-8">
        {!noMatches && <ArrowLeftIcon aria-hidden="true" />}
        {cta}
        {noMatches && <ArrowRightIcon aria-hidden="true" />}
        <LinkPending />
      </Link>
    </div>
  );
}
