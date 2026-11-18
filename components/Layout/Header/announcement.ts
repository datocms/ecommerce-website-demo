'use client';

import { useSyncExternalStore } from 'react';
import { DISMISSED_ANNOUNCEMENT_KEY } from '@/lib/dismissedAnnouncement';

// Also kept in memory, for browsers that block localStorage
let dismissedInMemory: string | null = null;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_ANNOUNCEMENT_KEY);
  } catch {
    return null;
  }
};

/** A short fingerprint of the announcement's content (djb2 hash), so a new message shows again */
export function announcementId(content: unknown) {
  const text = JSON.stringify(content ?? null);
  let hash = 5381;
  for (let index = 0; index < text.length; index++) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36);
}

export function dismissAnnouncement(id: string) {
  dismissedInMemory = id;
  try {
    localStorage.setItem(DISMISSED_ANNOUNCEMENT_KEY, id);
  } catch {
    // Remembered for this visit only
  }
  for (const listener of listeners) listener();
}

export const useAnnouncementDismissed = (id: string) =>
  useSyncExternalStore(
    subscribe,
    () => (dismissedInMemory ?? readDismissed()) === id,
    () => false,
  );
