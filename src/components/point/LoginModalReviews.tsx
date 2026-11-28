'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModalReviews({ isOpen, onClose }: LoginModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Entrar na conta"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela de login"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
}
