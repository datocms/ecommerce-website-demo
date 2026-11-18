'use client';

import { SIZE_ORDER } from './sizes';

export default function SizeOptions({
  label,
  availableSizes,
  selected,
  onSelect,
  editUrl,
}: {
  label: string | null | undefined;
  availableSizes: string[];
  selected: string | undefined;
  onSelect: (size: string) => void;
  /** Content Link target for the selected variation's sizes, draft mode only */
  editUrl?: string;
}) {
  return (
    <div className="mt-6 md:mt-0 lg:mt-6">
      <p id="pdp-size-label" className="text-sm font-semibold">
        {label}{' '}
        <span className="ml-1 font-medium text-mute tabular-nums">
          {selected?.toUpperCase()}
        </span>
      </p>
      <fieldset
        aria-labelledby="pdp-size-label"
        data-datocms-content-link-url={editUrl}
        className="mt-3 grid min-w-0 grid-cols-5 gap-2"
      >
        {SIZE_ORDER.map((sizeOption) => {
          const available = availableSizes.includes(sizeOption);
          return (
            <button
              key={sizeOption}
              type="button"
              disabled={!available}
              aria-pressed={available ? selected === sizeOption : undefined}
              onClick={() => onSelect(sizeOption)}
              // Disabled buttons swallow clicks: in draft mode let them reach the fieldset, so
              // click-to-edit also works on sizes the variation does not offer yet
              className={`chip h-12 px-0 text-base font-semibold tabular-nums ${editUrl && !available ? 'pointer-events-none' : ''}`}
            >
              {sizeOption.toUpperCase()}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
