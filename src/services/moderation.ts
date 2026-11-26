import { z } from 'zod';
import type { PendingPointDTO } from '@/types/api';
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;
const pendingPointSchema = z.object({
  id: z.string(),
  collectorId: z.string(),
  name: z.string(),
  description: z.string(),
  city: z.string(),
  address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  wasteCategories: z.array(z.string()),
  status: z.literal('PENDING'),
  whatsappContact: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  collector: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

const pendingPointsSchema = z.array(pendingPointSchema);

export class ModerationError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ModerationError';
    this.status = status;
  }
}

const MESSAGES: Record<number, string> = {
  400: 'Confira os dados informados.',
  401: 'Sessão expirada. Falça login novamente.',
  403: 'Você não possui permissão para moderar pontos de coleta.',
  404: 'Ponto de coleta não encontrado.',
  409: 'Não foi possível realizar esta decisão. Atualize a fila.',
  422: 'Os dados informados são inválidos.',
  429: 'Muitas solicitações. Tente novamente em instantes.',
};

async function request(
  path: string,
  token: string,
  method: 'GET' | 'PATCH' = 'GET',
  body?: unknown
): Promise<Response> {
  if (!API_URL) {
    throw new ModerationError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch {
    throw new ModerationError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    throw new ModerationError(
      MESSAGES[response.status] ?? 'Não foi possível concluir a operação.',
      response.status
    );
  }

  return response;
}

export async function getPendingPoints(
  token: string
): Promise<PendingPointDTO[]> {
  const response = await request('/collection-points/admin/pending', token);
  const data: unknown = await response.json();
  const result = pendingPointsSchema.safeParse(data);
  if (!result.success) {
    throw new ModerationError('Resposta inesperada do servidor.');
  }

  return result.data;
}

export async function approvePoint(id: string, token: string): Promise<void> {
  await request(
    `/collection-points/${encodeURIComponent(id)}/review`,
    token,
    'PATCH',
    { status: 'APPROVED' }
  );
}

export async function rejectPoint(
  id: string,
  token: string,
  reason: string
): Promise<void> {
  const rejectionReason = reason.trim();

  if (!rejectionReason) {
    throw new ModerationError('Informe o motivo da reprovação.', 400);
  }

  await request(
    `/collection-points/${encodeURIComponent(id)}/review`,
    token,
    'PATCH',
    {
      status: 'REJECTED',
      rejectionReason,
    }
  );
}
