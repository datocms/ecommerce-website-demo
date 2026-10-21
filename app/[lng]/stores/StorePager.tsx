import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const pad = (value: number) => String(value).padStart(2, '0');

type Props = {
  /** Zero-based index of the store on show */
  current: number;
  total: number;
  /** Called with -1 or 1 */
  onStep: (by: number) => void;
  className: string;
};

// Phones show the pager above the store, wider screens under it: each layout gets its own copy
// (the other one is display: none), so the tab and reading order always follow what is seen
export default function StorePager({
  current,
  total,
  onStep,
  className,
}: Props) {
  return (
    <div className={`flex items-center justify-between gap-6 ${className}`}>
      <p className="text-sm font-semibold tabular-nums">
        {pad(current + 1)}{' '}
        <span className="font-normal text-mute">/ {pad(total)}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Previous store"
          className="rail-btn"
          onClick={() => onStep(-1)}
        >
          <ArrowLeftIcon aria-hidden="true" className="stroke-2" />
        </button>
        <button
          type="button"
          aria-label="Next store"
          className="rail-btn"
          onClick={() => onStep(1)}
        >
          <ArrowRightIcon aria-hidden="true" className="stroke-2" />
        </button>
      </div>
    </div>
  );
}
