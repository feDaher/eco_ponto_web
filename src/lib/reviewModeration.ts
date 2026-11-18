'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { Review } from '@/types/api';

const STORAGE_KEY = 'ecoponto-review-moderation';

type Overrides = Record<string, boolean>;

const EMPTY: Overrides = {};
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedOverrides: Overrides = EMPTY;

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Overrides {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return EMPTY;
    }
    return Object.fromEntries(
      Object.entries(value).filter(
        (entry): entry is [string, boolean] => typeof entry[1] === 'boolean'
      )
    );
  } catch {
    return EMPTY;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedOverrides = parse(raw);
  }
  return cachedOverrides;
}

function getServerSnapshot() {
  return EMPTY;
}

function save(overrides: Overrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    return;
  }
  listeners.forEach((listener) => listener());
}

export function useReviewModeration() {
  const overrides = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isHidden = useCallback(
    (key: string, review: Pick<Review, 'hidden'>) =>
      overrides[key] ?? review.hidden ?? false,
    [overrides]
  );

  const setHidden = useCallback((key: string, hidden: boolean) => {
    save({ ...getSnapshot(), [key]: hidden });
  }, []);

  return { isHidden, setHidden };
}
