import DividerSection from '@/components/Sections/DividerSection';
import Hero from '@/components/Sections/Hero';
import MaterialShowcase from '@/components/Sections/MaterialShowcase';
import ProductShowcase from '@/components/Sections/ProductShowcase';
import TestimonialsSection from '@/components/Sections/Testimonials';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { notFound } from 'next/navigation';
import type { PageProps, Query } from './meta';

const Content: ContentPage<PageProps, Query> = ({
  data,
  ...globalPageProps
}) => {
  if (!data.home) {
    notFound();
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
};

export default Content;
