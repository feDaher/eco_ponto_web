'use client';

import { useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ChevronDown, Search, X } from 'lucide-react';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/point/fieldStyles';
import {
  AUDIT_ACTION_LABEL,
  EMPTY_FILTERS,
  countActiveFilters,
  filtersToSearchParams,
  formatDateBR,
  parseFilters,
  validateFilters,
  type AuditFiltersValue,
} from '@/lib/audit';
import { cn } from '@/lib/utils';
import type { AuditAction } from '@/types/audit';
import { AUDIT_BUTTON_CLASS, AUDIT_BUTTON_TONES } from './auditStyles';

const FIELD_STATE = {
  default: FIELD_CLASS,
  error:
    'min-h-10 rounded-xl border border-red-500 bg-red-50/60 px-3 py-2 font-normal text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 dark:border-red-400 dark:bg-red-950/30',
};

type Chip = {
  key: string;
  label: string;
  removeLabel: string;
  next: AuditFiltersValue;
};

function periodLabel(from: string, to: string): string {
  if (from && to) return `Período: ${formatDateBR(from)} a ${formatDateBR(to)}`;
  if (from) return `Período: a partir de ${formatDateBR(from)}`;
  return `Período: até ${formatDateBR(to)}`;
}

export function AuditFilters() {
  const searchParams = useSearchParams();
  return (
    <FiltersForm
      key={searchParams.toString()}
      applied={parseFilters(searchParams)}
    />
  );
}

function FiltersForm({ applied }: { applied: AuditFiltersValue }) {
  const router = useRouter();
  const pathname = usePathname();

  const [draft, setDraft] = useState<AuditFiltersValue>(applied);
  const [open, setOpen] = useState(false);

  const error = validateFilters(draft);
  const activeCount = countActiveFilters(applied);
  const dateField = error ? FIELD_STATE.error : FIELD_STATE.default;

  function navigate(next: AuditFiltersValue) {
    const query = filtersToSearchParams(next).toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (error) return;
    navigate(draft);
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS);
    navigate(EMPTY_FILTERS);
  }

  const chips: Chip[] = [];
  if (applied.action) {
    chips.push({
      key: 'action',
      label: `Ação: ${AUDIT_ACTION_LABEL[applied.action]}`,
      removeLabel: 'Remover filtro de ação',
      next: { ...applied, action: '' },
    });
  }
  if (applied.userId) {
    chips.push({
      key: 'user',
      label: `Usuário: ${applied.userId}`,
      removeLabel: 'Remover filtro de usuário',
      next: { ...applied, userId: '' },
    });
  }
  if (applied.from || applied.to) {
    chips.push({
      key: 'period',
      label: periodLabel(applied.from, applied.to),
      removeLabel: 'Remover filtro de período',
      next: { ...applied, from: '', to: '' },
    });
  }

  return (
    <form
      aria-label="Filtros da trilha de auditoria"
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 flex flex-col gap-3.5 rounded-3xl bg-surface-alt p-4 md:px-5 md:py-5"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="audit-filters-panel"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-1 text-base font-bold text-slate-900 focus-visible:outline-2 focus-visible:outline-brand md:hidden"
      >
        Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
        <ChevronDown
          aria-hidden="true"
          className={cn('size-5 transition-transform', open && 'rotate-180')}
        />
      </button>

      <div
        id="audit-filters-panel"
        className={cn('flex-col gap-4 md:flex', open ? 'flex' : 'hidden')}
      >
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-[1fr_2fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-2 xl:col-span-1">
            <label htmlFor="audit-filter-action" className={LABEL_CLASS}>
              Tipo de ação
            </label>
            <select
              id="audit-filter-action"
              value={draft.action}
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  action: event.target.value as AuditAction | '',
                }))
              }
              className={cn(FIELD_CLASS, 'w-full')}
            >
              <option value="">Todas</option>
              <option value="ACCESS_DENIED">
                {AUDIT_ACTION_LABEL.ACCESS_DENIED}
              </option>
              <option value="RESOURCE_CHANGED">
                {AUDIT_ACTION_LABEL.RESOURCE_CHANGED}
              </option>
            </select>
          </div>

          <div className="col-span-2 flex flex-col gap-2 xl:col-span-1">
            <label htmlFor="audit-filter-user" className={LABEL_CLASS}>
              ID do usuário
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="audit-filter-user"
                type="text"
                value={draft.userId}
                placeholder="Ex.: usr-001"
                autoComplete="off"
                spellCheck={false}
                aria-describedby="audit-filter-user-hint"
                onChange={(event) =>
                  setDraft((value) => ({
                    ...value,
                    userId: event.target.value,
                  }))
                }
                className={cn(FIELD_CLASS, 'w-full pl-10')}
              />
            </div>
            <p id="audit-filter-user-hint" className="text-xs text-slate-500">
              Dica: clique no nome de um usuário na tabela para filtrar por ele.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audit-filter-from" className={LABEL_CLASS}>
              Data inicial
            </label>
            <input
              id="audit-filter-from"
              type="date"
              value={draft.from}
              max={draft.to || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'audit-filter-error' : undefined}
              onChange={(event) =>
                setDraft((value) => ({ ...value, from: event.target.value }))
              }
              className={cn(dateField, 'w-full')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audit-filter-to" className={LABEL_CLASS}>
              Data final
            </label>
            <input
              id="audit-filter-to"
              type="date"
              value={draft.to}
              min={draft.from || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'audit-filter-error' : undefined}
              onChange={(event) =>
                setDraft((value) => ({ ...value, to: event.target.value }))
              }
              className={cn(dateField, 'w-full')}
            />
          </div>
        </div>

        {error && (
          <p
            id="audit-filter-error"
            role="alert"
            className="flex items-start gap-1.5 text-sm font-medium text-red-600 dark:text-red-400"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900">
              Filtros aplicados:
            </span>
            {chips.length === 0 && (
              <span className="text-slate-500">nenhum</span>
            )}
            {chips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-card py-1 pr-1.5 pl-3 text-slate-800"
              >
                {chip.label}
                <button
                  type="button"
                  aria-label={chip.removeLabel}
                  onClick={() => navigate(chip.next)}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-surface-accent text-slate-800 hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <X aria-hidden="true" className="size-3" strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2.5 md:ml-auto">
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                AUDIT_BUTTON_CLASS,
                AUDIT_BUTTON_TONES.outline,
                'flex-1 md:flex-none'
              )}
            >
              Limpar
            </button>
            <button
              type="submit"
              disabled={Boolean(error)}
              className={cn(
                AUDIT_BUTTON_CLASS,
                AUDIT_BUTTON_TONES.primary,
                'flex-2 md:flex-none'
              )}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
