import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { PAGE_VARS } from '@/components/Common/styles';
import CollectionCardShowcase from '@/components/Sections/CollectionCardShowcase';
import DividerSection from '@/components/Sections/DividerSection';
import Hero from '@/components/Sections/Hero';
import { HeroSectionFragment } from '@/components/Sections/Hero/fragments';
import MaterialShowcase from '@/components/Sections/MaterialShowcase';
import NewArrivals from '@/components/Sections/NewArrivals';
import Testimonials from '@/components/Sections/Testimonials';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import type { PageProps, Query } from './meta';
import {
  catalogLinkAction,
  groupCollectionCardShowcases,
  showcaseGroupTitle,
} from './showcaseGroups';

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
  const groups = groupCollectionCardShowcases(data.home.sections);

  // Typed as its fragment: readFragment rejects a member narrowed out of the sections union
  const hero: FragmentOf<typeof HeroSectionFragment> | undefined =
    data.home.sections.find(
      (section) => section.__typename === 'HeroSectionRecord',
    );
  // The hero's second photo sits beside the first divider (in the hero when there is none)
  const heroAdditionalImage = hero
    ? readFragment(HeroSectionFragment, hero).additionalImage.responsiveImage
    : null;
  const firstDivider = groups.find(
    (group) =>
      !Array.isArray(group) && group.__typename === 'DividerSectionRecord',
  );

  // New arrivals go after the collection showcases, else after the first divider, else at the
  // end of the page
  const newArrivalsAfter =
    groups.find((group) => Array.isArray(group)) ?? firstDivider;
  const allProductsAction = catalogLinkAction(menu, lng);

  const newArrivals = (
    <NewArrivals
      products={allProducts}
      lng={lng}
      title={generalInterface?.newArrivals}
      shopNow={generalInterface?.shopNow}
      currencySymbol={generalInterface?.currencySymbol}
      saleLabel={generalInterface?.sale}
      labels={generalInterface}
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
                lng={lng}
                title={showcaseGroupTitle(menu, group)}
                action={allProductsAction}
                previousLabel={generalInterface?.previous}
                nextLabel={generalInterface?.next}
              />
              {group === newArrivalsAfter && newArrivals}
            </Fragment>
          );
        }

        switch (group.__typename) {
          case 'HeroSectionRecord':
            return (
              <Hero
                fragment={group}
                lng={lng}
                shopNow={generalInterface?.shopNow}
                withAdditionalImage={!firstDivider}
                key={group.id}
              />
            );

          case 'DividerSectionRecord':
            return (
              <Fragment key={group.id}>
                <DividerSection
                  lng={lng}
                  fragment={group}
                  image={
                    group === firstDivider ? heroAdditionalImage : undefined
                  }
                />
                {group === newArrivalsAfter && newArrivals}
              </Fragment>
            );

          case 'TestimonialSectionRecord':
            return (
              <Testimonials
                fragment={group}
                pauseLabel={generalInterface?.pause}
                playLabel={generalInterface?.play}
                key={group.id}
              />
            );

          case 'MaterialShowcaseSectionRecord':
            return (
              <MaterialShowcase lng={lng} fragment={group} key={group.id} />
            );

          default:
            return null;
        }
      })}
      {!newArrivalsAfter && newArrivals}
    </div>
  );
};

export default Content;
