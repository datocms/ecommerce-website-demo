import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import SectionTitle from '@/components/Common/SectionTitle';
import type { FragmentOf } from '@/lib/datocms/graphql';
import ProductRail from '../ProductRail';
import type { ProductRailFragment } from '../ProductRail/fragments';
import RailControls from '../RailControls';
import RailProgress from '../RailProgress';

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

const ID = 'new-arrivals';

// The latest products as a rail that runs off the right edge, with the title, a catalog link
// and the arrows above it and a progress track under it
export default function NewArrivals({
  products,
  lng,
  title,
  shopNow,
  currencySymbol,
  saleLabel,
}: Props) {
  if (products.length === 0) return null;
  const titleId = `${ID}-title`;
  const railId = `${ID}-rail`;
  const action = shopNow
    ? { label: shopNow, href: `/${lng}/products` }
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
        // Without a title there is no heading to label the section, only the link and arrows
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
