import { MEDIA } from '@/components/Common/styles';
import DatoImage from '@/components/DatoImage';
import { coverSizes, FRAMES, imageRatio, type Photo } from './imageSizes';

type Props = {
  photos: Photo[];
};

const COLUMN_SPAN = {
  wide: 'lg:col-span-7',
  narrow: 'lg:col-span-5',
  lone: 'lg:col-span-12',
};

const OBJECT_POSITION = {
  wide: '50% 12%',
  narrow: '50% 35%',
  lone: '50% 15%',
};

// Pairs alternate 7/5 and 5/7 columns; an odd last photo spans the row, or from lg the last three
// share it, so the last portrait isn't cropped to a thin band
function photoSlot(
  index: number,
  count: number,
): { slot: 'wide' | 'narrow' | 'lone'; trio: boolean } {
  const trio = count % 2 === 1 && count >= 3 && index >= count - 3;
  if (index === count - 1 && index % 2 === 0) return { slot: 'lone', trio };
  if ((index % 2 === 0) === (Math.floor(index / 2) % 2 === 0)) {
    return { slot: 'wide', trio };
  }
  return { slot: 'narrow', trio };
}

export default function PhotoGrid({ photos }: Props) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-12 lg:gap-4">
      {photos.map(({ id, responsiveImage }, index) => {
        const { slot, trio } = photoSlot(index, photos.length);
        const frames = trio
          ? [...FRAMES.trio, ...FRAMES[slot].slice(-1)]
          : FRAMES[slot];
        return (
          <div
            key={id}
            className={`${MEDIA} ${index < 2 ? 'settle' : ''} lg:aspect-auto lg:h-[37.5rem] ${
              slot === 'lone' ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'
            } ${trio ? 'lg:col-span-4' : COLUMN_SPAN[slot]}`}
          >
            <DatoImage
              fragment={responsiveImage}
              layout="fill"
              objectFit="cover"
              objectPosition={trio ? '50% 20%' : OBJECT_POSITION[slot]}
              sizes={coverSizes(frames, imageRatio(responsiveImage))}
              priority={index < 2}
            />
          </div>
        );
      })}
    </div>
  );
}
