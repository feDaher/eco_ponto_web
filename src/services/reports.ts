import { getSessionSnapshot } from '@/lib/session';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const session = getSessionSnapshot();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

function buildQueryParams(
  filters: ReportFiltersState,
  extra?: Record<string, string | number>
) {
  const params = new URLSearchParams();
  params.set('from', filters.from);
  params.set('to', filters.to);

  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.region) params.set('region', filters.region);
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      params.set(key, String(value));
    });
  }

  return params.toString();
}

function unwrapArray<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

export const reportsService = {
  async getFilterOptions(): Promise<FilterOptions> {
    const res = await fetch(`${API_URL}/reports/filter-options`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao carregar opções de filtro.');
    return res.json();
  },

  async getSummary(filters: ReportFiltersState): Promise<ReportSummary> {
    const query = buildQueryParams(filters);
    const res = await fetch(`${API_URL}/reports/summary?${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao buscar resumo do período.');
    return res.json();
  },

  async getByCategory(filters: ReportFiltersState): Promise<CategoryRow[]> {
    const query = buildQueryParams(filters);
    const res = await fetch(`${API_URL}/reports/by-category?${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao buscar volume por categoria.');
    const data: unknown = await res.json();
    return unwrapArray<CategoryRow>(data, ['items', 'categories', 'data']);
  },

  async getByPoint(filters: ReportFiltersState): Promise<PointRow[]> {
    const query = buildQueryParams(filters);
    const res = await fetch(`${API_URL}/reports/by-point?${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Error('Erro ao buscar densidade por ponto de coleta.');
    const data: unknown = await res.json();
    return unwrapArray<PointRow>(data, ['items', 'points', 'data']);
  },

  async getManifests(
    filters: ReportFiltersState,
    page = 1,
    pageSize = 5
  ): Promise<Paged<ManifestRow>> {
    const query = buildQueryParams(filters, { page, pageSize });
    const res = await fetch(`${API_URL}/reports/manifests?${query}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao listar manifestos.');
    return res.json();
  },

  async exportFile(
    filters: ReportFiltersState,
    scope: ExportScope,
    format: ExportFormat
  ): Promise<void> {
    const query = buildQueryParams(filters, { scope, format });
    const res = await fetch(`${API_URL}/reports/export?${query}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(
        'Falha ao exportar arquivo. Verifique os filtros selecionados.'
      );
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-${scope}-${filters.from}-a-${filters.to}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
