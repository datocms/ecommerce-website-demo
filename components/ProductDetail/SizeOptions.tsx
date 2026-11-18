'use client';

import { SIZE_ORDER } from './sizes';

export default function SizeOptions({
  label,
  availableSizes,
  selected,
  onSelect,
}: {
  label: string | null | undefined;
  availableSizes: string[];
  selected: string | undefined;
  onSelect: (size: string) => void;
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
              className="chip h-12 px-0 text-base font-semibold tabular-nums"
            >
              {sizeOption.toUpperCase()}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
