import DividerSection from '@/components/Sections/DividerSection';
import { ContentPage } from '@/components/WithRealTimeUpdates/types';
import { notFound } from 'next/navigation';
import { PageProps, Query } from './meta';
import Hero from '@/components/Sections/Hero';
import ProductShowcase from '@/components/Sections/ProductShowcase';
import TestimonialsSection from '@/components/Sections/Testimonials';
import MaterialShowcase from '@/components/Sections/MaterialShowcase';

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
              <Hero fragment={section} globalPageProps={globalPageProps} />
            );
          case 'CollectionCardShowcaseSectionRecord':
            return (
              <ProductShowcase
                fragment={section}
                globalPageProps={globalPageProps}
              />
            );

          case 'DividerSectionRecord':
            return (
              <DividerSection
                globalPageProps={globalPageProps}
                fragment={section}
              />
            );

          case 'TestimonialSectionRecord':
            return <TestimonialsSection fragment={section} />;

          case 'MaterialShowcaseSectionRecord':
            return (
              <MaterialShowcase
                globalPageProps={globalPageProps}
                fragment={section}
              />
            );

          default:
            return <></>;
        }
      })}
    </>
  );
};

export default Content;
