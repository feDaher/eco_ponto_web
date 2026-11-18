'use client';

import { useEffect, useId, useRef } from 'react';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONES = {
  brand: 'bg-brand-light text-brand',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};

const SIZES = {
  md: 'max-w-lg',
  lg: 'max-w-xl',
};

type ModalProps = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({
  title,
  subtitle,
  icon: Icon,
  tone = 'brand',
  size = 'md',
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-card p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50',
        SIZES[size]
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl',
                TONES[tone]
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="font-bold break-all text-slate-900">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Fechar"
            className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        {children}
      </div>
    </dialog>
  );
}
