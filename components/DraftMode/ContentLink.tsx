'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ContentLink as DatoContentLink } from 'react-datocms/content-link';

/**
 * Visual-editing overlay (draft mode only): click content to open it in DatoCMS.
 * onNavigateTo/currentPath keep the Web Previews sidebar and the Next.js router in sync.
 */
export default function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DatoContentLink
      onNavigateTo={(path) => router.push(path)}
      currentPath={pathname}
    />
  );
}
