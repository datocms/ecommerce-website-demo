/**
 * Push a single query parameter update while preserving existing params.
 * Works with Next.js App Router's `useRouter` and `useSearchParams`.
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
