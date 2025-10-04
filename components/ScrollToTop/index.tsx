'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useState } from 'react';
import AuthenticationModal from '../Header/AuthenticationModal';
import SuccessPopUp from '../Header/SuccessPopUp';

type Props = {
  isDraft: boolean;
};

export default function ScrollToTop({ isDraft }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const isVisualEditingActive = searchParams?.get('edit') === '1';
  const visualEditingCookieName = 'datocms-visual-editing';
  const thirtyDaysInSeconds = 60 * 60 * 24 * 30;

  async function toggleDraft() {
    if (isDraft) {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete('edit');
      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      await fetch('/api/draft/disable');
      window.location.href = nextUrl;
    } else setModalOpen(true);
  }

  function toggleVisualEditing() {
    const params = new URLSearchParams(searchParams?.toString());

    if (isVisualEditingActive) {
      params.delete('edit');
      document.cookie = `${visualEditingCookieName}=0; Path=/; Max-Age=0; SameSite=Lax`;
    } else {
      params.set('edit', '1');
      document.cookie = `${visualEditingCookieName}=1; Path=/; Max-Age=${thirtyDaysInSeconds}; SameSite=Lax`;
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
      router.refresh();
    });
  }

  const triggerSuccessToast = () => {
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
    }, 5000);
  };
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
            <div
              onClick={toggleVisualEditing}
              className="flex cursor-pointer items-center justify-center rounded-md bg-[#FF7751] p-4 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-[#ff8f6f] hover:shadow-signUp"
            >
              {isVisualEditingActive
                ? 'Disable Visual Editing'
                : 'Enable Visual Editing'}
            </div>
          ) : null}
          <div
            onClick={toggleDraft}
            className="flex cursor-pointer items-center justify-center rounded-md bg-primary p-4 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
          >
            {isDraft ? 'Enter Published Mode' : 'Enter Draft Mode'}
          </div>
        </div>
      </motion.div>
    </>
  );
}
