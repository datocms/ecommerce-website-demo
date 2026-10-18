type StarRatingProps = {
  value: number;
  size?: 12 | 14 | 16 | 20;
  /** ink on light surfaces, butter on forest */
  tone?: 'ink' | 'butter';
  /** true when the numeric value is printed next to the stars */
  decorative?: boolean;
  className?: string;
};

const STAR =
  'M12 2.5l2.94 6.06 6.56.92-4.79 4.57 1.17 6.55L12 17.47 6.12 20.6l1.17-6.55L2.5 9.48l6.56-.92z';

const TONES = {
  ink: {
    filled: 'fill-ink',
    empty: 'fill-oat stroke-border-strong',
  },
  butter: {
    filled: 'fill-butter',
    empty: 'fill-none stroke-cream/50',
  },
};

export default function StarRating({
  value,
  size = 16,
  tone = 'ink',
  decorative = false,
  className,
}: StarRatingProps) {
  const filled = Math.round(value);
  const a11y = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img', 'aria-label': `${Math.round(value * 10) / 10} out of 5` };
  return (
    <span
      {...a11y}
      className={['inline-flex items-center gap-0.5', className]
        .filter(Boolean)
        .join(' ')}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          aria-hidden="true"
          className={
            i < filled
              ? `${TONES[tone].filled} forced-colors:fill-[CanvasText]`
              : `${TONES[tone].empty} forced-colors:fill-none forced-colors:stroke-[CanvasText]`
          }
          strokeWidth={i < filled ? 0 : 1.5}
          strokeLinejoin="round"
        >
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}
