'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';

// Fetched on first render, so only draft mode downloads the overlay
const ReactDatocmsContentLink = dynamic(
  () => import('react-datocms/content-link').then((mod) => mod.ContentLink),
  { ssr: false },
);

/**
 * Visual-editing overlay (draft mode only): click content to open it in DatoCMS.
 * onNavigateTo/currentPath keep the Web Previews sidebar and the Next.js router in sync.
 */
export default function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ReactDatocmsContentLink
      onNavigateTo={(path) => router.push(path)}
      currentPath={pathname}
    />
  );
}
