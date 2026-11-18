'use client';

import { useId, useState, type SubmitEvent } from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import { FIELD_CLASS } from '@/components/point/fieldStyles';
import { Button } from '@/components/ui/Button';
import type { CollectorMaterial } from '@/data/mockCollector';
import { cn } from '@/lib/utils';

type MaterialItemProps = {
  material: CollectorMaterial;
  criticalPercent: number;
  onToggle: (material: CollectorMaterial) => void;
  onLimitChange: (material: CollectorMaterial, capacityKg: number) => void;
};

const kg = (value: number) => value.toLocaleString('pt-BR');

export function fillPercent({ storedKg, capacityKg }: CollectorMaterial) {
  return capacityKg > 0 ? Math.round((storedKg / capacityKg) * 100) : 100;
}

function validateLimit(value: string, storedKg: number) {
  const limit = Number(value);
  if (!value.trim() || !Number.isInteger(limit) || limit <= 0) {
    return { error: 'Informe um número inteiro de quilos maior que zero.' };
  }
  if (limit < storedKg) {
    return {
      error: `O limite não pode ser menor que o estoque atual (${kg(storedKg)} kg).`,
    };
  }
  return { limit };
}

export function MaterialItem({
  material: m,
  criticalPercent,
  onToggle,
  onLimitChange,
}: MaterialItemProps) {
  const fieldId = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fill = fillPercent(m);
  const paused = !m.accepting;
  const critical = !paused && fill >= criticalPercent;

  function startEditing() {
    setDraft(String(m.capacityKg));
    setError(null);
    setEditing(true);
  }

  function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateLimit(draft, m.storedKg);
    if (result.error !== undefined) {
      setError(result.error);
      return;
    }
    onLimitChange(m, result.limit);
    setEditing(false);
  }

  return (
    <li
      className={cn(
        'rounded-2xl border p-4',
        paused && 'border-slate-200 bg-slate-100',
        critical &&
          'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40',
        !paused && !critical && 'border-slate-200 bg-card'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800">{m.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-bold',
              paused && 'bg-slate-200 text-slate-600',
              critical &&
                'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
              !paused && !critical && 'bg-brand-light text-brand-dark'
            )}
          >
            {paused
              ? 'Recepção pausada'
              : critical
                ? 'Quase cheio'
                : 'Aberto para coleta'}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={m.accepting}
            aria-label={`Receber ${m.name}`}
            onClick={() => onToggle(m)}
            className={cn(
              'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              m.accepting ? 'bg-brand-solid' : 'bg-slate-300'
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
                m.accepting ? 'left-5.5' : 'left-0.5'
              )}
            />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-600">
          <strong>{kg(m.storedKg)} kg</strong> de {kg(m.capacityKg)} kg
        </span>
        <span
          className={cn(
            'font-semibold',
            critical ? 'text-red-700 dark:text-red-300' : 'text-slate-600'
          )}
        >
          {paused
            ? `${fill}% · bloqueado para triagem`
            : critical
              ? `${fill}% · risco de transbordo`
              : `${fill}% de ocupação`}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`Ocupação de ${m.name}`}
        aria-valuenow={Math.min(fill, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className={cn(
            'h-full rounded-full transition-all',
            paused && 'bg-slate-400',
            critical && 'bg-red-600 dark:bg-red-500',
            !paused && !critical && 'bg-brand-solid'
          )}
          style={{ width: `${Math.min(fill, 100)}%` }}
        />
      </div>

      {editing ? (
        <form
          onSubmit={save}
          noValidate
          className="mt-3 flex flex-wrap items-start justify-end gap-2"
        >
          <div className="grid gap-1">
            <label htmlFor={fieldId} className="sr-only">
              Novo limite de {m.name} em kg
            </label>
            <div className="flex items-center gap-2">
              <input
                id={fieldId}
                type="number"
                inputMode="numeric"
                min={m.storedKg}
                step={1}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                className={cn(FIELD_CLASS, 'min-h-8 w-28 py-1 text-sm')}
              />
              <span className="text-xs text-slate-500">kg</span>
            </div>
            {error && (
              <p
                id={`${fieldId}-error`}
                role="alert"
                className="max-w-64 text-xs text-red-700 dark:text-red-300"
              >
                {error}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => setEditing(false)}
          >
            <X aria-hidden="true" />
            Cancelar
          </Button>
          <Button type="submit" size="sm" className="cursor-pointer">
            <Check aria-hidden="true" />
            Salvar
          </Button>
        </form>
      ) : (
        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={startEditing}
          >
            <SlidersHorizontal aria-hidden="true" />
            Alterar limite
          </Button>
        </div>
      )}
    </li>
  );
}
