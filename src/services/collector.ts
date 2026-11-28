import {
  categoryLabels,
  listWasteCategories,
} from '@/services/pointCategories';
import type { PointStatus, Weekday } from '@/types/api';
import type { CollectionPointWeekday } from '@/types/collectionPointSettings';
import type {
  CollectorCategory,
  CollectorHour,
  CollectorPoint,
  WeeklyHour,
} from '@/types/collector';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;

export const WEEKDAYS: Record<CollectionPointWeekday, Weekday> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const STATUSES: Record<string, PointStatus> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  INACTIVE: 'removed',
};

const MESSAGES: Record<number, string> = {
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Seu perfil não tem permissão para acessar o painel do coletor.',
  404: 'Ponto de coleta ou horário não encontrado. Atualize a página.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
};

export class CollectorApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CollectorApiError';
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

async function request(
  token: string,
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown
) {
  if (!API_URL) {
    throw new CollectorApiError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new CollectorApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    const payload: unknown =
      response.status === 400 ? await response.json().catch(() => null) : null;
    const apiMessage =
      isRecord(payload) && isString(payload.message) ? payload.message : null;
    throw new CollectorApiError(
      apiMessage ??
        MESSAGES[response.status] ??
        'Não foi possível concluir. Tente novamente.',
      response.status
    );
  }

  return response;
}

function toHour(value: unknown): CollectorHour | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.weekday) ||
    !(value.weekday in WEEKDAYS) ||
    !isString(value.openTime) ||
    !isString(value.closeTime) ||
    value.isActive === false
  ) {
    return null;
  }

  return {
    id: value.id,
    weekday: value.weekday as CollectionPointWeekday,
    openTime: value.openTime,
    closeTime: value.closeTime,
  };
}

function toCategory(
  value: unknown,
  label: (code: string) => string
): CollectorCategory | null {
  if (
    !isRecord(value) ||
    !isString(value.categoryId) ||
    !isString(value.name) ||
    (value.approvalStatus !== 'PENDING' && value.approvalStatus !== 'APPROVED')
  ) {
    return null;
  }

  return {
    categoryId: value.categoryId,
    code: value.name,
    label: label(value.name),
    approvalStatus: value.approvalStatus,
    isAccepting: value.isAccepting !== false,
  };
}

function toCooperative(value: unknown): CollectorPoint['cooperative'] {
  if (
    !isRecord(value) ||
    !isString(value.cooperativeName) ||
    !isString(value.cnpj)
  ) {
    return null;
  }

  return {
    name: value.cooperativeName,
    cnpj: value.cnpj,
    neighborhood: isString(value.neighborhood) ? value.neighborhood : '',
    postalCode: isString(value.postalCode) ? value.postalCode : '',
  };
}

function toPoint(
  value: unknown,
  label: (code: string) => string
): CollectorPoint | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isString(value.status) ||
    !(value.status in STATUSES) ||
    !Array.isArray(value.hours) ||
    !Array.isArray(value.categoryApprovals)
  ) {
    return null;
  }

  const hours = value.hours.flatMap((item) => {
    const hour = toHour(item);
    return hour ? [hour] : [];
  });

  return {
    id: value.id,
    name: value.name,
    address: isString(value.address) ? value.address : '',
    city: isString(value.city) ? value.city : '',
    status: STATUSES[value.status],
    hours,
    schedule: hours.map((hour) => ({
      weekdays: [WEEKDAYS[hour.weekday]],
      opens: hour.openTime,
      closes: hour.closeTime,
    })),
    categories: value.categoryApprovals.flatMap((item) => {
      const category = toCategory(item, label);
      return category ? [category] : [];
    }),
    isOutdated: value.isOutdated === true,
    hoursConfirmedAt: isString(value.hoursConfirmedAt)
      ? value.hoursConfirmedAt
      : null,
    cooperative: toCooperative(value.cooperative),
  };
}

export async function getCollectorPoints(
  token: string
): Promise<CollectorPoint[]> {
  const [response, options] = await Promise.all([
    request(token, '/collection-points/mine'),
    listWasteCategories().catch(() => []),
  ]);
  const body: unknown = await response.json().catch(() => null);

  if (!Array.isArray(body)) {
    throw new CollectorApiError('Resposta inesperada do servidor.');
  }

  const label = categoryLabels(options);
  return body.flatMap((item) => {
    const point = toPoint(item, label);
    return point ? [point] : [];
  });
}

export async function saveWeeklyHours(
  token: string,
  point: CollectorPoint,
  next: WeeklyHour[]
): Promise<void> {
  const byDay = new Map(next.map((hour) => [hour.weekday, hour]));
  const kept = new Set<CollectionPointWeekday>();

  for (const hour of point.hours) {
    const wanted = byDay.get(hour.weekday);

    if (!wanted || kept.has(hour.weekday)) {
      await request(
        token,
        `/operating-hours/${encodeURIComponent(hour.id)}`,
        'DELETE'
      );
      continue;
    }

    kept.add(hour.weekday);
    if (
      wanted.openTime !== hour.openTime ||
      wanted.closeTime !== hour.closeTime
    ) {
      await request(
        token,
        `/operating-hours/${encodeURIComponent(hour.id)}`,
        'PUT',
        { openTime: wanted.openTime, closeTime: wanted.closeTime }
      );
    }
  }

  for (const hour of next) {
    if (kept.has(hour.weekday)) continue;
    await request(
      token,
      `/collection-points/${encodeURIComponent(point.id)}/operating-hours`,
      'POST',
      hour
    );
  }
}
