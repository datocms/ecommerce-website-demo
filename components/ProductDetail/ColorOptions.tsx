'use client';

import { stripStega } from '@datocms/content-link/stega';
import { CheckIcon } from '@heroicons/react/24/outline';
import { isLightColor } from '@/lib/color';
import type { Variation } from './sizes';

export default function ColorOptions({
  label,
  variations,
  selectedId,
  onSelect,
}: {
  label: string | null | undefined;
  variations: Variation[];
  selectedId: string | undefined;
  onSelect: (variation: Variation) => void;
}) {
  return (
    <div>
      <p id="pdp-color-label" className="text-sm font-semibold">
        {label}
      </p>
      <fieldset
        aria-labelledby="pdp-color-label"
        className="mt-3 flex min-w-0 flex-wrap gap-2"
      >
        {variations.map((variation) => {
          const hex = stripStega(variation.color.hex);
          const isLightSwatch = isLightColor(hex);
          const selected = variation.id === selectedId;
          return (
            // Selected: 2px ink frame plus a tick, distinct from the focus ring
            <button
              key={variation.id}
              type="button"
              aria-label={`${label ?? 'Color'}: ${hex}`}
              aria-pressed={selected}
              onClick={() => onSelect(variation)}
              className="press grid size-12 place-items-center border border-line hover:border-ink aria-pressed:border-2 aria-pressed:border-ink"
            >
              <span
                style={{ backgroundColor: hex }}
                className={`grid size-9 place-items-center forced-color-adjust-none ${isLightSwatch ? 'border border-line-strong text-ink' : 'text-white'}`}
              >
                {selected && (
                  <CheckIcon
                    aria-hidden="true"
                    className="size-[1.125rem] animate-pop stroke-[2.25]"
                  />
                )}
              </span>
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
