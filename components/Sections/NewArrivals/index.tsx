import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SectionTitle from '@/components/Common/SectionTitle';
import RailControls from '@/components/Rail/RailControls';
import RailProgress from '@/components/Rail/RailProgress';
import type { FragmentOf } from '@/lib/datocms/graphql';
import { productsPath } from '@/lib/routes';
import type { ProductRailFragment } from './fragments';
import ProductRail from './ProductRail';

type Props = {
  /** The newest products, already in order */
  products: FragmentOf<typeof ProductRailFragment>[];
  lng: string;
  /** General interface "New arrivals" label */
  title?: string | null;
  /** General interface "Shop now" label; the link goes to the catalog */
  shopNow?: string | null;
  currencySymbol?: string | null;
  saleLabel?: string | null;
};

const SECTION_ID = 'new-arrivals';

// Not a CMS block: home/meta.ts fetches the products, home/Content.tsx decides the placement
export default function NewArrivals({
  products,
  lng,
  title,
  shopNow,
  currencySymbol,
  saleLabel,
}: Props) {
  if (products.length === 0) return null;
  const titleId = `${SECTION_ID}-title`;
  const railId = `${SECTION_ID}-rail`;
  const action = shopNow
    ? { label: shopNow, href: productsPath(lng) }
    : undefined;
  const controls = <RailControls railId={railId} />;

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className="pt-(--section-gap)"
    >
      {title ? (
        <SectionTitle
          className="shell mb-8 lg:mb-12"
          id={titleId}
          title={title}
          action={action}
          aside={controls}
        />
      ) : (
        <div className="shell mb-8 flex items-center justify-end gap-6 lg:mb-12">
          {action && (
            <Link href={action.href} className="group tlink">
              {action.label}
              <ArrowRightIcon aria-hidden="true" className="stroke-2" />
            </Link>
          )}
          {controls}
        </div>
      )}
      <ProductRail
        id={railId}
        products={products}
        lng={lng}
        currencySymbol={currencySymbol ?? ''}
        saleLabel={saleLabel}
      />
      <div className="shell">
        <RailProgress railId={railId} className="mt-10" />
      </div>
    </section>
  );
}
