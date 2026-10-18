import { stripStega } from '@datocms/content-link';
import SectionTitle from '@/components/Common/SectionTitle';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import ProductRail from '../ProductRail';
import type { ProductRailFragment } from '../ProductRail/fragments';
import RailControls from '../RailControls';
import { DividerSectionFragment } from './fragments';

type Props = {
  fragment: FragmentOf<typeof DividerSectionFragment>;
  globalPageProps: ResolvedGlobalPageProps;
  /** Latest products, shown as a rail under the section title */
  products?: FragmentOf<typeof ProductRailFragment>[];
  currencySymbol?: string | null;
  saleLabel?: string | null;
};

export default function DividerSection({
  fragment,
  globalPageProps,
  products = [],
  currencySymbol,
  saleLabel,
}: Props) {
  const { id, preTitle, subtitle, title, button } = readFragment(
    DividerSectionFragment,
    fragment,
  );
  const { lng } = globalPageProps.params;
  const cta = button[0];
  const titleId = `${id}-title`;
  const railId = `${id}-rail`;
  const hasRail = products.length > 0;

  return (
    <section aria-labelledby={titleId} className="pt-(--section-gap)">
      <SectionTitle
        className="shell"
        id={titleId}
        eyebrow={preTitle}
        title={title}
        description={subtitle}
        action={
          cta
            ? {
                label: cta.label,
                href: `/${lng}/${stripStega(cta.slug ?? '')}`,
              }
            : undefined
        }
        aside={hasRail ? <RailControls railId={railId} /> : undefined}
      />
      {hasRail && (
        <ProductRail
          id={railId}
          products={products}
          lng={lng}
          currencySymbol={currencySymbol ?? ''}
          saleLabel={saleLabel}
          className="mt-8 lg:mt-12"
        />
      )}
    </section>
  );
}
