'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { HOME_BY_ROLE, ROUTES } from '@/lib/routes';

type AuthActionsProps = {
  variant: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

const STYLES = {
  desktop: {
    link: 'text-sm font-medium text-slate-700 transition-colors hover:text-brand-dark',
    cta: 'rounded-full bg-brand-solid px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover',
  },
  mobile: {
    link: 'w-full py-2 text-center text-sm font-medium text-slate-700 hover:text-brand-dark',
    cta: 'w-full rounded-full bg-brand-solid py-2 text-center text-sm font-medium text-white hover:bg-brand-solid-hover',
  },
};

export function AuthActions({ variant, onNavigate }: AuthActionsProps) {
  const { status, user, logout } = useAuth();
  const styles = STYLES[variant];

  if (status === 'authenticated' && user) {
    return (
      <>
        <Link
          href={HOME_BY_ROLE[user.role]}
          onClick={onNavigate}
          className={styles.link}
        >
          Olá, {user.name.split(' ')[0]}
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className={cn(
            styles.link,
            'inline-flex cursor-pointer items-center justify-center gap-1.5'
          )}
        >
          <LogOut aria-hidden="true" className="size-4" />
          Sair
        </button>
      </>
    );
  }

  return (
    <>
      <Link href={ROUTES.login} onClick={onNavigate} className={styles.link}>
        Entrar
      </Link>
      <Link href={ROUTES.register} onClick={onNavigate} className={styles.cta}>
        Cadastrar-se
      </Link>
    </>
  );
}
