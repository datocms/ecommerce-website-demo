import { stripStega } from '@datocms/content-link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { PAGE_VARS } from '@/components/Common/styles';
import CollectionCardShowcase from '@/components/Sections/CollectionCardShowcase';
import { CollectionCardShowcaseFragment } from '@/components/Sections/CollectionCardShowcase/fragments';
import DividerSection from '@/components/Sections/DividerSection';
import Hero from '@/components/Sections/Hero';
import { HeroSectionFragment } from '@/components/Sections/Hero/fragments';
import MaterialShowcase from '@/components/Sections/MaterialShowcase';
import NewArrivals from '@/components/Sections/NewArrivals';
import TestimonialsSection from '@/components/Sections/Testimonials';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';

type Section = NonNullable<Query['home']>['sections'][number];
type ShowcaseSection = Extract<
  Section,
  { __typename: 'CollectionCardShowcaseSectionRecord' }
>;
type HeroSection = Extract<Section, { __typename: 'HeroSectionRecord' }>;
type Menu = NonNullable<Query['layout']>['menu'];

// Consecutive collection showcases render as one group of season columns
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

// The navigation column that lists the group's lead collections ("Seasons") names the group
function seasonsLabel(menu: Menu, showcases: ShowcaseSection[]) {
  const leads = showcases.flatMap(
    (section: FragmentOf<typeof CollectionCardShowcaseFragment>) => {
      const lead = readFragment(CollectionCardShowcaseFragment, section)
        .collection[0];
      return lead ? [lead.id] : [];
    },
  );
  let best: { label: string; matches: number } | undefined;
  for (const entry of menu) {
    if (entry.__typename !== 'DropdownMenuRecord') continue;
    for (const column of entry.column) {
      const ids = new Set(column.item.map((item) => item.id));
      const matches = leads.filter((lead) => ids.has(lead)).length;
      if (matches > (best?.matches ?? 0)) {
        best = { label: column.label, matches };
      }
    }
  }
  return best?.label;
}

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.home) {
    notFound();
  }

  const { generalInterface, allProducts, layout } = data;
  const { lng } = globalPageProps.params;
  const menu = layout?.menu ?? [];
  const groups = groupShowcases(data.home.sections);

  // The hero's second photo sits beside the first divider (in the hero when there is none)
  const hero: FragmentOf<typeof HeroSectionFragment> | undefined =
    data.home.sections.find(
      (section): section is HeroSection =>
        section.__typename === 'HeroSectionRecord',
    );
  const dividerImage = hero
    ? readFragment(HeroSectionFragment, hero).additionalImage.responsiveImage
    : null;
  const firstDivider = groups.find(
    (group) =>
      !Array.isArray(group) && group.__typename === 'DividerSectionRecord',
  );

  // The newest products follow the season group, or the first divider when there is none (the
  // end of the page when there is neither)
  const railAfter =
    groups.find((group) => Array.isArray(group)) ?? firstDivider;
  const catalogLink = menu.find(
    (entry) =>
      entry.__typename === 'LinkItemRecord' &&
      stripStega(entry.slug ?? '') === 'products',
  );
  const allProductsAction =
    catalogLink?.__typename === 'LinkItemRecord'
      ? { label: catalogLink.label, href: `/${lng}/products` }
      : undefined;

  const newArrivals = (
    <NewArrivals
      products={allProducts}
      lng={lng}
      title={generalInterface?.newArrivals}
      shopNow={generalInterface?.shopNow}
      currencySymbol={generalInterface?.currencySymbol}
      saleLabel={generalInterface?.sale}
    />
  );

  return (
    <div className={PAGE_VARS}>
      {groups.map((group) => {
        if (Array.isArray(group)) {
          return (
            <Fragment key={group[0].id}>
              <CollectionCardShowcase
                id={group[0].id}
                sections={group}
                globalPageProps={globalPageProps}
                title={seasonsLabel(menu, group)}
                action={allProductsAction}
              />
              {group === railAfter && newArrivals}
            </Fragment>
          );
        }

        switch (group.__typename) {
          case 'HeroSectionRecord':
            return (
              <Hero
                fragment={group}
                globalPageProps={globalPageProps}
                shopNow={generalInterface?.shopNow}
                withAdditionalImage={!firstDivider}
                key={group.id}
              />
            );

          case 'DividerSectionRecord':
            return (
              <Fragment key={group.id}>
                <DividerSection
                  globalPageProps={globalPageProps}
                  fragment={group}
                  image={group === firstDivider ? dividerImage : undefined}
                />
                {group === railAfter && newArrivals}
              </Fragment>
            );

          case 'TestimonialSectionRecord':
            return <TestimonialsSection fragment={group} key={group.id} />;

          case 'MaterialShowcaseSectionRecord':
            return (
              <MaterialShowcase
                globalPageProps={globalPageProps}
                fragment={group}
                key={group.id}
              />
            );

          default:
            return null;
        }
      })}
      {!railAfter && newArrivals}
    </div>
  );
};

export default Content;
