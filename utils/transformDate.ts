/**
 * Format an ISO date string as a human‑readable month day, year.
 *
 * @param dateStr - Date string parseable by `new Date()`
 * @returns Formatted date, e.g. "January 5, 2025"
 */
export default function transformDate(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    date,
  );
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}
