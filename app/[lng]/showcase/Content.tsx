import { stripStega } from '@datocms/content-link';
import { notFound } from 'next/navigation';
import type { ContentPage } from '@/components/WithRealTimeUpdates/types';
import CollectionLinks from './CollectionLinks';
import Intro from './Intro';
import Materials from './Materials';
import type { PageProps, Query } from './meta';
import NewProducts from './NewProducts';

// For .filter(): keeps the uploads that have a responsive image and types it as present
const hasImage = <T extends { responsiveImage?: unknown }>(
  item: T,
): item is T & { responsiveImage: NonNullable<T['responsiveImage']> } =>
  Boolean(item.responsiveImage);

const Content: ContentPage<PageProps, Query> = ({ data, params }) => {
  const { showcase, generalInterface } = data;
  if (!showcase) {
    notFound();
  }

  const { lng } = params;
  const [ctaButton] = showcase.cta;
  const cta = ctaButton && {
    label: ctaButton.label,
    href: `/${lng}/${stripStega(ctaButton.slug)}`,
  };
  const [collectionsCta] = showcase.collectionsCta;

  return (
    <>
      <Intro
        title={showcase.title}
        description={showcase.description}
        cta={cta}
        photos={showcase.displays.filter(hasImage)}
      />
      {collectionsCta && showcase.collections.length > 0 && (
        <CollectionLinks
          lng={lng}
          label={generalInterface?.collection}
          collections={showcase.collections}
          cta={collectionsCta}
        />
      )}
      {showcase.newProducts.length > 0 && (
        <NewProducts
          lng={lng}
          title={showcase.newProductsTitle}
          products={showcase.newProducts}
          cta={cta}
          currencySymbol={generalInterface?.currencySymbol ?? ''}
          saleLabel={generalInterface?.sale}
        />
      )}
      <Materials
        lng={lng}
        title={showcase.materialsTitle}
        description={showcase.materialsDescription}
        photos={showcase.materialsDisplay.filter(hasImage).slice(0, 2)}
        shopNow={generalInterface?.shopNow}
      />
    </>
  );
};

export default Content;
