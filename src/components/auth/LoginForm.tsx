'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HOME_BY_ROLE, ROUTES, safeRedirect } from '@/lib/routes';
import { AuthError } from '@/services/auth';
import { AuthField, FormError, PasswordField, SUBMIT_CLASS } from './AuthField';

export function LoginForm() {
  const { status, user, login } = useAuth();
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get('next'));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.replace(next ?? HOME_BY_ROLE[user.role]);
    }
  }, [status, user, next, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setError(null);
    setPending(true);
    try {
      await login(String(data.get('email')), String(data.get('password')));
    } catch (err) {
      setError(
        err instanceof AuthError ? err.message : 'Erro inesperado ao entrar.'
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Bem-vindo de volta
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Insira seus dados para acessar seu painel.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AuthField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="nome@email.com"
          required
        />
        <PasswordField
          id="password"
          label="Senha"
          autoComplete="current-password"
          placeholder="••••••••"
          minLength={6}
          required
        />

        <FormError message={error} />

        <button type="submit" disabled={pending} className={SUBMIT_CLASS}>
          {pending && (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          )}
          {pending ? 'Entrando...' : 'Entrar no painel'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Não tem uma conta?{' '}
        <Link
          href={ROUTES.register}
          className="font-semibold text-brand hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
