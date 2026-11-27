import { toUser } from '@/services/auth';
import type { DisposalCategoryTotal, DisposalSummary } from '@/types/account';
import type { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;

export class AccountApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AccountApiError';
    this.status = status;
  }
}

export type ProfileUpdate = Pick<User, 'name' | 'phone' | 'city'>;

const MESSAGES: Record<number, string> = {
  400: 'Confira os dados informados e tente novamente.',
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Sua conta está bloqueada. Entre em contato com a administração do EcoPonto.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

const API_MESSAGE_STATUSES = new Set([400, 404, 409, 502]);

async function readApiMessage(response: Response) {
  if (!API_MESSAGE_STATUSES.has(response.status)) return null;
  const body: unknown = await response.json().catch(() => null);
  if (!isRecord(body) || typeof body.message !== 'string') return null;
  const message = body.message.replace(/^Validation error:\s*/i, '').trim();
  return message ? message : null;
}

async function request(
  token: string,
  method: 'GET' | 'PATCH' | 'DELETE',
  path: string,
  messages: Record<number, string>,
  body?: unknown
) {
  if (!API_URL) {
    throw new AccountApiError('API não configurada (NEXT_PUBLIC_API_URL).');
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
    throw new AccountApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    const apiMessage = await readApiMessage(response);
    throw new AccountApiError(
      apiMessage ??
        messages[response.status] ??
        MESSAGES[response.status] ??
        'Não foi possível concluir. Tente novamente.',
      response.status
    );
  }

  return response;
}

function toCategory(value: unknown): DisposalCategoryTotal | null {
  if (!isRecord(value)) return null;

  const name = [value.displayName, value.name, value.categoryName].find(
    (item): item is string => typeof item === 'string' && item.length > 0
  );
  const weightKg = toNumber(value.weightKg) ?? toNumber(value.totalWeightKg);
  const disposals =
    toNumber(value.disposals) ??
    toNumber(value.totalDisposals) ??
    toNumber(value.count) ??
    0;

  return name && weightKg !== null ? { name, weightKg, disposals } : null;
}

function toSummary(value: unknown): DisposalSummary | null {
  if (!isRecord(value) || !Array.isArray(value.byCategory)) return null;

  const totalDisposals = toNumber(value.totalDisposals);
  const totalWeightKg = toNumber(value.totalWeightKg);
  const totalPoints = toNumber(value.totalPoints);
  if (
    totalDisposals === null ||
    totalWeightKg === null ||
    totalPoints === null
  ) {
    return null;
  }

  return {
    totalDisposals,
    totalWeightKg,
    totalPoints,
    byCategory: value.byCategory
      .map(toCategory)
      .filter((item): item is DisposalCategoryTotal => item !== null),
  };
}

export async function getDisposalSummary(
  token: string
): Promise<DisposalSummary> {
  const response = await request(token, 'GET', '/disposals/me/summary', {
    403: 'O resumo de descartes está disponível só para cidadãos.',
  });

  const summary = toSummary(await response.json().catch(() => null));
  if (!summary) throw new AccountApiError('Resposta inesperada do servidor.');
  return summary;
}

export async function updateProfile(
  token: string,
  current: User,
  changes: ProfileUpdate
): Promise<User> {
  const response = await request(
    token,
    'PATCH',
    '/users/me',
    {
      404: 'A API ainda não tem a rota PATCH /users/me para salvar o perfil.',
    },
    changes
  );

  if (response.status === 204) return { ...current, ...changes };

  const user = toUser(await response.json().catch(() => null));
  if (!user) throw new AccountApiError('Resposta inesperada do servidor.');
  return user;
}

export async function deleteAccount(token: string): Promise<void> {
  await request(token, 'DELETE', '/users/me', {
    404: 'A API ainda não tem a rota DELETE /users/me para excluir a conta.',
  });
}
