import { type FragmentType, getFragmentData } from '@/graphql/types';
import { DatoImage_ResponsiveImageFragmentDoc } from '@/graphql/types/graphql';
import { type ImagePropTypes, Image as ReactDatocmsImage } from 'react-datocms';

type BaseProps = {
  assetAlt?: string | null;
};

type Props =
  | (ImagePropTypes & BaseProps)
  | (Omit<ImagePropTypes, 'data'> &
      BaseProps & {
        fragment: FragmentType<typeof DatoImage_ResponsiveImageFragmentDoc>;
      });

export default function DatoImage(props: Props) {
  const applyAssetAlt = <T extends ImagePropTypes['data'] | undefined>(
    data: T,
    alt: string | null | undefined,
  ): T => {
    if (!data) {
      return data;
    }

    const normalizedAlt = alt !== undefined ? alt : data.alt ?? null;

    if (normalizedAlt === data.alt) {
      return data;
    }

    return {
      ...data,
      alt: normalizedAlt ?? undefined,
    } as T;
  };

  if ('fragment' in props) {
    const { fragment, assetAlt, ...rest } = props;
    const data = getFragmentData(
      DatoImage_ResponsiveImageFragmentDoc,
      fragment,
    );
    const dataWithAlt = applyAssetAlt(data, assetAlt);
    return <ReactDatocmsImage {...rest} data={dataWithAlt} />;
  }

  const { assetAlt, data, ...rest } = props;
  const dataWithAlt = applyAssetAlt(data, assetAlt);
  return <ReactDatocmsImage {...rest} data={dataWithAlt} />;
}
