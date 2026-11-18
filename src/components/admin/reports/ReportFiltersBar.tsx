'use client';

import { Filter, RotateCcw } from 'lucide-react';
import {
  DisposalStatus,
  FilterOptions,
  ReportFiltersState,
} from '@/types/reports';

interface ReportFiltersBarProps {
  filters: ReportFiltersState;
  options: FilterOptions | null;
  onFilterChange: (newFilters: ReportFiltersState) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ReportFiltersBar({
  filters,
  options,
  onFilterChange,
  onSearch,
  onReset,
  isLoading = false,
}: ReportFiltersBarProps) {
  const handleFieldChange = <K extends keyof ReportFiltersState>(
    field: K,
    value: ReportFiltersState[K]
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-card p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-1.5 lg:col-span-4">
          <span className="text-xs font-medium text-slate-600">
            Período de Extração
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              aria-label="Data inicial"
              value={filters.from}
              onChange={(e) => handleFieldChange('from', e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
            />
            <input
              type="date"
              aria-label="Data final"
              value={filters.to}
              onChange={(e) => handleFieldChange('to', e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label
            htmlFor="report-category"
            className="text-xs font-medium text-slate-600"
          >
            Categoria de Resíduo
          </label>
          <select
            id="report-category"
            value={filters.categoryId ?? ''}
            onChange={(e) =>
              handleFieldChange('categoryId', e.target.value || undefined)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
          >
            <option value="">Todas as Categorias</option>
            {options?.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.displayName || cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label
            htmlFor="report-region"
            className="text-xs font-medium text-slate-600"
          >
            Região / Distrito
          </label>
          <select
            id="report-region"
            value={filters.region ?? ''}
            onChange={(e) =>
              handleFieldChange('region', e.target.value || undefined)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
          >
            <option value="">Todas as Regiões</option>
            {options?.regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label
            htmlFor="report-status"
            className="text-xs font-medium text-slate-600"
          >
            Status Homologação
          </label>
          <select
            id="report-status"
            value={filters.status ?? ''}
            onChange={(e) =>
              handleFieldChange(
                'status',
                (e.target.value as DisposalStatus) || ''
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
          >
            <option value="">Todos os Status</option>
            {options?.statuses.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2 lg:col-span-2">
          <button
            type="button"
            onClick={onSearch}
            disabled={isLoading || !filters.from || !filters.to}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-solid px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-solid-hover disabled:opacity-50"
          >
            <Filter aria-hidden="true" className="size-4" />
            {isLoading ? 'Filtrando...' : 'Filtrar'}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            title="Limpar filtros"
            aria-label="Limpar filtros"
            className="inline-flex size-9.5 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
