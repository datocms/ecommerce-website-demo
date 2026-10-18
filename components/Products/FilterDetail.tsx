import { stripStega } from '@datocms/content-link';
import {
  isList,
  isThematicBreak,
  type Record,
  type StructuredText,
} from 'datocms-structured-text-utils';
import { renderNodeRule } from 'react-datocms/structured-text';
import ReactMarkdown from 'react-markdown';
import { ResponsiveImageFragment } from '@/components/DatoImage/fragments';
import DatoStructuredText from '@/components/DatoStructuredText';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import DatoImage from '../DatoImage';

type PropTypes = {
  lng: string;
  name: string;
  subtitle: string;
  type: string | null | undefined;
  image: FragmentOf<typeof ResponsiveImageFragment> | null | undefined;
  description: StructuredText<Record, Record> | null | undefined;
  /** The image is a logo: shown whole on a white card, never cropped */
  logo?: boolean;
};

const SIZES =
  '(min-width: 1440px) 560px, (min-width: 1280px) 38vw, (min-width: 768px) 50vw, 100vw';

// Advance widths of the display face at title sizes, in em, rounded up
const advance = (char: string) =>
  /[.,'’iíìïjlI]/.test(char)
    ? 0.25
    : /[frtJ1-]/.test(char)
      ? 0.39
      : /[mwMW]/.test(char)
        ? 0.9
        : /\p{Lu}/u.test(char)
          ? 0.66
          : 0.57;

/** The widest unbreakable part of a title, in em */
const widestWord = (title: string) =>
  Math.max(
    0,
    ...title
      .split(/\s+|(?<=-)/)
      .map((word) => [...word].reduce((sum, char) => sum + advance(char), 0)),
  );

const FilterDetail = ({
  lng,
  name,
  type,
  image,
  description,
  subtitle,
  logo = false,
}: PropTypes) => {
  // From xl the photo spans the forest card and the description, at most a
  // screen tall: beside a long description it stays in view instead of being
  // cropped to a sliver. Without a description the forest card stretches to it
  const media = image
    ? [
        'relative overflow-hidden rounded-card md:aspect-auto md:min-h-[22rem] lg:min-h-[24rem] xl:col-span-5 xl:min-h-[36rem]',
        description
          ? 'xl:sticky xl:top-[calc(var(--header-h)+1rem)] xl:row-span-2 xl:h-[min(100%,calc(100dvh-var(--header-h)-2rem))] xl:self-start'
          : '',
        logo
          ? 'aspect-square bg-white sm:aspect-[4/3]'
          : 'aspect-[4/5] bg-oat sm:aspect-[4/3]',
      ].join(' ')
    : '';
  const logoData =
    image && logo ? readFragment(ResponsiveImageFragment, image) : null;
  const titleWidth = widestWord(stripStega(name));

  return (
    <section lang={lng} className="shell pt-1">
      <div
        className={`grid gap-3 sm:gap-4 xl:grid-cols-12 ${image ? 'md:grid-cols-2' : ''} ${image && description ? 'xl:grid-rows-[auto_1fr]' : ''}`}
      >
        {image && (
          <div className={media}>
            {logoData ? (
              // Sized against both sides of the card, so a logo of any shape
              // fits whole and keeps its rounded corners; on phones it centres
              // above the overlapping forest card
              <div className="absolute inset-0 grid place-items-center pb-20 [container-type:size] sm:pb-0">
                <div
                  className="relative overflow-hidden rounded-nav"
                  style={{
                    aspectRatio: `${logoData.width} / ${logoData.height}`,
                    width: `min(76cqw, ${(76 * logoData.width) / logoData.height}cqh, 30rem)`,
                  }}
                >
                  <DatoImage
                    fragment={image}
                    layout="fill"
                    objectFit="cover"
                    sizes="(min-width: 1280px) 30rem, (min-width: 768px) 38vw, 76vw"
                    priority
                  />
                </div>
              </div>
            ) : (
              // Portraits keep the head in frame when the card turns landscape
              <DatoImage
                fragment={image}
                layout="fill"
                objectFit="cover"
                objectPosition="50% 20%"
                sizes={SIZES}
                priority
              />
            )}
          </div>
        )}
        <div
          className={`relative z-10 flex flex-col rounded-card surface-forest p-(--panel-pad) [container-type:inline-size] ${image ? 'mx-2 -mt-20 shadow-pop sm:mx-0 sm:mt-0 sm:shadow-none xl:col-span-7' : 'xl:col-span-12'}`}
        >
          {type && <p className="pretitle self-start bg-butter">{type}</p>}
          {/* Bottom-aligned when the card stretches beside the photo */}
          <div className={`mt-auto ${type ? 'pt-6' : ''}`}>
            <h1 className="h-xl hyphens-auto">
              {/* A long single word (German compounds) shrinks to fit the
                  card instead of breaking mid-word */}
              <span
                className="block tracking-[-0.025em]"
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
              <div className="mt-5 max-w-[34em] text-lg font-medium text-pretty text-cream/85 [&>p+p]:mt-3">
                <ReactMarkdown>{subtitle}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        {description && (
          <div
            className={`rounded-card bg-white p-(--panel-pad) ${image ? 'md:col-span-2 xl:col-span-7' : 'xl:col-span-12'}`}
          >
            <DatoStructuredText
              data={description}
              className="prose-dato"
              customNodeRules={[
                renderNodeRule(isList, ({ children, key }) => (
                  <ul key={key}>{children}</ul>
                )),
                // Rules span the card, not the text measure
                renderNodeRule(isThematicBreak, ({ key }) => (
                  <hr key={key} className="my-8 border-line" />
                )),
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterDetail;
