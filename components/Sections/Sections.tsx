import Hero from '../Home/Hero';
import {
  CollectionMetadata,

  HeroSectionRecord,

  SiteLocale,
} from '@/graphql/generated';
import { redirect } from 'next/navigation';

type Props = {
  sections: any;
  locale: SiteLocale;
};

export default function Section({ sections, locale }: Props) {
  return (
    <>
      {sections.map((section: any) => { //TODO TYPE LATER
        switch (section._modelApiKey) {
          case 'hero_section':
            const heroSectionRecord = section as HeroSectionRecord;
            switch (heroSectionRecord.displayOptions) {
              default:
                return (
                  <Hero
                    heroTitle={heroSectionRecord.heroTitle}
                    heroSubtitle={heroSectionRecord.heroSubtitle}
                    image={heroSectionRecord.heroImage}
                    additionalImage={heroSectionRecord.additionalImage}
                  />
                );
            }
          default:
            return <></>;
        }
      })}
    </>
  );
}
