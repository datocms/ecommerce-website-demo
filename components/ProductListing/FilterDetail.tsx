import { isList } from 'datocms-structured-text-utils';
import { renderNodeRule } from 'react-datocms/structured-text';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import DatoStructuredText from '@/components/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { fitTitleStyle } from './fitTitle';
import type { FilterRecord } from './fragments';

type Props = {
  lng: string;
  eyebrow: string | null | undefined;
  /** The lone selected collection, brand or material */
  record: FilterRecord;
  /** The image is a logo: shown whole on mist, never cropped */
  logo?: boolean;
};

// Max share of the well's width a logo takes (--logo-h caps its height)
const LOGO_SHARE = 60;

function FilterDetailImage({
  image,
  logo,
}: {
  image: FragmentOf<typeof ResponsiveImageFragment>;
  logo: boolean;
}) {
  const logoData = logo ? readFragment(ResponsiveImageFragment, image) : null;

  return (
    // Heights, not aspect ratios: a ratio would turn the screen-height cap into a width and push
    // the photo off the edge
    <div
      className={`settle relative -mx-(--gutter) overflow-hidden bg-mist lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:col-span-5 lg:mx-0 lg:h-auto lg:max-h-[calc(100svh-var(--header-h)-5rem)] lg:min-h-[min(35rem,calc(100svh-var(--header-h)-5rem))] ${logo ? 'h-[min(75vw,62svh)] md:h-[min(50vw,62svh)]' : 'h-[min(125vw,62svh)] md:h-[min(75vw,62svh)]'}`}
    >
      {logoData ? (
        // Fits any logo shape whole. bg-mist repeats here: settle isolates this layer, and
        // mix-blend-multiply would otherwise show the logo's white box
        <div className="absolute inset-0 grid place-items-center bg-mist [container-type:size] [--logo-h:80] md:[--logo-h:60]">
          <div
            className="relative"
            style={{
              aspectRatio: `${logoData.width} / ${logoData.height}`,
              width: `min(${LOGO_SHARE}cqw, calc(var(--logo-h) * ${(logoData.width / logoData.height).toFixed(4)}cqh), 25rem)`,
            }}
          >
            <DatoImage
              fragment={image}
              layout="fill"
              objectFit="contain"
              imgClassName="mix-blend-multiply"
              sizes="(min-width: 1024px) 25rem, 60vw"
              priority
            />
          </div>
        </div>
      ) : (
        // Portraits keep the head in frame when the well turns landscape
        <DatoImage
          fragment={image}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 20%"
          sizes="(min-width: 1440px) 560px, (min-width: 1024px) 38vw, 100vw"
          priority
        />
      )}
    </div>
  );
}

export default function FilterDetail({
  lng,
  eyebrow,
  record,
  logo = false,
}: Props) {
  const {
    name,
    image: { responsiveImage: image },
    subtitle,
    description,
  } = record;

  return (
    // With a photo, phones and tablets open edge to edge under the header
    <section
      lang={lng}
      className={`shell ${image ? 'lg:pt-10' : 'pt-(--page-top)'}`}
    >
      <div className="grid lg:grid-cols-12 lg:gap-4">
        {image && <FilterDetailImage image={image} logo={logo} />}
        <div
          className={`enter-stagger [container-type:inline-size] ${image ? 'pt-8 lg:col-span-6 lg:col-start-7 lg:pt-0' : 'lg:col-span-8'}`}
        >
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1
            className={`title-display hyphens-manual ${eyebrow ? 'mt-4' : ''}`}
          >
            <span className="block" style={fitTitleStyle(name)}>
              {name}
            </span>
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-[30em] text-xl leading-[1.42] text-pretty text-ink-2 xl:text-2xl">
              {subtitle}
            </p>
          )}
          {description && (
            <DatoStructuredText
              data={description}
              className="prose-dato mt-10 max-w-[66ch] border-t border-line pt-8 lg:mt-12"
              customNodeRules={[
                // Numbered lists render as bullets too
                renderNodeRule(isList, ({ children, key }) => (
                  <ul key={key}>{children}</ul>
                )),
              ]}
            />
          )}
        </div>
      </div>
    </section>
  );
}
