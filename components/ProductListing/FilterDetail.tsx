import { stripStega } from '@datocms/content-link';
import {
  isList,
  type Record,
  type StructuredText,
} from 'datocms-structured-text-utils';
import { renderNodeRule } from 'react-datocms/structured-text';
import ReactMarkdown from 'react-markdown';
import DatoImage from '@/components/DatoImage';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import DatoStructuredText from '@/components/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';

type Props = {
  lng: string;
  name: string;
  subtitle: string;
  eyebrow: string | null | undefined;
  image: FragmentOf<typeof ResponsiveImageFragment> | null | undefined;
  description: StructuredText<Record, Record> | null | undefined;
  /** The image is a logo: shown whole on mist, never cropped */
  logo?: boolean;
};

// Share of the well's width a logo may take. Its height share (--logo-h) is larger on phones,
// whose well is a short band: there the logo still spans 60% of the width.
const LOGO_SHARE = 60;

// Advance widths of the title face, in em, erring wide so a word always fits
const GLYPH_WIDTHS: [RegExp, number][] = [
  [/[.,'’iíìïjlI]/, 0.25],
  [/[frtJ1-]/, 0.39],
  [/[mwMW]/, 0.9],
  [/\p{Lu}/u, 0.66],
];
const glyphWidthEm = (char: string) =>
  GLYPH_WIDTHS.find(([re]) => re.test(char))?.[1] ?? 0.57;

/** The widest unbreakable part of a title, in em */
const widestWord = (title: string) =>
  Math.max(
    0,
    ...title
      .split(/\s+|(?<=-)/)
      .map((word) =>
        [...word].reduce((sum, char) => sum + glyphWidthEm(char), 0),
      ),
  );

export default function FilterDetail({
  lng,
  name,
  eyebrow,
  image,
  description,
  subtitle,
  logo = false,
}: Props) {
  const logoData =
    image && logo ? readFragment(ResponsiveImageFragment, image) : null;
  const titleWidth = widestWord(stripStega(name));

  return (
    // Phones and tablets open on the photo, edge to edge under the header
    <section
      lang={lng}
      className={`shell ${image ? 'lg:pt-10' : 'pt-(--page-top)'}`}
    >
      <div className="grid lg:grid-cols-12 lg:gap-4">
        {image && (
          // Heights, not aspect ratios: a ratio would hand the screen-height cap on
          // to the width and pull the photo off the right edge. From lg the well
          // runs as tall as the text, at most a screen tall, and stays in view
          // while a longer description scrolls. A logo needs less room than a photo,
          // so on tablets its well stays a wide band
          <div
            className={`settle relative -mx-(--gutter) overflow-hidden bg-mist lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:col-span-5 lg:mx-0 lg:h-auto lg:max-h-[calc(100svh-var(--header-h)-5rem)] lg:min-h-[min(35rem,calc(100svh-var(--header-h)-5rem))] ${logo ? 'h-[min(75vw,62svh)] md:h-[min(50vw,62svh)]' : 'h-[min(125vw,62svh)] md:h-[min(75vw,62svh)]'}`}
          >
            {logoData ? (
              // Sized against both sides of the well, so a logo of any shape fits
              // whole. Multiply blends a white backdrop into the mist; a logo drawn on its
              // own tinted square keeps that square, a tile inside the well. bg-mist repeats
              // on this layer: while settle scales it, the layer is isolated, and multiply
              // would show the logo's white box instead of blending it into the well
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
        )}
        <div
          className={`enter-stagger [container-type:inline-size] ${image ? 'pt-8 lg:col-span-6 lg:col-start-7 lg:pt-0' : 'lg:col-span-8'}`}
        >
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {/* Words never break: a long single word (German compounds) shrinks to
              fit the column instead */}
          <h1
            className={`title-display hyphens-manual ${eyebrow ? 'mt-4' : ''}`}
          >
            <span
              className="block"
              style={
                titleWidth
                  ? {
                      fontSize: `min(1em, ${(100 / titleWidth).toFixed(2)}cqi)`,
                    }
                  : undefined
              }
            >
              {name}
            </span>
          </h1>
          {subtitle && (
            <div className="mt-5 max-w-[30em] text-xl leading-[1.42] text-pretty text-ink-2 xl:text-2xl [&>p+p]:mt-3">
              <ReactMarkdown>{subtitle}</ReactMarkdown>
            </div>
          )}
          {description && (
            <DatoStructuredText
              data={description}
              className="prose-dato mt-10 max-w-[66ch] border-t border-line pt-8 lg:mt-12"
              customNodeRules={[
                // Every list renders as a plain bulleted <ul>
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
