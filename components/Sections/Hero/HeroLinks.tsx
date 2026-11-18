import Link from 'next/link';
import SocialLink from '@/components/Common/SocialLink';
import type { ResultOf } from '@/lib/datocms/graphql';
import { productsPath } from '@/lib/routes';
import type { HeroSectionFragment } from './fragments';

type HeroSection = ResultOf<typeof HeroSectionFragment>;

type Props = {
  lng: string;
  collections: HeroSection['featuredCollections'];
  socials: HeroSection['socials'];
  socialLabel: HeroSection['socialLabel'];
};

export default function HeroLinks({
  lng,
  collections,
  socials,
  socialLabel,
}: Props) {
  if (collections.length === 0 && socials.length === 0) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 border-t border-line pt-3 lg:mt-14">
      {collections.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-2.5">
          {collections.map((collection, index) => (
            <li key={collection.id} className="flex items-center gap-x-2.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink/30">
                  ·
                </span>
              )}
              <Link
                href={productsPath(lng, {
                  collections: collection.id,
                })}
                className="inline-flex min-h-11 items-center text-md font-medium underline-offset-4 hover:underline"
              >
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {socials.length > 0 && (
        <div className="flex items-center gap-2">
          {socialLabel && <p className="text-sm text-mute">{socialLabel}</p>}
          {/* The last glyph lines up with the end of the hairline */}
          <ul className="-mr-3 flex">
            {socials.map((social) => (
              <li key={social.id}>
                <SocialLink social={social} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
