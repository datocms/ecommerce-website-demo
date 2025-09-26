'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  autoCleanStegaWithin,
  enableDatoVisualEditing,
} from 'datocms-visual-editing';

type Props = {
  baseEditingUrl: string;
  environment?: string;
};

export default function DatoContentLinkClient({ baseEditingUrl, environment }: Props) {
  const searchParams = useSearchParams();
  const visualEditingEnabled = searchParams?.get('edit') === '1';

  useEffect(() => {
    if (!baseEditingUrl || !visualEditingEnabled) return;

    const body = document.body;
    if (!body) return;

    const clean = autoCleanStegaWithin(body, {
      delayMs: 32,
      cleanImageAlts: true,
    });

    const dispose = enableDatoVisualEditing({
      baseEditingUrl,
      activate: 'query',
      overlays: 'hover',
      showBadge: true,
      targetAttribute: 'data-datocms-edit-target',
      openInNewTab: true,
      persistAfterClean: true,
      ...(environment ? { environment } : {}),
    });

    return () => {
      clean();
      dispose?.();
    };
  }, [baseEditingUrl, environment, visualEditingEnabled]);

  return null;
}
