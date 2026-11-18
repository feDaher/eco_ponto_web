'use client';

import { useEffect, useEffectEvent, useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  AUDIT_ACTION_LABEL,
  EMPTY_FILTERS,
  countActiveFilters,
  filtersToSearchParams,
  formatDateBR,
  parseFilters,
  type AuditFiltersValue,
} from '@/lib/audit';
import { cn } from '@/lib/utils';
import type { AuditAction } from '@/types/audit';
import { AuditPeriodPicker } from './AuditPeriodPicker';
import {
  AUDIT_BUTTON_CLASS,
  AUDIT_BUTTON_TONES,
  AUDIT_FIELD_CLASS,
  AUDIT_LABEL_CLASS,
} from './auditStyles';

const USER_DEBOUNCE_MS = 500;

const ALL_ACTIONS = 'all';

const ACTION_OPTIONS: {
  value: AuditAction | typeof ALL_ACTIONS;
  label: string;
}[] = [
  { value: ALL_ACTIONS, label: 'Todas' },
  { value: 'ACCESS_DENIED', label: AUDIT_ACTION_LABEL.ACCESS_DENIED },
  { value: 'RESOURCE_CHANGED', label: AUDIT_ACTION_LABEL.RESOURCE_CHANGED },
];

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const applied = parseFilters(searchParams);

  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState(applied.userId);
  const [syncedUserId, setSyncedUserId] = useState(applied.userId);

  if (applied.userId !== syncedUserId) {
    setSyncedUserId(applied.userId);
    setUserInput(applied.userId);
  }

  const activeCount = countActiveFilters(applied);

  function apply(next: AuditFiltersValue) {
    setSyncedUserId(next.userId);
    setUserInput(next.userId);
    const query = filtersToSearchParams(next).toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const applyUser = useEffectEvent((userId: string) => {
    apply({ ...applied, userId });
  });

  useEffect(() => {
    const userId = userInput.trim();
    if (userId === syncedUserId) return;

    const timer = window.setTimeout(() => applyUser(userId), USER_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [userInput, syncedUserId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply({ ...applied, userId: userInput.trim() });
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
      className="mt-6 flex flex-col gap-3.5 rounded-3xl bg-surface-alt p-4 md:p-5"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="audit-filters-panel"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-1 text-base font-bold text-slate-900 select-none focus-visible:outline-2 focus-visible:outline-brand md:hidden"
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.5fr_1.5fr]">
          <div className="flex flex-col gap-2">
            <span id="audit-filter-action-label" className={AUDIT_LABEL_CLASS}>
              Tipo de ação
            </span>
            <Select
              items={ACTION_OPTIONS}
              value={applied.action || ALL_ACTIONS}
              onValueChange={(value) =>
                apply({
                  ...applied,
                  action:
                    value === ALL_ACTIONS || !value
                      ? ''
                      : (value as AuditAction),
                })
              }
            >
              <SelectTrigger
                aria-labelledby="audit-filter-action-label"
                className={cn(AUDIT_FIELD_CLASS, 'w-full')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audit-filter-user" className={AUDIT_LABEL_CLASS}>
              ID do usuário
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="audit-filter-user"
                type="search"
                value={userInput}
                placeholder="Ex.: usr-001"
                autoComplete="off"
                spellCheck={false}
                aria-describedby="audit-filter-user-hint"
                onChange={(event) => setUserInput(event.target.value)}
                className={cn(AUDIT_FIELD_CLASS, 'w-full pl-10')}
              />
            </div>
            <p
              id="audit-filter-user-hint"
              className="text-xs text-slate-500 select-none"
            >
              Busca automática ao parar de digitar. Dica: clique no nome de um
              usuário na tabela para filtrar por ele.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2 xl:col-span-1">
            <label htmlFor="audit-filter-period" className={AUDIT_LABEL_CLASS}>
              Período
            </label>
            <AuditPeriodPicker
              id="audit-filter-period"
              from={applied.from}
              to={applied.to}
              onChange={(from, to) => apply({ ...applied, from, to })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm select-none">
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
                  onClick={() => apply(chip.next)}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-surface-accent text-slate-800 hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <X aria-hidden="true" className="size-3" strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => apply(EMPTY_FILTERS)}
            disabled={activeCount === 0 && !userInput}
            className={cn(
              AUDIT_BUTTON_CLASS,
              AUDIT_BUTTON_TONES.outline,
              'w-full md:ml-auto md:w-auto'
            )}
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </form>
  );
}
