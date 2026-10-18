import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { type RefObject, useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onDismiss: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

const SuccessPopUp = ({ open, onDismiss, returnFocusRef }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Auto-hide after 5s; the timer pauses while the toast is hovered or focused
  useEffect(() => {
    if (!open || hovered || focused) return;
    const timeout = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timeout);
  }, [open, hovered, focused, onDismiss]);

  return (
    // The live region stays mounted so the message is announced when it appears
    <div
      role="status"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      // Above the draft toggle (48px, 16px off the bottom edge), on the same gutter line
      className="fixed right-(--gutter) bottom-19 z-60 w-[min(100vw-2*var(--gutter),22.5rem)]"
    >
      {open && (
        <div className="surface-ink flex items-center gap-3 py-2 pr-1 pl-2 text-sm font-semibold transition duration-200 ease-out starting:translate-y-2 starting:opacity-0">
          <span className="grid size-8 shrink-0 place-items-center bg-white text-ink">
            <CheckIcon aria-hidden="true" className="size-4 stroke-[2.5]" />
          </span>
          <p>Authentication successful</p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              setHovered(false);
              setFocused(false);
              onDismiss();
              returnFocusRef?.current?.focus();
            }}
            className="icon-btn ml-auto size-10 [&>svg]:size-4.5 [&>svg]:stroke-2"
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPopUp;
