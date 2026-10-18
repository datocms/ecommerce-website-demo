import { notFound } from 'next/navigation';
import DividerSection from '@/components/Sections/DividerSection';
import Hero from '@/components/Sections/Hero';
import MaterialShowcase from '@/components/Sections/MaterialShowcase';
import ProductShowcase from '@/components/Sections/ProductShowcase';
import TestimonialsSection from '@/components/Sections/Testimonials';
import { PAGE_VARS } from '@/components/Sections/ui';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import type { PageProps, Query } from './meta';

type Section = NonNullable<Query['home']>['sections'][number];
type ShowcaseSection = Extract<
  Section,
  { __typename: 'CollectionCardShowcaseSectionRecord' }
>;

// Consecutive collection showcases render as one stack of season bands
function groupShowcases(sections: Section[]) {
  const groups: (Section | ShowcaseSection[])[] = [];
  for (const section of sections) {
    const last = groups[groups.length - 1];
    if (section.__typename !== 'CollectionCardShowcaseSectionRecord') {
      groups.push(section);
    } else if (Array.isArray(last)) {
      last.push(section);
    } else {
      groups.push([section]);
    }
  }
  return groups;
}

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.home) {
    notFound();
  }

  const { generalInterface, allProducts } = data;
  // The latest products rail runs under the first divider only
  const railDividerId = data.home.sections.find(
    (section) => section.__typename === 'DividerSectionRecord',
  )?.id;

  return (
    <div className={PAGE_VARS}>
      {groupShowcases(data.home.sections).map((group) => {
        if (Array.isArray(group)) {
          return (
            <div
              key={group[0].id}
              className="shell grid grid-cols-1 gap-4 pt-(--section-gap) lg:gap-5"
            >
              {group.map((section, index) => (
                <ProductShowcase
                  fragment={section}
                  globalPageProps={globalPageProps}
                  filled={index % 2 === 0}
                  key={section.id}
                />
              ))}
            </div>
          );
        }

        switch (group.__typename) {
          case 'HeroSectionRecord':
            return (
              <Hero
                fragment={group}
                globalPageProps={globalPageProps}
                shopNow={generalInterface?.shopNow}
                key={group.id}
              />
            );

          case 'DividerSectionRecord':
            return (
              <DividerSection
                globalPageProps={globalPageProps}
                fragment={group}
                products={group.id === railDividerId ? allProducts : undefined}
                currencySymbol={generalInterface?.currencySymbol}
                saleLabel={generalInterface?.sale}
                key={group.id}
              />
            );

          case 'TestimonialSectionRecord':
            return <TestimonialsSection fragment={group} key={group.id} />;

          case 'MaterialShowcaseSectionRecord':
            return (
              <MaterialShowcase
                globalPageProps={globalPageProps}
                fragment={group}
                shopNow={generalInterface?.shopNow}
                key={group.id}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default Content;
