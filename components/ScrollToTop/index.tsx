'use client';

import { LockClosedIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import AuthenticationModal from '../Header/AuthenticationModal';
import SuccessPopUp from '../Header/SuccessPopUp';

type Props = {
  isDraft: boolean;
};

// Draft-mode toggle (the name is historical: there is no back-to-top control)
export default function ScrollToTop({ isDraft }: Props) {
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Publishes the toggle's width, so the footer's legal bar keeps its own controls
  // clear of it (0 while the toggle steps aside for the cookie notice)
  useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--draft-toggle-w', `${toggle.offsetWidth}px`);
    });
    observer.observe(toggle);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--draft-toggle-w');
    };
  }, []);

  async function toggleDraft() {
    if (isDraft) {
      await fetch('/api/draft/disable');
      router.refresh();
    } else setModalOpen((open) => !open);
  }

  const closeModal = () => {
    setModalOpen(false);
    toggleRef.current?.focus();
  };

  const onAuthenticated = () => {
    router.refresh();
    closeModal();
    setSuccessToast(true);
  };

  const dismissToast = useCallback(() => setSuccessToast(false), []);

  return (
    <MotionConfig reducedMotion="user">
      {/* On the gutter line, 16px off the bottom edge: at the page end it comes to rest centred
          in the footer's legal bar. It steps aside while the cookie notice is open. */}
      <div className="fixed right-(--gutter) bottom-4 z-40 [body:has(#cookie-notice)_&]:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={toggleDraft}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && modalOpen) closeModal();
          }}
          aria-expanded={!isDraft ? modalOpen : undefined}
          aria-controls={!isDraft ? 'draft-auth' : undefined}
          // White with an ink edge, so it reads on the white page and on the black footer;
          // the focus ring is drawn inside it for the same reason
          className="inline-flex h-12 items-center justify-center gap-2.5 border border-ink bg-white px-5 text-sm font-semibold whitespace-nowrap text-ink transition-colors duration-150 hover:bg-mist focus-visible:outline-offset-[-5px] max-sm:w-12 max-sm:px-0"
        >
          {isDraft ? (
            <span className="grid size-4.5 place-items-center">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 bg-ink forced-colors:bg-[CanvasText]"
              />
            </span>
          ) : (
            <LockClosedIcon aria-hidden="true" className="size-4.5" />
          )}
          <span className="max-sm:sr-only">
            {isDraft ? 'Enter published mode' : 'Enter draft mode'}
          </span>
        </button>
        <AnimatePresence>
          {modalOpen && (
            <AuthenticationModal
              key="draft-auth"
              onClose={closeModal}
              onSuccess={onAuthenticated}
            />
          )}
        </AnimatePresence>
      </div>
      <SuccessPopUp
        open={successToast}
        onDismiss={dismissToast}
        returnFocusRef={toggleRef}
      />
    </MotionConfig>
  );
}
