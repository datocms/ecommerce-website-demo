'use client';

// NOTE: Keep the shared view markup identical across server and client renders
// to preserve stega/_editingUrl markers. The LiveContent wrappers reuse this
// view without replacing DOM nodes.

import DividerSection from '@/components/Sections/DividerSection';
import Hero from '@/components/Sections/Hero';
import MaterialShowcase from '@/components/Sections/MaterialShowcase';
import ProductShowcase from '@/components/Sections/ProductShowcase';
import TestimonialsSection from '@/components/Sections/Testimonials';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { notFound } from 'next/navigation';
import type { PageProps, Query } from './meta';

type ContentViewProps = PageProps & {
  data: Query;
};

// Pure view that assumes data has already been validated. We reuse this from the
// client realtime wrapper so overlays stay consistent across renders.
export function HomeContentView({
  data,
  ...globalPageProps
}: ContentViewProps) {
  if (!data.home) {
    return null;
  }

  return (
    <>
      {data.home.sections.map((section) => {
        switch (section.__typename) {
          case 'HeroSectionRecord':
            return (
              <Hero
                fragment={section}
                globalPageProps={globalPageProps}
                key={section.id}
              />
            );
          case 'CollectionCardShowcaseSectionRecord':
            return (
              <ProductShowcase
                fragment={section}
                globalPageProps={globalPageProps}
                key={section.id}
              />
            );

          case 'DividerSectionRecord':
            return (
              <DividerSection
                globalPageProps={globalPageProps}
                fragment={section}
                key={section.id}
              />
            );

          case 'TestimonialSectionRecord':
            return <TestimonialsSection fragment={section} key={section.id} />;

          case 'MaterialShowcaseSectionRecord':
            return (
              <MaterialShowcase
                globalPageProps={globalPageProps}
                fragment={section}
                key={section.id}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}

// Server component: guard against missing data and render the shared view.
const Content: ContentPage<PageProps, Query> = (props) => {
  if (!props.data.home) {
    notFound();
  }

  return <HomeContentView {...props} />;
};

export default Content;
