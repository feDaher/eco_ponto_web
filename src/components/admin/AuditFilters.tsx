'use client';

import { useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/point/fieldStyles';

import { Button } from '@/components/ui/Button';
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filtersToSearchParams,
  parseFilters,
  validateFilters,
  type AuditFiltersValue,
} from '@/lib/filters';
import { formatDateBR } from '@/lib/format';
import { AUDIT_ACTION_LABEL, type AuditAction } from '@/types/audit';

const labelClass = `${LABEL_CLASS} !text-foreground`;
const fieldClass = `${FIELD_CLASS} w-full aria-[invalid=true]:border-red-500`;

interface Chip {
  key: string;
  label: string;
  removeLabel: string;
  next: AuditFiltersValue;
}

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
  const [open, setOpen] = useState(false); // só afeta o celular

  const error = validateFilters(draft);
  const activeCount = countActiveFilters(applied);

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
      className="mt-6 flex flex-col gap-3.5 rounded-3xl bg-surface-alt p-4 md:px-[22px] md:py-5"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="audit-filters-panel"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center justify-between rounded-xl px-1 text-base font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
      >
        Filtros{activeCount > 0 ? ` (${activeCount})` : ''}
        {open ? (
          <ChevronUp className="size-5" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-5" aria-hidden="true" />
        )}
      </button>

      <div
        id="audit-filters-panel"
        className={`${open ? 'flex' : 'hidden'} flex-col gap-4 md:flex`}
      >
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-[1fr_2fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-2 xl:col-span-1">
            <label htmlFor="audit-filter-action" className={labelClass}>
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
              className={fieldClass}
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
            <label htmlFor="audit-filter-user" className={labelClass}>
              Usuário
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="audit-filter-user"
                type="text"
                value={draft.userId}
                placeholder="Nome ou e-mail"
                autoComplete="off"
                onChange={(event) =>
                  setDraft((value) => ({
                    ...value,
                    userId: event.target.value,
                  }))
                }
                className={`${fieldClass} pl-11`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audit-filter-from" className={labelClass}>
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
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audit-filter-to" className={labelClass}>
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
              className={fieldClass}
            />
          </div>
        </div>

        {error && (
          <p
            id="audit-filter-error"
            role="alert"
            className="text-sm font-medium text-red-500 dark:text-red-400"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-semibold text-foreground">
              Filtros aplicados:
            </span>
            {chips.length === 0 && (
              <span className="text-muted-foreground">nenhum</span>
            )}
            {chips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-card py-1 pl-3 pr-1.5 text-foreground"
              >
                {chip.label}
                <button
                  type="button"
                  aria-label={chip.removeLabel}
                  onClick={() => navigate(chip.next)}
                  className="flex size-[22px] items-center justify-center rounded-full bg-surface-accent text-foreground hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2.5 md:ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-12 flex-1 rounded-[14px] border-border bg-background px-5 text-[15px] font-semibold text-foreground hover:bg-accent md:flex-none"
            >
              Limpar
            </Button>
            <Button
              type="submit"
              className="h-12 flex-[2] rounded-[14px] bg-primary px-6 text-[15px] font-semibold text-primary-foreground hover:bg-primary/90 md:flex-none"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
