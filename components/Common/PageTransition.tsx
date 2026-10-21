import { type ReactNode, ViewTransition } from 'react';

// Wraps a page's content. generateWrapper applies it to every route that uses it, the [lng] layout
// included; product/[slug] and products skip generateWrapper and apply it themselves.
// - A route change: the old page drops out and the new one comes in under the still chrome (.fade
//   in global.css).
// - A locale switch: it remounts the [lng] layout, so the whole page crossfades, because the
//   layout's display:contents root is not captured.
// - Updates (search params, router.refresh(), draft toggles, RealTime): nothing plays
//   (default="none").
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="fade" exit="fade" default="none">
      {children}
    </ViewTransition>
  );
}
