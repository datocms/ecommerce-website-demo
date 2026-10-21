'use client';

import { Transition } from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import SuccessToast from './SuccessToast';
import TokenForm, { TOKEN_FORM_ID } from './TokenForm';

type Props = {
  isDraft: boolean;
};

// Fixed bottom-right button: turns Next.js draft mode on (after asking for the token) or off
export default function DraftModeToggle({ isDraft }: Props) {
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [tokenFormOpen, setTokenFormOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLeavingDraft, startLeavingDraft] = useTransition();

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

  function handleToggleClick() {
    if (!isDraft) {
      setTokenFormOpen((open) => !open);
      return;
    }
    // Busy (aria-busy dims the toggle) until the published page has rendered. Updates after an
    // await fall outside the transition, so the refresh gets a startTransition of its own.
    startLeavingDraft(async () => {
      await fetch('/api/draft/disable');
      startLeavingDraft(() => router.refresh());
    });
  }

  const closeTokenForm = () => {
    setTokenFormOpen(false);
    toggleRef.current?.focus();
  };

  const handleAuthenticated = () => {
    router.refresh();
    closeTokenForm();
    setShowSuccessToast(true);
  };

  const dismissToast = useCallback(() => setShowSuccessToast(false), []);

  return (
    <>
      {/* On the gutter line, 16px off the bottom edge: at the page end it comes to rest centred
          in the footer's legal bar. It steps aside while the cookie notice is open. */}
      <div
        data-chrome="dock"
        className="fixed right-(--gutter) bottom-4 z-40 [body:has(#cookie-notice)_&]:hidden"
      >
        <button
          ref={toggleRef}
          type="button"
          onClick={handleToggleClick}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && tokenFormOpen) closeTokenForm();
          }}
          aria-expanded={!isDraft ? tokenFormOpen : undefined}
          aria-controls={!isDraft ? TOKEN_FORM_ID : undefined}
          aria-busy={isLeavingDraft || undefined}
          // White with an ink edge, so it reads on the white page and on the black footer;
          // the focus ring is drawn inside it for the same reason
          className="press inline-flex h-12 items-center justify-center gap-2.5 border border-ink bg-white px-5 text-sm font-semibold whitespace-nowrap text-ink hover:bg-mist focus-visible:outline-offset-[-5px] aria-busy:opacity-45 max-sm:w-12 max-sm:px-0"
        >
          {isDraft ? (
            <span className="grid size-4.5 place-items-center">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 animate-pop bg-ink forced-colors:bg-[CanvasText]"
              />
            </span>
          ) : (
            <LockClosedIcon aria-hidden="true" className="size-4.5" />
          )}
          <span className="max-sm:sr-only">
            {isDraft ? 'Enter published mode' : 'Enter draft mode'}
          </span>
        </button>
        {/* Headless UI keeps the form mounted until its pop exit ends */}
        <Transition show={tokenFormOpen}>
          <TokenForm onClose={closeTokenForm} onSuccess={handleAuthenticated} />
        </Transition>
      </div>
      <SuccessToast
        open={showSuccessToast}
        onDismiss={dismissToast}
        returnFocusRef={toggleRef}
      />
    </>
  );
}
