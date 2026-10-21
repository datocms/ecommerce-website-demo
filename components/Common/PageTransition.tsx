import { type ReactNode, ViewTransition } from 'react';

// A page's content, wrapped once by generateWrapper (and by the product and catalog pages, which
// render their own draft switch). On a route change the old page drops out and the new one comes
// in under the still chrome (.fade in global.css). The [lng] layout is wrapped too: it persists,
// except on a locale switch, which remounts it and crossfades the whole page (its display:contents
// root is not captured). Search-param changes, router.refresh(), draft toggles and RealTime
// updates are updates, so nothing plays.
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="fade" exit="fade" default="none">
      {children}
    </ViewTransition>
  );
}
