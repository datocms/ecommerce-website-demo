'use client';

import { type RefObject, useEffect } from 'react';

// Closes the open selector on a click or focus outside it, and on Escape
export function useDismissOnOutside(
  isOpen: boolean,
  selectorRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutside = (event: Event) => {
      const { target } = event;
      if (!(target instanceof Node && selectorRef.current?.contains(target))) {
        onClose();
      }
    };

    // preventDefault: a dialog around the selector (the mobile menu) stays open
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handleOutside);
    document.addEventListener('focusin', handleOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      document.removeEventListener('focusin', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectorRef, triggerRef, onClose]);
}
