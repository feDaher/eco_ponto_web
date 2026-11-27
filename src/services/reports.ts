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

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 20000;

export const MAX_PERIOD_DAYS = 366;

export class ReportApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ReportApiError';
    this.status = status;
  }
}

const MESSAGES: Record<number, string> = {
  400: 'Confira os filtros: o período precisa ser válido e ter no máximo 366 dias.',
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Seu perfil não tem acesso aos relatórios.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
};

const FILE_PREFIXES: Record<ExportScope, string> = {
  general: 'relatorio-geral',
  category: 'tabela-categorias',
  manifests: 'manifestos',
  geospatial: 'trilha-geoespacial',
};

type Rows<T> = { rows: T[]; totalWeightKg: number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function buildQuery(
  filters: ReportFiltersState,
  extra: Record<string, string | number> = {}
) {
  const params = new URLSearchParams({ from: filters.from, to: filters.to });
  const search = filters.search?.trim();

  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.region) params.set('region', filters.region);
  if (filters.status) params.set('status', filters.status);
  if (search) params.set('search', search);
  Object.entries(extra).forEach(([key, value]) =>
    params.set(key, String(value))
  );

  return params.toString();
}

async function request(token: string, path: string): Promise<Response> {
  if (!API_URL) {
    throw new ReportApiError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new ReportApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    throw new ReportApiError(
      MESSAGES[response.status] ??
        'Não foi possível carregar o relatório. Tente novamente.',
      response.status
    );
  }

  return response;
}

async function getJson<T>(
  token: string,
  path: string,
  isValid: (value: unknown) => boolean
): Promise<T> {
  const response = await request(token, path);
  const body: unknown = await response.json().catch(() => null);
  if (!isValid(body)) {
    throw new ReportApiError('Resposta inesperada do servidor.');
  }
  return body as T;
}

function isReportUsers(value: unknown) {
  return (
    isRecord(value) &&
    (value.scope === 'platform' || value.scope === 'collector') &&
    typeof value.total === 'number' &&
    typeof value.newInPeriod === 'number'
  );
}

function hasRows(value: unknown) {
  return isRecord(value) && Array.isArray(value.rows);
}

export function validatePeriod(from: string, to: string): string | null {
  if (!from || !to) return 'Informe a data inicial e a final.';
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 'Período inválido.';
  if (start > end) return 'A data inicial deve ser anterior à final.';
  if ((end - start) / 86400000 + 1 > MAX_PERIOD_DAYS) {
    return `O período pode ter no máximo ${MAX_PERIOD_DAYS} dias.`;
  }
  return null;
}

export function getFilterOptions(token: string) {
  return getJson<FilterOptions>(
    token,
    '/reports/filter-options',
    (value) =>
      isRecord(value) &&
      Array.isArray(value.categories) &&
      Array.isArray(value.regions) &&
      Array.isArray(value.statuses)
  );
}

export function getSummary(token: string, filters: ReportFiltersState) {
  return getJson<ReportSummary>(
    token,
    `/reports/summary?${buildQuery(filters)}`,
    (value) =>
      isRecord(value) &&
      isRecord(value.totals) &&
      isRecord(value.comparison) &&
      isRecord(value.co2) &&
      isRecord(value.activePoints) &&
      isReportUsers(value.users)
  );
}

export async function getByCategory(
  token: string,
  filters: ReportFiltersState
): Promise<CategoryRow[]> {
  const body = await getJson<Rows<CategoryRow>>(
    token,
    `/reports/by-category?${buildQuery(filters)}`,
    hasRows
  );
  return body.rows;
}

export async function getByPoint(
  token: string,
  filters: ReportFiltersState
): Promise<PointRow[]> {
  const body = await getJson<Rows<PointRow>>(
    token,
    `/reports/by-point?${buildQuery(filters)}`,
    hasRows
  );
  return body.rows;
}

export function getManifests(
  token: string,
  filters: ReportFiltersState,
  page: number,
  pageSize: number
) {
  return getJson<Paged<ManifestRow>>(
    token,
    `/reports/manifests?${buildQuery(filters, { page, pageSize })}`,
    (value) => isRecord(value) && Array.isArray(value.items)
  );
}

export async function exportReport(
  token: string,
  filters: ReportFiltersState,
  scope: ExportScope,
  format: ExportFormat
): Promise<void> {
  const response = await request(
    token,
    `/reports/export?${buildQuery(filters, { scope, format })}`
  );
  const blob = await response.blob();
  const prefix =
    scope === 'general' && format === 'pdf'
      ? 'relatorio-oficial'
      : FILE_PREFIXES[scope];

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${prefix}-${filters.from}-a-${filters.to}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
