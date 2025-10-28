# Documentation

This project uses TypeScript types plus TSDoc/JSDoc comments to provide clear, discoverable API documentation across utilities, API routes, and shared components.

Quick commands
- `pnpm docs` — generate HTML docs into `docs/api/` using TypeDoc
- `pnpm lint` — validate code style (Next + Biome) and catch mistakes

Authoring guidelines
- Prefer TSDoc-style `/** ... */` comments above exports: functions, components, types.
- Use `@param`, `@returns`, and `@throws` when applicable. Add `@template` type parameters for generic helpers.
- Keep file headers brief with `@fileoverview`-style prose when a module’s intent benefits from context.
- For React components, document the `Props` type and add a one-line summary above the component.
- Avoid duplicating TypeScript types in prose — explain intent, constraints, and side-effects instead.

Scope conventions
- Generated code under `graphql/types/**` is intentionally undocumented.
- Docs generation excludes `.next/**` and `docs/**` from linting.

Examples

```ts
/**
 * Format an ISO date string as a human‑readable month day, year.
 * @param dateStr - Date string parseable by `new Date()`
 * @returns Formatted date, e.g. "January 5, 2025"
 */
export function transformDate(dateStr: string): string { /* ... */ }
```

```tsx
/** Props for <MyComponent />. */
type Props = { label: string; onClick?: () => void };

/** Small button with primary styling. */
export default function MyComponent({ label }: Props) { /* ... */ }
```

