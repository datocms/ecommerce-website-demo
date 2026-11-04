'use client';

import { type UIEvent, useEffect, useRef, useState } from 'react';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Product } from '@/app/[lng]/product/[slug]/meta';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { readFragment } from '@/lib/datocms/graphql';

type Props = {
  images: Product['productImages'];
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

  // A tab stop only while it scrolls (useScrollerTabStop does the same for rails, by id)
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

  // From lg, three or more photos: the lead spans the row and the rest pair up (an odd last one
  // spans it too)
  const paired = images.length >= 3;
  const spansRow = (index: number) =>
    !paired ||
    index === 0 ||
    (index === images.length - 1 && images.length % 2 === 0);
  const sizesFor = (index: number) =>
    spansRow(index)
      ? '(min-width: 1440px) 672px, (min-width: 1024px) 47vw, (min-width: 640px) 50vw, 100vw'
      : '(min-width: 1440px) 328px, (min-width: 1024px) 23vw, (min-width: 640px) 50vw, 100vw';

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
            // The product card's photo flies onto this well ("product" view transition,
            // view-transitions.css)
            data-morph={index === 0 ? 'pdp' : undefined}
            className={`relative aspect-[4/5] w-full shrink-0 snap-start overflow-hidden bg-mist lg:w-auto ${images.length > 1 ? 'sm:w-[calc(50%-0.125rem)]' : ''} ${paired && spansRow(index) ? 'lg:col-span-2' : ''}`}
          >
            {image.responsiveImage &&
              (index === 0 ? (
                // RSCImage, not DatoImage: React waits for a plain <img> before the "product"
                // view transition, and DatoImage's onLoad opts out of that wait
                <RSCImage
                  data={readFragment(
                    ResponsiveImageFragment,
                    image.responsiveImage,
                  )}
                  pictureClassName="absolute inset-0"
                  imgStyle={{
                    width: '100%',
                    height: '100%',
                    maxWidth: 'none',
                    objectFit: 'cover',
                  }}
                  sizes={sizesFor(index)}
                  priority
                />
              ) : (
                <DatoImage
                  fragment={image.responsiveImage}
                  layout="fill"
                  objectFit="cover"
                  sizes={sizesFor(index)}
                />
              ))}
            {index === 0 && saleTag && (
              <span className="tag-dark absolute top-(--gutter) left-(--gutter) z-10 lg:top-4 lg:left-4">
                {saleTag}
              </span>
            )}
          </div>
        ))}
      </section>
      {/* Focus ring drawn inside the edge-to-edge scroller */}
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
