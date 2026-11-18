'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { CategoryAndPointSection } from '@/components/admin/reports/CategoryAndPointSection';
import { ManifestsTable } from '@/components/admin/reports/ManifestsTable';
import { ReportFiltersBar } from '@/components/admin/reports/ReportFiltersBar';
import { ReportSummaryCards } from '@/components/admin/reports/ReportSummaryCards';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  ReportApiError,
  exportReport,
  getByCategory,
  getByPoint,
  getFilterOptions,
  getManifests,
  getSummary,
  validatePeriod,
} from '@/services/reports';
import type {
  CategoryRow,
  ExportFormat,
  ExportScope,
  FilterOptions,
  ManifestRow,
  Paged,
  PointRow,
  ReportFiltersState,
  ReportSummary,
} from '@/types/reports';

const MANIFEST_PAGE_SIZE = 5;

function getInitialPeriod(): ReportFiltersState {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());

  return { from: `${today.slice(0, 8)}01`, to: today };
}

export default function AdminReportsPage() {
  const { token, logout } = useAuth();
  const [draft, setDraft] = useState<ReportFiltersState>(getInitialPeriod);
  const [applied, setApplied] = useState<ReportFiltersState>(getInitialPeriod);
  const [manifestPage, setManifestPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [points, setPoints] = useState<PointRow[]>([]);
  const [manifests, setManifests] = useState<Paged<ManifestRow> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingManifests, setIsLoadingManifests] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toMessage = useCallback(
    (err: unknown) => {
      if (err instanceof ReportApiError) {
        if (err.status === 401) logout();
        return err.message;
      }
      return 'Não foi possível carregar o relatório. Tente novamente.';
    },
    [logout]
  );

  useEffect(() => {
    if (!token) return;
    let active = true;

    getFilterOptions(token)
      .then((result) => {
        if (active) setOptions(result);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let active = true;

    Promise.all([
      getSummary(token, applied),
      getByCategory(token, applied),
      getByPoint(token, applied),
    ])
      .then(([summaryRes, categoryRes, pointRes]) => {
        if (!active) return;
        setSummary(summaryRes);
        setCategories(categoryRes);
        setPoints(pointRes);
      })
      .catch((err: unknown) => {
        if (active) setError(toMessage(err));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, applied, reloadKey, toMessage]);

  useEffect(() => {
    if (!token) return;
    let active = true;

    getManifests(token, applied, manifestPage, MANIFEST_PAGE_SIZE)
      .then((result) => {
        if (active) setManifests(result);
      })
      .catch((err: unknown) => {
        if (active) setError(toMessage(err));
      })
      .finally(() => {
        if (active) setIsLoadingManifests(false);
      });

    return () => {
      active = false;
    };
  }, [token, applied, manifestPage, reloadKey, toMessage]);

  function apply(next: ReportFiltersState) {
    const invalid = validatePeriod(next.from, next.to);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setIsLoading(true);
    setIsLoadingManifests(true);
    setManifestPage(1);
    setApplied({ ...next, search: next.search?.trim() || undefined });
    setReloadKey((key) => key + 1);
  }

  function reset() {
    const initial = getInitialPeriod();
    setDraft(initial);
    apply(initial);
  }

  function changeManifestPage(page: number) {
    setIsLoadingManifests(true);
    setManifestPage(page);
  }

  async function handleExport(scope: ExportScope, format: ExportFormat) {
    if (!token) return;
    setIsExporting(true);
    setError(null);
    try {
      await exportReport(token, applied, scope, format);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setIsExporting(false);
    }
  }

  const exportDisabled = isExporting || isLoading;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand"
            />
            Inteligência de dados
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Relatórios e exportação
          </h1>
          <p className="text-sm text-slate-600">
            Gere e exporte relatórios de descartes, volumes por categoria e
            distribuição geográfica.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer"
            disabled={exportDisabled}
            onClick={() => void handleExport('general', 'csv')}
          >
            <Download aria-hidden="true" />
            Exportar CSV
          </Button>
          <Button
            size="lg"
            className="cursor-pointer"
            disabled={exportDisabled}
            onClick={() => void handleExport('general', 'pdf')}
          >
            <FileText aria-hidden="true" />
            Relatório oficial (PDF)
          </Button>
        </div>
      </header>

      <ReportFiltersBar
        filters={draft}
        options={options}
        onFilterChange={setDraft}
        onSearch={() => apply(draft)}
        onReset={reset}
        isLoading={isLoading}
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <ReportSummaryCards summary={summary} isLoading={isLoading} />

      <CategoryAndPointSection
        categories={categories}
        points={points}
        onExport={(scope, format) => void handleExport(scope, format)}
        isExporting={isExporting}
        isLoading={isLoading}
      />

      <ManifestsTable
        data={manifests}
        search={draft.search ?? ''}
        onSearchChange={(value) => setDraft({ ...draft, search: value })}
        onSearchSubmit={() => apply(draft)}
        onPageChange={changeManifestPage}
        onExport={() => void handleExport('manifests', 'csv')}
        isExporting={isExporting}
        isLoading={isLoadingManifests}
      />
    </div>
  );
}
