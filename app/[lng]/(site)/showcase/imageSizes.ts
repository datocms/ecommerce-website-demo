import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

export type Photo = {
  id: string;
  responsiveImage: FragmentOf<typeof ResponsiveImageFragment>;
};

// Each photo's frame per breakpoint, widest first. From lg the display frames are 600px tall and
// the material photos stretch to the copy, so each ratio is the narrowest one in its range
export type Frame = [
  media: string,
  width: number,
  unit: 'px' | 'vw',
  ratio: number,
];
export const FRAMES: Record<
  'wide' | 'narrow' | 'lone' | 'trio' | 'material' | 'loneMaterial',
  Frame[]
> = {
  wide: [
    ['(min-width: 1440px)', 787, 'px', 1.31],
    ['(min-width: 1024px)', 54, 'vw', 0.9],
    ['', 46, 'vw', 3 / 4],
  ],
  narrow: [
    ['(min-width: 1440px)', 557, 'px', 0.93],
    ['(min-width: 1024px)', 39, 'vw', 0.64],
    ['', 46, 'vw', 3 / 4],
  ],
  lone: [
    ['(min-width: 1440px)', 1360, 'px', 2.27],
    ['(min-width: 1024px)', 94, 'vw', 1.57],
    ['', 90, 'vw', 4 / 3],
  ],
  // Desktop frames only: below lg a trio photo keeps its pair or lone frame
  trio: [
    ['(min-width: 1440px)', 443, 'px', 0.74],
    ['(min-width: 1024px)', 30, 'vw', 0.51],
  ],
  material: [
    ['(min-width: 1440px)', 385, 'px', 0.75],
    ['(min-width: 1024px)', 27, 'vw', 0.58],
    ['', 46, 'vw', 4 / 5],
  ],
  loneMaterial: [
    ['(min-width: 1440px)', 787, 'px', 1.3],
    ['(min-width: 1024px)', 55, 'vw', 1.1],
    ['', 90, 'vw', 4 / 3],
  ],
};

// A photo wider than its frame is cropped by height, so its source must be wider than the frame
export const coverSizes = (frames: Frame[], photoRatio: number) =>
  frames
    .map(([media, width, unit, ratio]) =>
      `${media} ${Math.ceil(width * Math.max(1, photoRatio / ratio))}${unit}`.trim(),
    )
    .join(', ');

export const imageRatio = (
  responsiveImage: FragmentOf<typeof ResponsiveImageFragment>,
) => {
  const { width, height } = readFragment(
    ResponsiveImageFragment,
    responsiveImage,
  );
  return width / height;
};
