/**
 * Floating Preview Controls
 * - Exposes a button to enter/leave draft mode (via server routes).
 * - When draft mode is active, exposes a toggle that calls the shared visual
 *   editing controller directly. State is persisted in localStorage so it
 *   survives navigations.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthenticationModal from '../Header/AuthenticationModal';
import SuccessPopUp from '../Header/SuccessPopUp';
import { useDatoVisualEditing } from '../preview/DatoVisualEditingBridge';

type Props = {
  isDraft: boolean;
};

/**
 * Floating toolbox used in the demo. It exposes a button to enter/leave draft
 * mode and, when draft mode is active, a button to toggle visual editing
 * overlays.
 */
export default function ScrollToTop({ isDraft }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  // Avoid hydration mismatches by rendering this toolbox only on the client.
  // Server-rendered markup can’t know the visual-editing controller readiness
  // yet, which would flip `disabled`/label immediately on hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const visualEditing = useDatoVisualEditing();

  // Toggle draft cookies through server routes. We avoid coupling overlays to
  // draft by keeping the visual-editing toggle entirely client-side.
  async function toggleDraft() {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete('edit');
    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    if (isDraft) {
      await fetch('/api/draft/disable');
      window.location.href = nextUrl;
    } else {
      setModalOpen(true);
    }
  }

  const triggerSuccessToast = () => {
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
    }, 5000);
  };
  if (!mounted) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-4 right-4 z-30"
      >
        <AnimatePresence>
          {successToast && (
            <motion.div
              className="absolute bottom-0 right-0 z-50 w-[500px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.15 }}
            >
              <SuccessPopUp setSuccessToast={setSuccessToast} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="absolute bottom-0 right-0 z-50 w-[400px]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.15 }}
            >
              <AuthenticationModal
                setModalOpen={setModalOpen}
                refresh={router.refresh}
                triggerSuccessToast={triggerSuccessToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className="flex flex-col gap-3"
        >
          {isDraft ? (
            <button
              type="button"
              onClick={visualEditing.toggle}
              disabled={!visualEditing.ready}
              className={`flex items-center justify-center rounded-md p-4 font-bold text-white shadow-md transition duration-300 ease-in-out ${
                visualEditing.ready
                  ? 'cursor-pointer bg-[#FF7751] hover:bg-[#ff8f6f] hover:shadow-signUp'
                  : 'cursor-not-allowed bg-[#FF7751]/60'
              }`}
            >
              {visualEditing.enabled
                ? 'Disable Visual Editing'
                : 'Enable Visual Editing'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={toggleDraft}
            className="flex cursor-pointer items-center justify-center rounded-md bg-primary p-4 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
          >
            {isDraft ? 'Enter Published Mode' : 'Enter Draft Mode'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
