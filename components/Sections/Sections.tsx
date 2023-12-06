import Hero from '../Home/Hero';
import {
  CollectionShowcaseRecord,
  DividerSectionRecord,
  HeroSectionRecord,
  SiteLocale,
} from '@/graphql/generated';
import ProductShowcase from '../Showcases/ProductShowcase';
import CollectionShowcaseLargeImage from '../Showcases/CollectionShowcaseLargeImage';
import DividerSection from './DividerSection';

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
          case 'collection_showcase':
            const collectionShowcaseSectionRecord =
              section as CollectionShowcaseRecord;
            return (
              <ProductShowcase
                collectionCards={collectionShowcaseSectionRecord.collectionCard}
                lng={locale}
              />
            );

          case 'divider_section':
            const dividerSectionRecord = section as DividerSectionRecord;
            return (
              <DividerSection lng={locale} divider={dividerSectionRecord} />
            );

          default:
            return <></>;
        }
      })}
    </>
  );
}
