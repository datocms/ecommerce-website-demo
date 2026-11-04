import { type ReactNode, ViewTransition } from 'react';

type Props = {
  children: ReactNode;
};

// Fades the page on a route change (.fade in view-transitions.css); a locale switch remounts the
// [lng] layout, so the whole page crossfades. Updates (search params, router.refresh(), draft
// toggle, RealTime data) don't animate.
export default function PageTransition({ children }: Props) {
  return (
    <ViewTransition enter="fade" exit="fade" default="none">
      {children}
    </ViewTransition>
  );
}
