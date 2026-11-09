import type { AuditAction, AuditLogsQuery } from '@/types/audit';

export const MAX_PERIOD_DAYS = 90;

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  ACCESS_DENIED: 'Acesso negado',
  RESOURCE_CHANGED: 'Alteração',
};

export type AuditFiltersValue = {
  action: AuditAction | '';
  userId: string;
  from: string;
  to: string;
};

export const EMPTY_FILTERS: AuditFiltersValue = {
  action: '',
  userId: '',
  from: '',
  to: '',
};

type ParamsReader = { get(name: string): string | null };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BRASILIA_OFFSET = '-03:00';
const TIME_ZONE = 'America/Sao_Paulo';
const DAY_MS = 86_400_000;

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function isAction(value: string | null): value is AuditAction {
  return value === 'ACCESS_DENIED' || value === 'RESOURCE_CHANGED';
}

function validDate(value: string | null): string {
  if (!value || !DATE_RE.test(value)) return '';
  return Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ? '' : value;
}

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

export function auditUserHref(
  pathname: string,
  filters: AuditFiltersValue,
  userId: string
) {
  const query = filtersToSearchParams({ ...filters, userId }).toString();
  return `${pathname}?${query}`;
}

export function countActiveFilters(filters: AuditFiltersValue): number {
  return (
    (filters.action ? 1 : 0) +
    (filters.userId ? 1 : 0) +
    (filters.from || filters.to ? 1 : 0)
  );
}

export function validateFilters(filters: AuditFiltersValue): string | null {
  if (filters.from && filters.to) {
    const days =
      (Date.parse(`${filters.to}T00:00:00Z`) -
        Date.parse(`${filters.from}T00:00:00Z`)) /
      DAY_MS;
    if (days < 0) return 'A data inicial não pode ser depois da data final.';
    if (days + 1 > MAX_PERIOD_DAYS) {
      return `O período pode ter no máximo ${MAX_PERIOD_DAYS} dias.`;
    }
  }
  return null;
}

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

export function formatDateTime(iso: string): { date: string; time: string } {
  const date = new Date(iso);
  return { date: dateFormatter.format(date), time: timeFormatter.format(date) };
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
