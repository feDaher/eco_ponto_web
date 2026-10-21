'use client';

import { useState } from 'react';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const LABEL_CLASS =
  'mb-1.5 block text-[11px] font-bold tracking-wide uppercase';

const INPUT_CLASS =
  'min-h-11 w-full rounded-xl border py-2.5 text-sm text-slate-900 transition-colors outline-none placeholder:text-slate-400 focus-visible:ring-2';

const INPUT_STATE = {
  default:
    'border-slate-200 bg-card focus-visible:border-transparent focus-visible:ring-brand',
  error:
    'border-red-500 bg-red-50/60 focus-visible:ring-red-500/40 dark:border-red-400 dark:bg-red-950/30',
};

type FieldProps = Omit<React.ComponentProps<'input'>, 'className' | 'id'> & {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
};

function describedBy(id: string, error?: string, hint?: React.ReactNode) {
  const ids = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function FieldLabel({
  id,
  label,
  error,
}: Pick<FieldProps, 'id' | 'label' | 'error'>) {
  return (
    <label
      htmlFor={id}
      className={cn(
        LABEL_CLASS,
        error ? 'text-red-600 dark:text-red-400' : 'text-slate-600'
      )}
    >
      {label}
    </label>
  );
}

export function FieldMessage({ id, error }: { id: string; error?: string }) {
  if (!error) return null;

  return (
    <p
      id={`${id}-error`}
      className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
    >
      <AlertCircle aria-hidden="true" className="mt-px size-3.5 shrink-0" />
      {error}
    </p>
  );
}

function FieldHint({ id, hint }: { id: string; hint?: React.ReactNode }) {
  if (!hint) return null;

  return (
    <div id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
      {hint}
    </div>
  );
}

export function AuthField({ id, label, error, hint, ...props }: FieldProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} error={error} />
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(
          INPUT_CLASS,
          INPUT_STATE[error ? 'error' : 'default'],
          'px-4'
        )}
        {...props}
      />
      <FieldMessage id={id} error={error} />
      <FieldHint id={id} hint={hint} />
    </div>
  );
}

export function PasswordField({
  id,
  label,
  error,
  hint,
  ...props
}: Omit<FieldProps, 'type'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <FieldLabel id={id} label={label} error={error} />
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(
            INPUT_CLASS,
            INPUT_STATE[error ? 'error' : 'default'],
            'pr-11 pl-4'
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-xl text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-brand"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>
      <FieldMessage id={id} error={error} />
      <FieldHint id={id} hint={hint} />
    </div>
  );
}

type PasswordChecklistProps = {
  value: string;
  rules: { label: string; test: (value: string) => boolean }[];
};

export function PasswordChecklist({ value, rules }: PasswordChecklistProps) {
  return (
    <ul className="grid gap-1 sm:grid-cols-3">
      {rules.map((rule) => {
        const passed = rule.test(value);

        return (
          <li
            key={rule.label}
            className={cn(
              'flex items-center gap-1.5',
              passed ? 'font-medium text-brand' : 'text-slate-500'
            )}
          >
            {passed ? (
              <Check aria-hidden="true" className="size-3.5 shrink-0" />
            ) : (
              <span
                aria-hidden="true"
                className="mx-1 size-1.5 shrink-0 rounded-full bg-slate-300"
              />
            )}
            {rule.label}
            <span className="sr-only">
              {passed ? ' (atendido)' : ' (pendente)'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}

export const SUBMIT_CLASS =
  'flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-solid text-sm font-semibold text-white transition-colors hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60';
