import {
  type ImagePropTypes,
  Image as ReactDatocmsImage,
} from 'react-datocms/image';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { ResponsiveImageFragment } from './fragments';

type Props = Omit<ImagePropTypes, 'data'> & {
  fragment: FragmentOf<typeof ResponsiveImageFragment>;
};

export default function DatoImage({ fragment, ...rest }: Props) {
  const data = readFragment(ResponsiveImageFragment, fragment);
  // With layout="fill", react-datocms sizes the blur-up placeholder from the image's own ratio,
  // so in a box with a different ratio it covers only the top. Stretch it to fill the box.
  const placeholderStyle =
    rest.layout === 'fill'
      ? { height: '110%', ...rest.placeholderStyle }
      : rest.placeholderStyle;
  return (
    <ReactDatocmsImage
      {...rest}
      placeholderStyle={placeholderStyle}
      data={data}
    />
  );
}
