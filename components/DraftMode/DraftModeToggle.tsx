'use client';

import { Transition } from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import SuccessToast from './SuccessToast';
import TokenForm, { TOKEN_FORM_ID } from './TokenForm';

type Props = {
  isDraft: boolean;
};

// Keeps a CSS variable on <html> at the element's width (0 while it is hidden)
function useWidthAsCssVariable(
  ref: RefObject<HTMLElement | null>,
  name: string,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty(name, `${element.offsetWidth}px`);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty(name);
    };
  }, [ref, name]);
}

// Fixed bottom-right button: turns Next.js draft mode on (after asking for the token) or off
export default function DraftModeToggle({ isDraft }: Props) {
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [tokenFormOpen, setTokenFormOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLeavingDraft, startLeavingDraft] = useTransition();

  // Read by the footer's legal bar to keep its controls clear of the toggle
  useWidthAsCssVariable(toggleRef, '--draft-toggle-w');

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

  function closeTokenForm() {
    setTokenFormOpen(false);
    toggleRef.current?.focus();
  }

  function handleAuthenticated() {
    router.refresh();
    closeTokenForm();
    setShowSuccessToast(true);
  }

  const dismissToast = useCallback(() => setShowSuccessToast(false), []);

  return (
    <>
      {/* 48px tall, 16px off the bottom: at the page end it sits centred in the footer's 80px
          legal bar */}
      <div data-chrome="dock" className="fixed right-(--gutter) bottom-4 z-40">
        <button
          ref={toggleRef}
          type="button"
          onClick={handleToggleClick}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && tokenFormOpen) closeTokenForm();
          }}
          aria-expanded={isDraft ? undefined : tokenFormOpen}
          aria-controls={isDraft ? undefined : TOKEN_FORM_ID}
          aria-busy={isLeavingDraft || undefined}
          // Inset focus ring: the toggle sits over both the white page and the black footer
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
