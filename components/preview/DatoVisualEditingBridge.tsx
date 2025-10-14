'use client';

import { useEffect, useState } from 'react';
import {
  autoCleanStegaWithin,
  decodeStega,
  enableDatoVisualEditing,
  type VisualEditingController,
} from 'datocms-visual-editing';

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
let disposeAutoClean: (() => void) | null = null;
let firstFrame: number | null = null;
let secondFrame: number | null = null;
let enableTimeout: number | null = null;

const STORAGE_KEY = 'datocms.visual-editing.enabled';
const DEBUG = true;

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
  documentElement.dataset.datocmsVisualEditingDebug = DEBUG ? 'on' : 'off';
};

const cancelAutoClean = () => {
  if (disposeAutoClean) {
    disposeAutoClean();
    disposeAutoClean = null;
  }
};

const ensureAutoClean = () => {
  if (typeof document === 'undefined') return;
  if (disposeAutoClean) return;

  disposeAutoClean = autoCleanStegaWithin(document, { observe: true });
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

const updateEnabledFromController = () => {
  updateSnapshot({ enabled: controller?.isEnabled() ?? false });
};

const readPreference = () => {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === 'enabled') return true;
    if (value === 'disabled') return false;
  } catch {
    // ignore – localStorage might be unavailable (Safari private mode, etc.)
  }

  return null;
};

const persistPreference = (enabled: boolean) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'enabled' : 'disabled');
  } catch {
    // ignore – storage errors are non-fatal
  }
};

const runEnable = () => {
  if (!controller) return;

  cancelAutoClean();
  controller.enable();
  setDocumentState('enabled');
  updateEnabledFromController();
  persistPreference(true);
};

// Wait two animation frames + a short timeout before enabling overlays so hydration can settle.
const scheduleEnable = () => {
  if (!controller) return;

  if (controller.isEnabled()) {
    setDocumentState('enabled');
    updateEnabledFromController();
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

// Disable overlays and keep stega markers scrubbed via AutoClean.
const runDisable = () => {
  if (!controller) return;

  clearPendingEnable();
  if (controller.isEnabled()) {
    controller.disable();
  }
  setDocumentState('disabled');
  ensureAutoClean();
  updateEnabledFromController();
  persistPreference(false);
};

const disposeCurrentController = () => {
  if (controller) {
    controller.dispose();
  }
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
      cancelAutoClean();
      clearDocumentState();
      clearDecode();
      disposeCurrentController();
      return;
    }

    registerDecode();

    const visualEditing = enableDatoVisualEditing({
      baseEditingUrl,
      ...(environment ? { environment } : {}),
      debug: DEBUG,
      autoEnable: false,
    });

    registerController(visualEditing);
    setDocumentState('disabled');

    const preference = readPreference();

    if (preference ?? true) {
      scheduleEnable();
    } else {
      runDisable();
    }

    return () => {
      clearPendingEnable();
      visualEditing.dispose();
      registerController(null);
      cancelAutoClean();
      clearDocumentState();
      clearDecode();
    };
  }, [baseEditingUrl, environment, isDraft]);

  return null;
}
