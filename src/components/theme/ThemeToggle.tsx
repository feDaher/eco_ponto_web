'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { applyTheme, useTheme } from './useTheme';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    applyTheme(isDark ? 'light' : 'dark', {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-card text-brand shadow-xs transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-brand',
        className
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          'absolute size-4.5 transition-all duration-500 ease-out',
          isDark
            ? 'scale-50 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute size-4.5 transition-all duration-500 ease-out',
          isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-50 -rotate-90 opacity-0'
        )}
      />
    </button>
  );
}
