'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ContentLink as DatoContentLink } from 'react-datocms/content-link';

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
