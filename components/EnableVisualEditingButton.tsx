'use client';

import { enableDatoVisualEditing } from 'datocms-visual-editing';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

/** Props for {@link EnableVisualEditingButton}. */
export type Props = {
  className?: string;
};

/**
 * Button that boots the Visual Editing overlays and refreshes the route.
 *
 * Useful for local testing when the bridge/layout is not controlling the
 * controller lifecycle.
 */
export default function EnableVisualEditingButton({ className }: Props) {
  const [busy, setBusy] = useState(false);
  const onceRef = useRef(false);
  const router = useRouter();

  const onClick = useCallback(async () => {
    setBusy(true);
    try {
      if (!onceRef.current) {
        onceRef.current = true;
        // Boot the overlays + dev panel; autoEnable=true enables immediately
        enableDatoVisualEditing({
          baseEditingUrl:
            process.env.NEXT_PUBLIC_DATO_BASE_EDITING_URL ||
            'https://ecommerce-website-openai-app.admin.datocms.com/',
        });
        // Make sure server-rendered content includes stega (if it didn't already)
        router.refresh();
      }
    } catch (err) {
      console.error('Enable Visual Editing failed:', err);
      alert('Could not enable Visual Editing. See console for details.');
      onceRef.current = false;
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={
        className ??
        'flex items-center justify-center rounded-md bg-emerald-600 px-4 py-3 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-emerald-500 disabled:opacity-60'
      }
    >
      {busy ? 'Enabling…' : 'Enable Visual Editing'}
    </button>
  );
}
