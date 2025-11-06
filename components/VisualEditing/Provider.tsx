'use client';

import {
  enableDatoAutoClean,
  enableDatoVisualEditing,
} from 'datocms-visual-editing';
import { useEffect } from 'react';

export type Props = {
  isDraft: boolean;
  children: React.ReactNode;
};

/**
 * Convenience provider that enables Visual Editing when `isDraft` is true.
 * Prefer the bridge-based approach for full control and a single controller
 * instance across the app.
 */
export default function VisualEditingProvider({ isDraft, children }: Props) {
  useEffect(() => {
    if (!isDraft) return;
    try {
      const baseEditingUrl =
        process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL ||
        'https://ecommerce-website-openai-app.admin.datocms.com/';

      // Boot overlays. `activate: 'query'` enables when ?edit=1 is present.
      enableDatoVisualEditing({ baseEditingUrl });

      // Clean stega characters after hydration, while keeping overlays clickable.
      enableDatoAutoClean();
    } catch (e) {
      console.warn('Visual Editing bootstrap failed:', e);
    }
  }, [isDraft]);

  return <>{children}</>;
}
