'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, AlertTriangle, Check, Mail } from 'lucide-react';
import {
  CUSTOM_REASON,
  REJECTION_REASONS,
  REMOVAL_REASONS,
} from '@/lib/moderation';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';

export type DecisionAction = 'reject' | 'remove';

export type DecisionResult = {
  reason: string;
  notify: boolean;
};

const decisionSchema = z
  .object({
    reason: z.string('Escolha o motivo da decisão.').min(1, {
      error: 'Escolha o motivo da decisão.',
    }),
    details: z.string(),
    notify: z.boolean(),
  })
  .refine(
    (data) => data.reason !== CUSTOM_REASON || data.details.trim().length >= 10,
    {
      error:
        'Descreva o motivo com pelo menos 10 caracteres. Ele ficará registrado na auditoria.',
      path: ['details'],
    }
  );

type DecisionValues = z.infer<typeof decisionSchema>;

const COPY: Record<
  DecisionAction,
  { title: string; legend: string; confirm: string; reasons: string[] }
> = {
  reject: {
    title: 'Reprovar ponto de coleta',
    legend: 'Motivo técnico da inconformidade',
    confirm: 'Confirmar reprovação',
    reasons: REJECTION_REASONS,
  },
  remove: {
    title: 'Remover ponto homologado',
    legend: 'Justificativa da remoção',
    confirm: 'Confirmar remoção',
    reasons: REMOVAL_REASONS,
  },
};

const LEGEND_CLASS =
  'mb-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase';

type DecisionDialogProps = {
  action: DecisionAction;
  pointName: string;
  onClose: () => void;
  onConfirm: (result: DecisionResult) => void;
};

export function DecisionDialog({
  action,
  pointName,
  onClose,
  onConfirm,
}: DecisionDialogProps) {
  const copy = COPY[action];
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DecisionValues>({
    resolver: zodResolver(decisionSchema),
    mode: 'onTouched',
    defaultValues: { reason: '', details: '', notify: true },
  });
  const reason = useWatch({ control, name: 'reason' });

  const submit = ({ reason, details, notify }: DecisionValues) => {
    onConfirm({
      reason: reason === CUSTOM_REASON ? details.trim() : reason,
      notify,
    });
  };

  return (
    <Modal
      title={copy.title}
      subtitle={pointName}
      icon={AlertTriangle}
      tone="danger"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(submit)} noValidate className="mt-5">
        <fieldset
          aria-describedby={errors.reason ? 'decision-reason-error' : undefined}
        >
          <legend className={LEGEND_CLASS}>{copy.legend}</legend>
          <div className="space-y-2">
            {copy.reasons.map((option) => (
              <label
                key={option}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand',
                  reason === option
                    ? 'border-brand bg-brand-light/40'
                    : errors.reason
                      ? 'border-red-300 dark:border-red-900/60'
                      : 'border-slate-200 hover:bg-slate-50'
                )}
              >
                <input
                  type="radio"
                  value={option}
                  className="mt-0.5 accent-brand-solid"
                  {...register('reason')}
                />
                <span className="font-medium text-slate-800">{option}</span>
              </label>
            ))}
          </div>
          <FieldError
            id="decision-reason-error"
            message={errors.reason?.message}
          />
        </fieldset>

        {reason === CUSTOM_REASON && (
          <div className="mt-4">
            <label htmlFor="decision-details" className={LEGEND_CLASS}>
              Justificativa técnica do fiscal
            </label>
            <textarea
              id="decision-details"
              rows={4}
              autoFocus
              placeholder="Descreva o motivo que ficará registrado na auditoria..."
              aria-invalid={errors.details ? true : undefined}
              aria-describedby={
                errors.details ? 'decision-details-error' : undefined
              }
              className={cn(
                'mt-2 w-full resize-y rounded-xl border px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-2',
                errors.details
                  ? 'border-red-500 bg-red-50/60 focus-visible:ring-red-500/40 dark:border-red-400 dark:bg-red-950/30'
                  : 'border-slate-200 bg-card focus-visible:border-transparent focus-visible:ring-brand'
              )}
              {...register('details')}
            />
            <FieldError
              id="decision-details-error"
              message={errors.details?.message}
            />
          </div>
        )}

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-surface-alt p-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-brand-solid"
            {...register('notify')}
          />
          <Mail
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-brand"
          />
          <span>
            <span className="block font-medium text-slate-800">
              Enviar notificação por e-mail ao solicitante
            </span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              A escolha fica registrada; o envio depende da integração com o
              serviço de e-mail.
            </span>
          </span>
        </label>

        <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-700 dark:hover:bg-red-600"
          >
            <Check aria-hidden="true" className="size-4" />
            {copy.confirm}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
    >
      <AlertCircle aria-hidden="true" className="mt-px size-3.5 shrink-0" />
      {message}
    </p>
  );
}
