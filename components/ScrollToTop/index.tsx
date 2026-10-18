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
      {/* On the gutter line; it steps aside while the cookie notice is open */}
      <div className="fixed right-(--gutter) bottom-(--inset) z-40 [body:has(#cookie-notice)_&]:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={toggleDraft}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && modalOpen) closeModal();
          }}
          aria-expanded={!isDraft ? modalOpen : undefined}
          aria-controls={!isDraft ? 'draft-auth' : undefined}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white pr-5 pl-4 text-base font-bold whitespace-nowrap text-ink shadow-card ring-1 ring-line transition-shadow duration-150 hover:ring-ink max-sm:w-12 max-sm:px-0"
        >
          {isDraft ? (
            <span className="grid size-4.5 place-items-center">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full bg-accent-graphic ring-4 ring-accent-graphic/20 forced-colors:bg-[CanvasText]"
              />
            </span>
          ) : (
            <LockClosedIcon
              aria-hidden="true"
              className="size-4.5 stroke-[2.2]"
            />
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
