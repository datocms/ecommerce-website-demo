import { useEffect, useState } from 'react';
import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { readFragment } from '@/lib/datocms/graphql';
import { heroImageSizes } from './imageSizes';
import type { Query } from './meta';

type Props = {
  stores: Query['allStores'];
  /** Zero-based index of the store on show */
  current: number;
  /** A store the visitor is pointing at in the list, whose photo can start loading */
  upcoming: number | null;
  className: string;
};

// Each photo is a layer in the well. A switch crossfades to the new photo once it has loaded,
// so the well never shows an empty frame, and the photos either side of the current one load in
// the background so the pager's arrows switch at once.
export default function StorePhotos({
  stores,
  current,
  upcoming,
  className,
}: Props) {
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set());
  const [lastShown, setLastShown] = useState(current);
  const shown = loaded.has(current) ? current : lastShown;

  useEffect(() => {
    if (loaded.has(current)) setLastShown(current);
  }, [current, loaded]);

  const markLoaded = (index: number) =>
    setLoaded((previous) => new Set(previous).add(index));

  const count = stores.length;
  const layers = new Set([current, shown]);
  if (upcoming !== null) layers.add(upcoming);
  // Neighbours wait for the current photo, so they never compete with it
  if (loaded.has(current)) {
    layers.add((current + 1) % count);
    layers.add((current - 1 + count) % count);
  }

  return (
    <div className={`${MEDIA} settle ${className}`}>
      {/* settle animates the well's first child once, on arrival */}
      <div className="absolute inset-0">
        {stores.map((store, index) => {
          const image = store.storeImage?.responsiveImage;
          if (!image || !layers.has(index)) return null;
          const { width, height } = readFragment(
            ResponsiveImageFragment,
            image,
          );
          return (
            <div
              key={store.id}
              aria-hidden={index === shown ? undefined : true}
              className={`absolute inset-0 transition-opacity duration-(--dur-sheet) ease-out ${index === shown ? '' : 'opacity-0'}`}
            >
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="cover"
                sizes={heroImageSizes(width / height)}
                priority={index === current}
                onLoad={() => markLoaded(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
