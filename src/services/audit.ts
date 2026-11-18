import { mockAuditLogs } from '@/data/mockAuditLogs';
import { MAX_PERIOD_DAYS } from '@/lib/audit';
import type { AuditLogsQuery, AuditLogsResponse } from '@/types/audit';

export class AuditApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuditApiError';
    this.status = status;
  }
}

const MOCK_SETTINGS: {
  delayMs: number;
  forceError: 400 | 401 | 403 | 500 | null;
} = {
  delayMs: 50,
  forceError: null,
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DAY_MS = 86_400_000;

export async function fetchAuditLogs(
  query: AuditLogsQuery
): Promise<AuditLogsResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_SETTINGS.delayMs));

  if (MOCK_SETTINGS.forceError) {
    throw new AuditApiError(MOCK_SETTINGS.forceError, 'Erro simulado no mock');
  }

  const { action, userId, from, to, cursor } = query;

  if (from && to) {
    const span = Date.parse(to) - Date.parse(from);
    if (span < 0 || span > MAX_PERIOD_DAYS * DAY_MS) {
      throw new AuditApiError(400, 'Período inválido');
    }
  }

  let list = mockAuditLogs;
  if (action) list = list.filter((item) => item.action === action);
  if (userId) list = list.filter((item) => item.user?.id === userId);
  if (from) list = list.filter((item) => item.createdAt >= from);
  if (to) list = list.filter((item) => item.createdAt <= to);

  const limit = Math.min(Math.max(query.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);

  let start = 0;
  if (cursor) {
    const index = list.findIndex((item) => item.id === cursor);
    if (index === -1) throw new AuditApiError(400, 'Cursor inválido');
    start = index + 1;
  }

  const items = list.slice(start, start + limit);
  const hasMore = start + limit < list.length;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}
