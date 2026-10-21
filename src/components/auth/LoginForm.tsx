'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginValues } from '@/lib/authSchemas';
import { HOME_BY_ROLE, ROUTES, safeRedirect } from '@/lib/routes';
import { AuthError } from '@/services/auth';
import { AuthField, FormError, PasswordField, SUBMIT_CLASS } from './AuthField';

export function LoginForm() {
  const { status, user, login } = useAuth();
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get('next'));
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.replace(next ?? HOME_BY_ROLE[user.role]);
    }
  }, [status, user, next, router]);

  const onSubmit = async ({ email, password }: LoginValues) => {
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof AuthError && err.status === 401) {
        setError('password', {
          type: 'server',
          message:
            'E-mail ou senha incorretos. Confira os dados e tente novamente.',
        });
        return;
      }
      setError('root.server', {
        message:
          err instanceof AuthError ? err.message : 'Erro inesperado ao entrar.',
      });
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <AuthField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nome@email.com"
          maxLength={191}
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          id="password"
          label="Senha"
          autoComplete="current-password"
          placeholder="••••••••"
          maxLength={128}
          error={errors.password?.message}
          {...register('password')}
        />

        <FormError message={errors.root?.server?.message} />

        <button type="submit" disabled={isSubmitting} className={SUBMIT_CLASS}>
          {isSubmitting && (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          )}
          {isSubmitting ? 'Entrando...' : 'Entrar no painel'}
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
