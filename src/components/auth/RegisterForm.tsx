'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HOME_BY_ROLE, ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { AuthError } from '@/services/auth';
import type { RegisterInput } from '@/types/user';
import { AuthField, FormError, PasswordField, SUBMIT_CLASS } from './AuthField';

type AccountRole = RegisterInput['role'];

const ACCOUNT_TYPES: { role: AccountRole; label: string }[] = [
  { role: 'CITIZEN', label: 'Cidadão' },
  { role: 'COLLECTOR', label: 'Ponto de coleta' },
];

export function RegisterForm() {
  const { status, user, register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>('CITIZEN');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.replace(HOME_BY_ROLE[user.role]);
    }
  }, [status, user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? '').trim();

    if (data.get('password') !== data.get('confirmPassword')) {
      setError('As senhas não coincidem.');
      return;
    }

    setError(null);
    setPending(true);
    try {
      await register({
        name: field('name'),
        email: field('email'),
        phone: field('phone'),
        city: field('city'),
        password: String(data.get('password')),
        role,
      });
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err.message
          : 'Erro inesperado ao criar a conta.'
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Criar conta
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">
        Cadastre-se para acompanhar seus descartes ou gerenciar um ponto de
        coleta.
      </p>

      <div
        role="group"
        aria-label="Tipo de conta"
        className="mt-6 flex rounded-xl border border-slate-200 bg-slate-100 p-1"
      >
        {ACCOUNT_TYPES.map((option) => (
          <button
            key={option.role}
            type="button"
            aria-pressed={role === option.role}
            onClick={() => setRole(option.role)}
            className={cn(
              'flex-1 cursor-pointer rounded-lg py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand',
              role === option.role
                ? 'bg-card text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <AuthField
          id="name"
          maxLength={191}
          label={role === 'COLLECTOR' ? 'Nome do responsável' : 'Nome completo'}
          autoComplete="name"
          placeholder="João Silva"
          required
        />
        <AuthField
          id="email"
          maxLength={191}
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="nome@email.com"
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            id="phone"
            maxLength={20}
            label="Telefone"
            type="tel"
            autoComplete="tel"
            placeholder="(33) 99999-9999"
            minLength={8}
            required
          />
          <AuthField
            id="city"
            maxLength={191}
            label="Cidade"
            autoComplete="address-level2"
            placeholder="Manhuaçu"
            required
          />
        </div>
        <PasswordField
          id="password"
          maxLength={128}
          label="Senha"
          autoComplete="new-password"
          placeholder="Mínimo de 6 caracteres"
          minLength={6}
          required
        />
        <PasswordField
          id="confirmPassword"
          maxLength={128}
          label="Confirmar senha"
          autoComplete="new-password"
          placeholder="Repita a senha"
          minLength={6}
          required
        />

        <label className="flex items-start gap-2.5 text-xs leading-snug text-slate-500">
          <input
            type="checkbox"
            required
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-solid"
          />
          <span>
            Eu concordo com os{' '}
            <Link
              href="/termos"
              className="font-semibold text-slate-700 underline"
            >
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link
              href="/privacidade"
              className="font-semibold text-slate-700 underline"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>

        <FormError message={error} />

        <button type="submit" disabled={pending} className={SUBMIT_CLASS}>
          {pending && (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          )}
          {pending ? 'Criando conta...' : 'Criar conta'}
          {!pending && <ArrowRight aria-hidden="true" className="size-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem uma conta?{' '}
        <Link
          href={ROUTES.login}
          className="font-semibold text-brand hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
