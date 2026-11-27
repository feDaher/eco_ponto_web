import type {
  CategoryDecision,
  CategoryReviewEntry,
  CollectorPoint,
  PendingCategoryRequest,
  PointCategoryLink,
  WasteCategoryOption,
} from '@/types/pointCategories';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;

export const REJECTION_REASON_MAX = 500;

export class PointCategoryApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PointCategoryApiError';
    this.status = status;
  }
}

const MESSAGES: Record<number, string> = {
  400: 'Confira os dados: há categoria inválida ou falta o motivo da rejeição.',
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Seu perfil não tem permissão para esta ação.',
  404: 'Ponto ou categoria não encontrado. Atualize a lista.',
  409: 'Esta categoria já foi revisada por outra pessoa. Atualize a lista.',
  422: 'O ponto precisa manter ao menos uma categoria aprovada.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
};

type Method = 'GET' | 'PUT' | 'PATCH';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function pathId(id: string) {
  return encodeURIComponent(id);
}

async function request(
  path: string,
  options: { token?: string; method?: Method; body?: unknown } = {}
): Promise<Response> {
  if (!API_URL) {
    throw new PointCategoryApiError(
      'API não configurada (NEXT_PUBLIC_API_URL).'
    );
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new PointCategoryApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    throw new PointCategoryApiError(
      MESSAGES[response.status] ??
        'Não foi possível concluir. Tente novamente.',
      response.status
    );
  }

  return response;
}

async function readList<T>(
  response: Response,
  parse: (item: unknown) => T | null
): Promise<T[]> {
  const body: unknown = await response.json().catch(() => null);
  if (!Array.isArray(body)) {
    throw new PointCategoryApiError('Resposta inesperada do servidor.');
  }
  return body.flatMap((item) => {
    const parsed = parse(item);
    return parsed ? [parsed] : [];
  });
}

function toOption(value: unknown): WasteCategoryOption | null {
  if (!isRecord(value) || !isString(value.id) || !isString(value.name)) {
    return null;
  }
  const label =
    isString(value.label) && value.label.trim() ? value.label : null;
  return { id: value.id, code: value.name, label: label ?? value.name };
}

function toLink(value: unknown): PointCategoryLink | null {
  if (
    !isRecord(value) ||
    !isString(value.categoryId) ||
    (value.approvalStatus !== 'PENDING' && value.approvalStatus !== 'APPROVED')
  ) {
    return null;
  }
  const code = isString(value.name)
    ? value.name
    : isString(value.categoryName)
      ? value.categoryName
      : null;
  if (!code) return null;

  return {
    categoryId: value.categoryId,
    code,
    approvalStatus: value.approvalStatus,
    isAccepting: value.isAccepting !== false,
  };
}

function toCollectorPoint(value: unknown): CollectorPoint | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isString(value.status) ||
    !Array.isArray(value.categoryApprovals)
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    status: value.status,
    categories: value.categoryApprovals.flatMap((item) => {
      const link = toLink(item);
      return link ? [link] : [];
    }),
  };
}

function toPendingRequest(value: unknown): PendingCategoryRequest | null {
  if (
    !isRecord(value) ||
    !isString(value.pointId) ||
    !isString(value.pointName) ||
    !isString(value.categoryId) ||
    !isString(value.categoryName)
  ) {
    return null;
  }

  return {
    pointId: value.pointId,
    pointName: value.pointName,
    categoryId: value.categoryId,
    code: value.categoryName,
  };
}

function toReviewer(value: unknown): CategoryReviewEntry['reviewedBy'] {
  if (isRecord(value) && isString(value.id) && isString(value.name)) {
    return { id: value.id, name: value.name };
  }
  return null;
}

function toReviewEntry(value: unknown): CategoryReviewEntry | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.categoryId) ||
    !isString(value.categoryName) ||
    (value.decision !== 'APPROVED' && value.decision !== 'REJECTED') ||
    !isString(value.reviewedAt) ||
    (value.reason !== null && !isString(value.reason))
  ) {
    return null;
  }

  return {
    id: value.id,
    categoryId: value.categoryId,
    code: value.categoryName,
    decision: value.decision,
    reason: value.reason,
    reviewedAt: value.reviewedAt,
    reviewedBy: toReviewer(value.reviewedBy),
  };
}

export async function listWasteCategories(): Promise<WasteCategoryOption[]> {
  const options = await readList(await request('/waste-categories'), toOption);
  return options.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
}

export async function listMyPoints(token: string): Promise<CollectorPoint[]> {
  return readList(
    await request('/collection-points/mine', { token }),
    toCollectorPoint
  );
}

export async function updatePointCategories(
  token: string,
  pointId: string,
  codes: string[]
): Promise<PointCategoryLink[]> {
  const response = await request(
    `/collection-points/${pathId(pointId)}/categories`,
    { token, method: 'PUT', body: { wasteCategories: codes } }
  );
  return readList(response, toLink);
}

export async function listCategoryReviews(
  token: string,
  pointId: string
): Promise<CategoryReviewEntry[]> {
  return readList(
    await request(`/collection-points/${pathId(pointId)}/categories/reviews`, {
      token,
    }),
    toReviewEntry
  );
}

export async function listPendingCategories(
  token: string
): Promise<PendingCategoryRequest[]> {
  return readList(
    await request('/collection-points/admin/pending-categories', { token }),
    toPendingRequest
  );
}

export async function reviewPointCategory(
  token: string,
  pointId: string,
  categoryId: string,
  decision: CategoryDecision,
  rejectionReason?: string
): Promise<void> {
  const reason = rejectionReason?.trim();
  if (decision === 'REJECTED' && !reason) {
    throw new PointCategoryApiError('Informe o motivo da rejeição.');
  }

  await request(
    `/collection-points/${pathId(pointId)}/categories/${pathId(categoryId)}/review`,
    {
      token,
      method: 'PATCH',
      body:
        decision === 'REJECTED'
          ? { status: decision, rejectionReason: reason }
          : { status: decision },
    }
  );
}

export function categoryLabels(options: WasteCategoryOption[]) {
  const labels = new Map(options.map((option) => [option.code, option.label]));
  return (code: string) => labels.get(code) ?? code;
}
