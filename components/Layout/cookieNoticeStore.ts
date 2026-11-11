'use client';

import { useSyncExternalStore } from 'react';

// Module-level so a dismissal survives the [lng] layout remounting on a locale switch. The
// header reads it too: the popup waits for it.
let dismissed = false;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const dismissCookieNotice = () => {
  dismissed = true;
  for (const listener of listeners) listener();
};

export const useCookieNoticeDismissed = () =>
  useSyncExternalStore(
    subscribe,
    () => dismissed,
    () => false,
  );
