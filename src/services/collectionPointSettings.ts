import type {
  CollectionPointCategory,
  CollectionPointConfiguration,
  CollectionPointSettingsInput,
} from '@/types/collectionPointSettings';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 15000;

export class CollectionPointSettingsError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CollectionPointSettingsError';
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function request(
  token: string,
  path: string,
  method = 'GET',
  body?: unknown
): Promise<unknown> {
  if (!API_URL) {
    throw new CollectionPointSettingsError(
      'API não configurada (NEXT_PUBLIC_API_URL).'
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new CollectionPointSettingsError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const message =
      isRecord(payload) &&
      typeof payload.message === 'string' &&
      payload.message.trim()
        ? payload.message
        : response.status === 401
          ? 'Sua sessão expirou. Entre novamente para continuar.'
          : response.status === 403
            ? 'Seu perfil não tem permissão para gerenciar pontos de coleta.'
            : 'Não foi possível salvar as informações. Confira os campos e tente novamente.';
    throw new CollectionPointSettingsError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

function isCollectionPoint(
  value: unknown
): value is CollectionPointConfiguration {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.hours) &&
    Array.isArray(value.wasteCategories) &&
    typeof value.status === 'string'
  );
}

function isCategoryList(value: unknown): value is CollectionPointCategory[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.active === 'boolean'
    )
  );
}

export async function getMyCollectionPoints(
  token: string
): Promise<CollectionPointConfiguration[]> {
  const value = await request(token, '/collection-points/mine');
  if (!Array.isArray(value) || !value.every(isCollectionPoint)) {
    throw new CollectionPointSettingsError(
      'O servidor retornou uma lista de pontos inválida.'
    );
  }
  return value;
}

export async function getCollectionPointCategories(
  token: string
): Promise<CollectionPointCategory[]> {
  const value = await request(token, '/waste-categories');
  if (!isCategoryList(value)) {
    throw new CollectionPointSettingsError(
      'O servidor retornou uma lista de materiais inválida.'
    );
  }
  return value.filter(({ active }) => active);
}

export async function saveCollectionPoint(
  token: string,
  input: CollectionPointSettingsInput,
  pointId?: string
): Promise<CollectionPointConfiguration> {
  const value = await request(
    token,
    pointId
      ? `/collection-points/${encodeURIComponent(pointId)}`
      : '/collection-points',
    pointId ? 'PUT' : 'POST',
    input
  );
  if (!isCollectionPoint(value)) {
    throw new CollectionPointSettingsError(
      'O servidor retornou um ponto de coleta inválido.'
    );
  }
  return value;
}
