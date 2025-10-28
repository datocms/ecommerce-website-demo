/**
 * Push a single query parameter update while preserving existing params.
 * Works with Next.js App Router's `useRouter` and `useSearchParams`.
 *
 * @param router - Object exposing a `push(href)` method (eg. `useRouter()`).
 * @param searchParams - Current search params from `useSearchParams()`.
 * @param key - Name of the parameter to set.
 * @param value - New value to assign to the parameter.
 * @returns Nothing. Triggers a client-side navigation with the updated query.
 */
export function pushQueryParam(
  router: { push: (href: string) => void },
  searchParams: { toString(): string } | null | undefined,
  key: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams?.toString() ?? '');
  params.set(key, value);
  router.push(`?${params.toString()}`);
}
