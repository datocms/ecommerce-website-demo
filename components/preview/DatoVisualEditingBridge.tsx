'use client';

import { useEffect, useState } from 'react';
import {
  decodeStega,
  enableDatoVisualEditing,
  type VisualEditingController,
} from 'datocms-visual-editing';

/**
 * Bridge the imperative Visual Editing controller into React state so UI
 * elements (toggles, indicators) can react to changes. The controller itself
 * is shared across the app; this component only mounts it when draft mode is
 * active and the project has a base editing URL configured.
 */

declare global {
  interface Window {
    __DATOCMS_DECODE_STEGA__?: typeof decodeStega;
  }
}

type Props = {
  baseEditingUrl: string;
  environment?: string;
  isDraft?: boolean;
};

type VisualEditingSnapshot = {
  ready: boolean;
  enabled: boolean;
  isDraft: boolean;
};

type Listener = (snapshot: VisualEditingSnapshot) => void;

const listeners = new Set<Listener>();

let snapshot: VisualEditingSnapshot = {
  ready: false,
  enabled: false,
  isDraft: false,
};

let controller: VisualEditingController | null = null;
let firstFrame: number | null = null;
let secondFrame: number | null = null;
let enableTimeout: number | null = null;

const STORAGE_KEY = 'datocms.visual-editing.enabled';
const DEBUG_ATTRIBUTES = process.env.NODE_ENV !== 'production';

const getSnapshot = () => ({ ...snapshot });

const emit = () => {
  const current = getSnapshot();
  listeners.forEach((listener) => listener(current));
};

const updateSnapshot = (partial: Partial<VisualEditingSnapshot>) => {
  snapshot = { ...snapshot, ...partial };
  emit();
};

const registerController = (next: VisualEditingController | null) => {
  controller = next;
  updateSnapshot({
    ready: Boolean(next),
    enabled: next?.isEnabled() ?? false,
  });
};

const setDraftState = (isDraft: boolean) => {
  updateSnapshot({ isDraft });
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  listener(getSnapshot());
  return () => {
    listeners.delete(listener);
  };
};

const registerDecode = () => {
  if (typeof window !== 'undefined') {
    window.__DATOCMS_DECODE_STEGA__ = decodeStega;
  }
};

const clearDecode = () => {
  if (typeof window !== 'undefined') {
    delete window.__DATOCMS_DECODE_STEGA__;
  }
};

const clearDocumentState = () => {
  if (typeof document === 'undefined') return;
  const { documentElement } = document;
  delete documentElement.dataset.datocmsVisualEditing;
  delete documentElement.dataset.datocmsVisualEditingDebug;
};

const setDocumentState = (state: 'enabled' | 'disabled') => {
  if (typeof document === 'undefined') return;
  const { documentElement } = document;
  documentElement.dataset.datocmsVisualEditing = state;
  documentElement.dataset.datocmsVisualEditingDebug = DEBUG_ATTRIBUTES
    ? 'on'
    : 'off';
};

const clearPendingEnable = () => {
  if (typeof window === 'undefined') return;
  if (firstFrame !== null) {
    window.cancelAnimationFrame(firstFrame);
    firstFrame = null;
  }
  if (secondFrame !== null) {
    window.cancelAnimationFrame(secondFrame);
    secondFrame = null;
  }
  if (enableTimeout !== null) {
    window.clearTimeout(enableTimeout);
    enableTimeout = null;
  }
};

const syncEnabledState = () => {
  const enabled = controller?.isEnabled() ?? false;
  setDocumentState(enabled ? 'enabled' : 'disabled');
  updateSnapshot({ enabled });
};

const readPreference = () => {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === 'enabled') return true;
    if (value === 'disabled') return false;
  } catch {
    // Ignore storage errors (e.g. Safari private mode).
  }
  return null;
};

const persistPreference = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'enabled' : 'disabled');
  } catch {
    // Ignore storage errors – lack of persistence is non-fatal.
  }
};

// Enable overlays and persist the preference in localStorage. The controller
// might already be enabled if a previous draft session set it so.
const runEnable = () => {
  if (!controller) return;
  controller.enable();
  syncEnabledState();
  persistPreference(true);
};

// Defer enabling by two rAF ticks + a short timeout so hydration settles.
const scheduleEnable = () => {
  if (!controller) return;
  if (controller.isEnabled()) {
    syncEnabledState();
    persistPreference(true);
    return;
  }

  clearPendingEnable();

  if (typeof window === 'undefined') {
    runEnable();
    return;
  }

  firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(() => {
      enableTimeout = window.setTimeout(() => {
        enableTimeout = null;
        runEnable();
      }, 120);
    });
  });
};

// Disable overlays while leaving the stega metadata in place so re-enabling is
// instant.
const runDisable = () => {
  if (!controller) return;
  clearPendingEnable();
  if (controller.isEnabled()) {
    controller.disable();
  }
  syncEnabledState();
  persistPreference(false);
};

const disposeCurrentController = () => {
  controller?.dispose();
  registerController(null);
};

export function enableVisualEditing() {
  if (!controller || !snapshot.isDraft) return;
  scheduleEnable();
}

export function disableVisualEditing() {
  if (!controller) return;
  runDisable();
}

export function refreshVisualEditing(scope?: ParentNode | undefined) {
  if (!controller) return;
  if ('isDisposed' in controller && controller.isDisposed()) return;
  if (!('refresh' in controller)) return;
  controller.refresh(scope);
}

export function getVisualEditingController() {
  return controller;
}

export function toggleVisualEditing() {
  if (!controller || !snapshot.isDraft) return;
  if (controller.isEnabled()) {
    runDisable();
  } else {
    scheduleEnable();
  }
}

export function useDatoVisualEditing() {
  const [state, setState] = useState<VisualEditingSnapshot>(() => getSnapshot());
  useEffect(() => subscribe(setState), []);
  return {
    ...state,
    enable: enableVisualEditing,
    disable: disableVisualEditing,
    toggle: toggleVisualEditing,
  };
}

export default function DatoVisualEditingBridge({
  baseEditingUrl,
  environment,
  isDraft = false,
}: Props) {
  useEffect(() => {
    setDraftState(isDraft);

    if (!baseEditingUrl || !isDraft) {
      clearPendingEnable();
      clearDocumentState();
      clearDecode();
      disposeCurrentController();
      return;
    }

    // Mount a fresh controller for the current preview session.
    registerDecode();

    const visualEditing = enableDatoVisualEditing({
      baseEditingUrl,
      ...(environment ? { environment } : {}),
      autoEnable: false,
      debug: DEBUG_ATTRIBUTES,
    });

    registerController(visualEditing);
    setDocumentState('disabled');

    // Restore the last-known overlay preference (enabled/disabled) so the UI
    // feels consistent across refreshes.
    const preference = readPreference();
    if (preference === true) {
      scheduleEnable();
    }
    if (preference === false) {
      runDisable();
    }

    return () => {
      clearPendingEnable();
      visualEditing.dispose();
      registerController(null);
      clearDocumentState();
      clearDecode();
    };
  }, [baseEditingUrl, environment, isDraft]);

  return null;
}
