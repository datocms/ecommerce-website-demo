import { RSCImage } from 'react-datocms/rsc-image';
import type { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import type { ResultOf } from '@/lib/datocms/graphql';

type Props = {
  logo: ResultOf<typeof ResponsiveImageFragment> | null | undefined;
  wordmark: string | null | undefined;
  wordmarkClassName?: string;
};

export default function SiteLogo({
  logo,
  wordmark,
  wordmarkClassName = '',
}: Props) {
  return (
    <>
      {logo && (
        // RSCImage, not DatoImage: a bare <picture>, so the logo can be sized by its height
        <RSCImage
          data={wordmark ? { ...logo, alt: '' } : logo}
          usePlaceholder={false}
          sizes="30px"
          imgClassName="logo-ink"
          imgStyle={{ height: '1.875rem', width: 'auto' }}
        />
      )}
      {wordmark && (
        <span
          className={`title-item tracking-[-0.03em] whitespace-nowrap ${wordmarkClassName}`}
        >
          {wordmark}
        </span>
      )}
    </>
  );
}
