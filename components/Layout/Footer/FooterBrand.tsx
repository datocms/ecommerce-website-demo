import { stripStega } from '@datocms/content-link';
import Link from 'next/link';
import { RSCImage } from 'react-datocms/rsc-image';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import SocialLink from '@/components/Common/SocialLink';
import type { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import type { ResultOf } from '@/lib/datocms/graphql';
import { homePath } from '@/lib/routes';

type Props = {
  lng: string;
  title: string | null | undefined;
  logo: ResultOf<typeof ResponsiveImageFragment> | null | undefined;
  subtitle: string | null | undefined;
  socials: NonNullable<LayoutQuery['layout']>['socialMediaLinks'];
};

// Named by the title, else by the logo's alt text, else "Home"
function homeLabelOf(
  title: Props['title'],
  logo: Props['logo'],
): string | undefined {
  if (title) {
    return stripStega(title);
  }
  if (logo?.alt) {
    return undefined;
  }
  return 'Home';
}

export default function FooterBrand({
  lng,
  title,
  logo,
  subtitle,
  socials,
}: Props) {
  return (
    <div className="lg:col-span-4">
      {(logo || title) && (
        <Link
          href={homePath(lng)}
          aria-label={homeLabelOf(title, logo)}
          className="inline-flex outline-offset-4"
        >
          {logo && (
            // RSCImage, not DatoImage: a bare <picture>, so the logo can be sized by its height
            <RSCImage
              data={title ? { ...logo, alt: '' } : logo}
              usePlaceholder={false}
              sizes="40px"
              imgClassName="logo-white"
              imgStyle={{ height: '2.5rem', width: 'auto' }}
            />
          )}
          {!logo && title && (
            <span className="title-item tracking-[-0.03em]">{title}</span>
          )}
        </Link>
      )}
      {subtitle && (
        <p className="mt-6 max-w-[18.75rem] text-md text-pretty text-mute first:mt-0">
          {subtitle}
        </p>
      )}
      {socials.length > 0 && (
        // -ml-3: the first glyph sits on the content edge
        <div className="mt-8 -ml-3 flex first:mt-0">
          {socials.map((social) => (
            <SocialLink key={social.id} social={social} />
          ))}
        </div>
      )}
    </div>
  );
}
