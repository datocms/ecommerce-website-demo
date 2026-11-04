import Link from 'next/link';
import DatoStructuredText from '@/components/DatoStructuredText';
import Rise from '@/components/Motion/Rise';
import CtaLabel, { type Cta } from './CtaLabel';
import type { Photo } from './imageSizes';
import type { Showcase } from './meta';
import PhotoGrid from './PhotoGrid';

type Props = {
  title: Showcase['title'];
  description: Showcase['description'];
  cta?: Cta;
  photos: Photo[];
};

export default function Intro({ title, description, cta, photos }: Props) {
  return (
    <section aria-labelledby="showcase-title" className="shell pt-(--page-top)">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-4">
        {/* text-wrap, not balance: balanced lines leave a gap before the description */}
        <h1
          id="showcase-title"
          className="title-display text-wrap lg:col-span-7 lg:pr-6 xl:col-span-8 xl:pr-10"
        >
          <Rise>{title}</Rise>
        </h1>
        {(description || cta) && (
          <div className="enter-stagger max-w-[34rem] lg:col-span-5 lg:max-w-none xl:col-span-4 [--delay:200ms]">
            {description && (
              <DatoStructuredText
                data={description}
                className="text-md leading-[1.6] text-pretty text-ink-2"
              />
            )}
            {cta && (
              <Link
                href={cta.href}
                className={`btn ${description ? 'mt-7' : ''}`}
              >
                <CtaLabel label={cta.label} />
              </Link>
            )}
          </div>
        )}
      </div>
      {photos.length > 0 && <PhotoGrid photos={photos} />}
    </section>
  );
}
