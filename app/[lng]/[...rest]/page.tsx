import { notFound } from 'next/navigation';

// Any path no route matches: hands over to app/[lng]/not-found.tsx, inside the locale's layout
export default function UnmatchedPath() {
  notFound();
}
