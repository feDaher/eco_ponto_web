import type { ModerationReview } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;
const PAGE_LIMIT = 100;
const MAX_PAGES = 20;

export class ReviewApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ReviewApiError';
    this.status = status;
  }
}

const MESSAGES: Record<number, string> = {
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Apenas administradores podem moderar avaliações.',
  404: 'Avaliação não encontrada. Ela pode ter sido excluída.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRef(value: unknown): value is { id: string; name: string } {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  );
}

function toReview(value: unknown): ModerationReview | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.rating !== 'number' ||
    !Number.isInteger(value.rating) ||
    value.rating < 1 ||
    value.rating > 5 ||
    (value.comment !== null && typeof value.comment !== 'string') ||
    typeof value.isHidden !== 'boolean' ||
    typeof value.createdAt !== 'string' ||
    typeof value.updatedAt !== 'string' ||
    !isRef(value.author) ||
    !isRef(value.collectionPoint)
  ) {
    return null;
  }

  return {
    id: value.id,
    rating: value.rating as ModerationReview['rating'],
    comment: value.comment,
    isHidden: value.isHidden,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    author: { id: value.author.id, name: value.author.name },
    collectionPoint: {
      id: value.collectionPoint.id,
      name: value.collectionPoint.name,
    },
  };
}

async function request(
  token: string,
  path: string,
  method: 'GET' | 'PATCH' | 'DELETE' = 'GET'
) {
  if (!API_URL) {
    throw new ReviewApiError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new ReviewApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    throw new ReviewApiError(
      MESSAGES[response.status] ??
        'Não foi possível concluir. Tente novamente.',
      response.status
    );
  }

  return response;
}

async function readReview(response: Response) {
  const review = toReview(await response.json().catch(() => null));
  if (!review) {
    throw new ReviewApiError('Resposta inesperada do servidor.');
  }
  return review;
}

export async function listModerationReviews(
  token: string
): Promise<ModerationReview[]> {
  const reviews: ModerationReview[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const params = new URLSearchParams({
      visibility: 'all',
      limit: String(PAGE_LIMIT),
      offset: String(page * PAGE_LIMIT),
    });
    const response = await request(token, `/admin/reviews?${params}`);
    const body: unknown = await response.json().catch(() => null);
    if (!Array.isArray(body)) {
      throw new ReviewApiError('Resposta inesperada do servidor.');
    }

    reviews.push(
      ...body.flatMap((item) => {
        const review = toReview(item);
        return review ? [review] : [];
      })
    );

    const total = Number(response.headers.get('X-Total-Count'));
    const done = Number.isFinite(total)
      ? reviews.length >= total
      : body.length < PAGE_LIMIT;
    if (done || body.length === 0) break;
  }

  return reviews;
}

export async function setReviewHidden(
  token: string,
  id: string,
  hidden: boolean
): Promise<ModerationReview> {
  const action = hidden ? 'hide' : 'unhide';
  const response = await request(
    token,
    `/admin/reviews/${encodeURIComponent(id)}/${action}`,
    'PATCH'
  );
  return readReview(response);
}

export async function deleteReview(token: string, id: string): Promise<void> {
  await request(token, `/admin/reviews/${encodeURIComponent(id)}`, 'DELETE');
}
