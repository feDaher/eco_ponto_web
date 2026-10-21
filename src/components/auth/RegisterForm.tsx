'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  PASSWORD_RULES,
  formatPhone,
  registerSchema,
  type RegisterValues,
} from '@/lib/authSchemas';
import { HOME_BY_ROLE, ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { AuthError } from '@/services/auth';
import {
  AuthField,
  FieldMessage,
  FormError,
  PasswordChecklist,
  PasswordField,
  SUBMIT_CLASS,
} from './AuthField';

type AccountRole = RegisterValues['role'];

const ACCOUNT_TYPES: { role: AccountRole; label: string }[] = [
  { role: 'CITIZEN', label: 'Cidadão' },
  { role: 'COLLECTOR', label: 'Ponto de coleta' },
];

export function RegisterForm() {
  const { status, user, register: registerAccount } = useAuth();
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    trigger,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      role: 'CITIZEN',
      name: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  const role = useWatch({ control, name: 'role' });
  const password = useWatch({ control, name: 'password' });
  const phoneField = register('phone');

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.replace(HOME_BY_ROLE[user.role]);
    }
  }, [status, user, router]);

  const onSubmit = async (values: RegisterValues) => {
    const { role, name, email, phone, city, password } = values;

    try {
      await registerAccount({ role, name, email, phone, city, password });
    } catch (err) {
      if (err instanceof AuthError && err.status === 409) {
        setError(
          'email',
          {
            type: 'server',
            message:
              'Este e-mail já está cadastrado. Entre com ele ou use outro e-mail.',
          },
          { shouldFocus: true }
        );
        return;
      }
      setError('root.server', {
        message:
          err instanceof AuthError
            ? err.message
            : 'Erro inesperado ao criar a conta.',
      });
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
            onClick={() => setValue('role', option.role)}
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 space-y-4"
      >
        <AuthField
          id="name"
          label={role === 'COLLECTOR' ? 'Nome do responsável' : 'Nome completo'}
          autoComplete="name"
          placeholder="João Silva"
          maxLength={191}
          error={errors.name?.message}
          {...register('name')}
        />
        <AuthField
          id="email"
          label="E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nome@email.com"
          maxLength={191}
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            id="phone"
            label="Telefone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="(33) 99999-9999"
            maxLength={15}
            error={errors.phone?.message}
            {...phoneField}
            onChange={(event) => {
              event.target.value = formatPhone(event.target.value);
              return phoneField.onChange(event);
            }}
          />
          <AuthField
            id="city"
            label="Cidade"
            autoComplete="address-level2"
            placeholder="Manhuaçu"
            maxLength={191}
            error={errors.city?.message}
            {...register('city')}
          />
        </div>
        <PasswordField
          id="password"
          label="Senha"
          autoComplete="new-password"
          placeholder="Crie uma senha"
          maxLength={128}
          error={errors.password?.message}
          hint={<PasswordChecklist value={password} rules={PASSWORD_RULES} />}
          {...register('password', {
            onChange: () => {
              if (touchedFields.confirmPassword) {
                void trigger('confirmPassword');
              }
            },
          })}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirmar senha"
          autoComplete="new-password"
          placeholder="Repita a senha"
          maxLength={128}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div>
          <label className="flex items-start gap-2.5 text-xs leading-snug text-slate-500">
            <input
              type="checkbox"
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? 'terms-error' : undefined}
              className={cn(
                'mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-solid',
                errors.terms &&
                  'rounded outline-2 outline-offset-1 outline-red-500'
              )}
              {...register('terms')}
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
          <FieldMessage id="terms" error={errors.terms?.message} />
        </div>

        <FormError message={errors.root?.server?.message} />

        <button type="submit" disabled={isSubmitting} className={SUBMIT_CLASS}>
          {isSubmitting && (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          )}
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          {!isSubmitting && (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
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
