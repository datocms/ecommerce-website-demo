import Hero from '../Home/Hero';
import {
  CollectionCardShowcaseSectionRecord,
  DividerSectionRecord,
  HeroSectionRecord,
  MaterialShowcaseSectionRecord,
  SiteLocale,
  TestimonialSectionRecord,
} from '@/graphql/generated';
import ProductShowcase from '../Showcases/ProductShowcase';
import CollectionShowcaseLargeImage from '../Showcases/CollectionShowcaseLargeImage';
import DividerSection from './DividerSection';
import TestimonialsSection from './TestimonialsSection';
import MaterialShowcase from '../Showcases/MaterialShowcase';

type Props = {
  sections: any;
  locale: SiteLocale;
};

export default function Section({ sections, locale }: Props) {
  return (
    <>
      {sections.map((section: any) => {
        //TODO TYPE LATER
        switch (section._modelApiKey) {
          case 'hero_section':
            const heroSectionRecord = section as HeroSectionRecord;
            switch (heroSectionRecord) {
              default:
                return (
                  <Hero
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    image={heroSectionRecord.heroImage}
                    additionalImage={heroSectionRecord.additionalImage}
                    socialsLabel={heroSectionRecord.socialLabel ?? 'SOCIALS'}
                    collections={heroSectionRecord.featuredCollections}
                    lng={locale}
                    socials={heroSectionRecord.socials}
                  />
                );
            }
          case 'collection_card_showcase_section':
            const collectionShowcaseSectionRecord =
              section as CollectionCardShowcaseSectionRecord;
            return (
              <ProductShowcase
                collectionCards={collectionShowcaseSectionRecord}
                lng={locale}
              />
            );

          case 'divider_section':
            const dividerSectionRecord = section as DividerSectionRecord;
            return (
              <DividerSection lng={locale} divider={dividerSectionRecord} />
            );

          case 'testimonial_section':
            const testimonialSectionRecord =
              section as TestimonialSectionRecord;
            return (
              <TestimonialsSection testimonials={testimonialSectionRecord} />
            );

          case 'material_showcase_section':
            const materialShowcaseSection =
              section as MaterialShowcaseSectionRecord;
            return (
              <MaterialShowcase
                lng={locale}
                materialSection={materialShowcaseSection}
              />
            );

          default:
            return <></>;
        }
      })}
    </>
  );
}
