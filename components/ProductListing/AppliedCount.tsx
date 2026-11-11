// Re-keyed by the count, so it pops again when the count changes
export default function AppliedCount({
  count,
  applied,
}: {
  count: number;
  /** General interface "applied" label */
  applied: string | undefined;
}) {
  return (
    <span key={count} className="tag-dark min-h-6 animate-pop px-1.5">
      <span className="sr-only"> (</span>
      {count}
      <span className="sr-only"> {applied})</span>
    </span>
  );
}
