import type { AuditAction, AuditLogsQuery } from '@/types/audit';

export const MAX_PERIOD_DAYS = 90;

/** Valores dos filtros como ficam na URL. `from` e `to` são datas "YYYY-MM-DD". */
export interface AuditFiltersValue {
  action: AuditAction | '';
  userId: string;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: AuditFiltersValue = {
  action: '',
  userId: '',
  from: '',
  to: '',
};

type ParamsReader = { get(name: string): string | null };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// O Brasil não tem mais horário de verão, então Brasília é sempre UTC-3.
const BRASILIA_OFFSET = '-03:00';

function isAction(value: string | null): value is AuditAction {
  return value === 'ACCESS_DENIED' || value === 'RESOURCE_CHANGED';
}

function validDate(value: string | null): string {
  if (!value || !DATE_RE.test(value)) return '';
  return Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ? '' : value;
}

/** Lê os filtros da URL, ignorando valores inválidos. */
export function parseFilters(params: ParamsReader): AuditFiltersValue {
  const action = params.get('action');
  return {
    action: isAction(action) ? action : '',
    userId: (params.get('userId') ?? '').trim(),
    from: validDate(params.get('from')),
    to: validDate(params.get('to')),
  };
}

export function filtersToSearchParams(
  filters: AuditFiltersValue
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.action) params.set('action', filters.action);
  if (filters.userId.trim()) params.set('userId', filters.userId.trim());
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  return params;
}

/** Quantidade de filtros ativos. O período (inicial e/ou final) conta como um só. */
export function countActiveFilters(filters: AuditFiltersValue): number {
  return (
    (filters.action ? 1 : 0) +
    (filters.userId ? 1 : 0) +
    (filters.from || filters.to ? 1 : 0)
  );
}

/** Mesma regra do BE-18: período com no máximo 90 dias. Retorna a mensagem de erro ou null. */
export function validateFilters(filters: AuditFiltersValue): string | null {
  if (filters.from && filters.to) {
    const days =
      (Date.parse(`${filters.to}T00:00:00Z`) -
        Date.parse(`${filters.from}T00:00:00Z`)) /
      86_400_000;
    if (days < 0) return 'A data inicial não pode ser depois da data final.';
    if (days + 1 > MAX_PERIOD_DAYS) {
      return `O período pode ter no máximo ${MAX_PERIOD_DAYS} dias.`;
    }
  }
  return null;
}

/** Converte os filtros da tela para os parâmetros da API (datas em ISO 8601, dia inteiro em Brasília). */
export function toQuery(
  filters: AuditFiltersValue
): Pick<AuditLogsQuery, 'action' | 'userId' | 'from' | 'to'> {
  return {
    action: filters.action || undefined,
    userId: filters.userId || undefined,
    from: filters.from
      ? new Date(`${filters.from}T00:00:00.000${BRASILIA_OFFSET}`).toISOString()
      : undefined,
    to: filters.to
      ? new Date(`${filters.to}T23:59:59.999${BRASILIA_OFFSET}`).toISOString()
      : undefined,
  };
}
