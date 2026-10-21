'use client';

import { type UIEvent, useEffect, useRef, useState } from 'react';
import type { Query as ProductQuery } from '@/app/[lng]/product/[slug]/meta';
import DatoImage from '@/components/DatoImage';

type Props = {
  images: NonNullable<ProductQuery['product']>['productImages'];
  productName: string;
  /** The sale label to show on the lead photo, when the product is on sale */
  saleTag?: string | null;
};

export default function ProductGallery({
  images,
  productName,
  saleTag,
}: Props) {
  // First photo in view: phones show one at a time, tablets two
  const [currentSlide, setCurrentSlide] = useState(0);

  // The gallery is a tab stop only while it scrolls (not once the photos stack from lg)
  const galleryRef = useRef<HTMLElement>(null);
  const [galleryScrolls, setGalleryScrolls] = useState(true);
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const observer = new ResizeObserver(() =>
      setGalleryScrolls(gallery.scrollWidth > gallery.clientWidth + 1),
    );
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  const handleGalleryScroll = (event: UIEvent<HTMLElement>) => {
    const { scrollLeft, children } = event.currentTarget;
    const first = children[0] as HTMLElement | undefined;
    const second = children[1] as HTMLElement | undefined;
    if (!first) return;
    const pitch = second
      ? second.offsetLeft - first.offsetLeft
      : first.clientWidth;
    if (!pitch) return;
    const slide = Math.round(scrollLeft / pitch);
    setCurrentSlide(Math.min(Math.max(slide, 0), images.length - 1));
  };

  // Phones swipe one photo at a time and tablets two, edge to edge. From lg they stack beside the
  // buy box; three or more keep the lead photo full width and pair the rest (a last odd one spans
  // the row too), so a long gallery doesn't turn into a column of huge photos
  const paired = images.length >= 3;
  const spansRow = (index: number) =>
    !paired ||
    index === 0 ||
    (index === images.length - 1 && images.length % 2 === 0);

  return (
    <div className="relative -mx-(--gutter) min-w-0 lg:col-span-6 lg:mx-0">
      <section
        ref={galleryRef}
        aria-label={productName}
        tabIndex={galleryScrolls ? 0 : undefined}
        onScroll={handleGalleryScroll}
        className={`no-scrollbar peer flex snap-x snap-mandatory gap-1 overflow-x-auto focus-visible:outline-hidden lg:grid lg:snap-none lg:gap-4 lg:overflow-visible ${paired ? 'lg:grid-cols-2' : ''}`}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            // The lead photo's well: the product card's photo lands on its first child, and the
            // sale tag fades in over it (the "product" view transition in global.css)
            data-morph={index === 0 ? 'pdp' : undefined}
            className={`relative aspect-[4/5] w-full shrink-0 snap-start overflow-hidden bg-mist lg:w-auto ${images.length > 1 ? 'sm:w-[calc(50%-0.125rem)]' : ''} ${paired && spansRow(index) ? 'lg:col-span-2' : ''}`}
          >
            {image.responsiveImage && (
              <DatoImage
                fragment={image.responsiveImage}
                layout="fill"
                objectFit="cover"
                sizes={
                  spansRow(index)
                    ? '(min-width: 1440px) 672px, (min-width: 1024px) 47vw, (min-width: 640px) 50vw, 100vw'
                    : '(min-width: 1440px) 328px, (min-width: 1024px) 23vw, (min-width: 640px) 50vw, 100vw'
                }
                priority={index === 0}
              />
            )}
            {/* While the photo bleeds, the tag sits on the text's gutter */}
            {index === 0 && saleTag && (
              <span className="tag-dark absolute top-(--gutter) left-(--gutter) z-10 lg:top-4 lg:left-4">
                {saleTag}
              </span>
            )}
          </div>
        ))}
      </section>
      {/* The scroller runs edge to edge on phones, so its focus ring is drawn inside it: ink
          with a white line inside, visible on light and dark photo edges alike */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden border-4 border-white outline-2 -outline-offset-2 outline-ink peer-focus-visible:block"
      />
      {images.length > 1 && (
        <span
          aria-hidden="true"
          className="tag absolute right-(--gutter) bottom-(--gutter) z-10 sm:hidden"
        >
          {currentSlide + 1} / {images.length}
        </span>
      )}
      {images.length > 2 && (
        <span
          aria-hidden="true"
          className="tag absolute right-(--gutter) bottom-(--gutter) z-10 hidden sm:inline-flex lg:hidden"
        >
          {currentSlide + 1}–{Math.min(currentSlide + 2, images.length)} /{' '}
          {images.length}
        </span>
      )}
    </div>
  );
}
