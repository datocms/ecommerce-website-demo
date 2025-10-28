import { type ImagePropTypes, Image as ReactDatocmsImage } from 'react-datocms';
import { type FragmentType, getFragmentData } from '@/graphql/types';
import { DatoImage_ResponsiveImageFragmentDoc } from '@/graphql/types/graphql';

/**
 * Props for {@link DatoImage}. Accepts either a full `responsiveImage` object
 * via `data`, or a GraphQL fragment reference via `fragment`.
 */
type Props =
  | (ImagePropTypes & { altOverride?: string | null })
  | (Omit<ImagePropTypes, 'data'> & {
      fragment: FragmentType<typeof DatoImage_ResponsiveImageFragmentDoc>;
      altOverride?: string | null;
    });

/**
 * Thin wrapper around `react-datocms`'s `<Image />` that accepts a typed
 * fragment reference and allows overriding the computed `alt` attribute.
 */
export default function DatoImage(props: Props) {
  if ('fragment' in props) {
    const { fragment, altOverride, ...rest } = props;
    const data = getFragmentData(
      DatoImage_ResponsiveImageFragmentDoc,
      fragment,
    );
    const finalData =
      altOverride != null ? { ...data, alt: altOverride } : data;
    return <ReactDatocmsImage {...rest} data={finalData} />;
  }

  const { altOverride, data, ...rest } = props as ImagePropTypes & {
    altOverride?: string | null;
  };
  const finalData = altOverride != null ? { ...data, alt: altOverride } : data;
  return <ReactDatocmsImage {...rest} data={finalData} />;
}
