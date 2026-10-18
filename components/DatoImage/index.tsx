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
  // react-datocms sizes the blur-up placeholder by width only, so in a "fill"
  // well with a different ratio it would only cover the top part
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
