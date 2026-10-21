'use client';

import { useSyncExternalStore } from 'react';
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

const FADE_MS = 400;
const REVEAL_MS = 650;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type Origin = { x: number; y: number };

export function applyTheme(theme: Theme, origin?: Origin) {
  const root = document.documentElement;

  const commit = () => {
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    commit();
    return;
  }

  if (!document.startViewTransition) {
    root.classList.add('theme-fading');
    commit();
    window.setTimeout(() => root.classList.remove('theme-fading'), FADE_MS);
    return;
  }

  const { x, y } = origin ?? {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  document
    .startViewTransition(commit)
    .ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: REVEAL_MS,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    })
    .catch(() => {});
}
