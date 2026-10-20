'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const LABEL_CLASS =
  'mb-1.5 block text-[11px] font-bold tracking-wide text-slate-600 uppercase';

const INPUT_CLASS =
  'min-h-11 w-full rounded-xl border border-slate-200 bg-card py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand';

type AuthFieldProps = Omit<React.ComponentProps<'input'>, 'className'> & {
  id: string;
  label: string;
};

export function AuthField({ id, label, ...props }: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <input id={id} name={id} className={cn(INPUT_CLASS, 'px-4')} {...props} />
    </div>
  );
}

export function PasswordField({
  id,
  label,
  ...props
}: Omit<AuthFieldProps, 'type'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          className={cn(INPUT_CLASS, 'pr-11 pl-4')}
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
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
    >
      {message}
    </p>
  );
}

export const SUBMIT_CLASS =
  'flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-solid text-sm font-semibold text-white transition-colors hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60';
