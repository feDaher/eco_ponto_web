'use client';

import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { CategoryAndPointSection } from '@/components/reports/CategoryAndPointSection';
import { ManifestsTable } from '@/components/reports/ManifestsTable';
import { ReportFiltersBar } from '@/components/reports/ReportFiltersBar';
import { ReportSummaryCards } from '@/components/reports/ReportSummaryCards';
import { reportsService } from '@/services/report.services';
import {
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

function getInitialPeriod(): { from: string; to: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return {
    from: `${year}-${month}-01`,
    to: `${year}-${month}-${day}`,
  };
}

export default function AdminReportsPage() {
  const [filters, setFilters] = useState<ReportFiltersState>(() =>
    getInitialPeriod()
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );

  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [points, setPoints] = useState<PointRow[]>([]);
  const [manifests, setManifests] = useState<Paged<ManifestRow> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initial = getInitialPeriod();

    reportsService
      .getFilterOptions()
      .then((options) => {
        if (isMounted) setFilterOptions(options);
      })
      .catch(() => {});

    Promise.all([
      reportsService.getSummary(initial),
      reportsService.getByCategory(initial),
      reportsService.getByPoint(initial),
      reportsService.getManifests(initial, 1, 5),
    ])
      .then(([summaryRes, categoryRes, pointRes, manifestsRes]) => {
        if (!isMounted) return;
        setSummary(summaryRes);
        setCategories(categoryRes);
        setPoints(pointRes);
        setManifests(manifestsRes);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar os dados do relatório.'
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchReportData = async (
    currentFilters: ReportFiltersState,
    page = 1
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryRes, categoryRes, pointRes, manifestsRes] =
        await Promise.all([
          reportsService.getSummary(currentFilters),
          reportsService.getByCategory(currentFilters),
          reportsService.getByPoint(currentFilters),
          reportsService.getManifests(currentFilters, page, 5),
        ]);

      setSummary(summaryRes);
      setCategories(categoryRes);
      setPoints(pointRes);
      setManifests(manifestsRes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar os dados do relatório.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchReportData(filters, 1);
  };

  const handleReset = () => {
    const initial = getInitialPeriod();
    setFilters(initial);
    fetchReportData(initial, 1);
  };

  const handlePageChange = async (newPage: number) => {
    try {
      const manifestsRes = await reportsService.getManifests(
        filters,
        newPage,
        5
      );
      setManifests(manifestsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao mudar de página.');
    }
  };

  const handleExport = async (scope: ExportScope, format: ExportFormat) => {
    setIsExporting(true);
    setError(null);

    try {
      await reportsService.exportFile(filters, scope, format);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao exportar o relatório.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Relatórios e Exportação de Dados
          </h1>
          <p className="text-sm text-slate-600">
            Gere e exporte relatórios analíticos de descartes, volumes por
            categoria e distribuição geográfica.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isExporting || !filters.from || !filters.to}
            onClick={() => handleExport('general', 'csv')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-card px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="size-4" />
            Exportar CSV (.csv)
          </button>

          <button
            type="button"
            disabled={isExporting || !filters.from || !filters.to}
            onClick={() => handleExport('general', 'pdf')}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-solid px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-solid-hover disabled:opacity-50"
          >
            <FileText className="size-4" />
            Exportar Relatório Oficial (PDF)
          </button>
        </div>
      </header>

      <ReportFiltersBar
        filters={filters}
        options={filterOptions}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <ReportSummaryCards summary={summary} isLoading={isLoading} />

      <CategoryAndPointSection
        categories={categories}
        points={points}
        onExport={handleExport}
        isExporting={isExporting}
        isLoading={isLoading}
      />

      <ManifestsTable
        data={manifests}
        search={filters.search ?? ''}
        onSearchChange={(value) =>
          setFilters({ ...filters, search: value || undefined })
        }
        onRefresh={handleSearch}
        onPageChange={handlePageChange}
        onExportManifests={() => handleExport('manifests', 'csv')}
        isLoading={isLoading}
      />
    </div>
  );
}
