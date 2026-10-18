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
      // Above the draft toggle (48px), on the same gutter line
      className="fixed right-(--gutter) bottom-[calc(var(--inset)+3.75rem)] z-60 w-[min(100vw-2*var(--gutter),22.5rem)]"
    >
      {open && (
        <div className="flex items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-2 text-sm font-semibold text-cream shadow-pop transition duration-200 ease-out [--focus-ring:var(--color-cream)] starting:translate-y-2 starting:opacity-0">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-butter text-ink">
            <CheckIcon aria-hidden="true" className="size-4.25 stroke-[2.8]" />
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
            className="icon-btn relative ml-auto size-9 after:absolute after:-inset-1 [&>svg]:size-4.25 [&>svg]:stroke-[2.4]"
          >
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPopUp;
