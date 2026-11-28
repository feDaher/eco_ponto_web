import { isInBounds } from '@/lib/geo';
import { daysSince, isOutdated } from '@/lib/points';
import type {
  CollectionPoint,
  OutdatedPoint,
  PointDetails,
  PointFilters,
} from '@/types/api';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(
  /\/+$/,
  ''
);
const TIMEOUT_MS = 10_000;

const PATHS = {
  points: '/collection-points',
  pointById: (id: string) => `/collection-points/${encodeURIComponent(id)}`,
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

async function fetchPublicJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar API pública (${response.status}).`);
  }

  return (await response.json()) as T;
  const data = (await response.json()) as T;
  console.log('[API PUBLICA]', url, data);
  return data;
}

function extractList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.points)) return payload.points;
  return [];
}

function toCollectionPoint(raw: unknown): CollectionPoint | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== 'string' || typeof raw.name !== 'string') return null;

  return {
    ...(raw as unknown as CollectionPoint),
    id: raw.id,
    slug: typeof raw.slug === 'string' ? raw.slug : raw.id,
    name: raw.name,
    address: typeof raw.address === 'string' ? raw.address : '',
    neighborhood: typeof raw.neighborhood === 'string' ? raw.neighborhood : '',
    materials: Array.isArray(raw.materials)
      ? raw.materials.filter(
          (m): m is CollectionPoint['materials'][number] =>
            typeof m === 'string'
        )
      : [],
    status:
      raw.status === 'approved' ||
      raw.status === 'pending' ||
      raw.status === 'rejected' ||
      raw.status === 'removed'
        ? raw.status
        : 'approved',
  };
}

export async function getPoints({
  bounds,
  materials = [],
  query = '',
}: PointFilters = {}): Promise<CollectionPoint[]> {
  try {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (materials.length > 0) params.set('materials', materials.join(','));

    const suffix = params.toString() ? `?${params.toString()}` : '';
    const payload = await fetchPublicJson<unknown>(`${PATHS.points}${suffix}`);
    const q = normalize(query.trim());

    return extractList(payload)
      .map(toCollectionPoint)
      .filter((point): point is CollectionPoint => point !== null)
      .filter(
        (point) =>
          point.status === 'approved' &&
          (!bounds || isInBounds(point, bounds)) &&
          (materials.length === 0 ||
            materials.some((m) => point.materials.includes(m))) &&
          (!q ||
            normalize(
              `${point.name} ${point.address} ${point.neighborhood}`
            ).includes(q))
      );
  } catch {
    return [];
  }
}

export async function getPointBySlug(
  slug: string
): Promise<PointDetails | null> {
  if (!slug.trim()) return null;

  try {
    const allPoints = await getPoints();
    const matched = allPoints.find((p) => p.slug === slug || p.id === slug);
    const targetId = matched?.id ?? slug;

    const payload = await fetchPublicJson<unknown>(PATHS.pointById(targetId));
    const rawPoint =
      isRecord(payload) && isRecord(payload.point) ? payload.point : payload;
    const basePoint = toCollectionPoint(rawPoint);

    if (!basePoint || basePoint.status !== 'approved') return null;

    const rawDetails = isRecord(payload) ? payload : {};
    if (!isRecord(rawDetails.verification)) return null;

    const description =
      typeof rawDetails.description === 'string'
        ? rawDetails.description
        : typeof (rawPoint as Record<string, unknown>)?.description === 'string'
          ? String((rawPoint as Record<string, unknown>).description)
          : '';

    const responsible =
      typeof rawDetails.responsible === 'string' ? rawDetails.responsible : '';

    const schedule = Array.isArray(rawDetails.schedule)
      ? (rawDetails.schedule as PointDetails['schedule'])
      : [];
    const reviews = Array.isArray(rawDetails.reviews)
      ? (rawDetails.reviews as PointDetails['reviews'])
      : [];

    return {
      ...(rawDetails as unknown as PointDetails),
      ...basePoint,
      description,
      responsible,
      schedule,
      reviews,
      verification:
        rawDetails.verification as unknown as PointDetails['verification'],
    };
  } catch {
    return null;
  }
}

export async function getOutdatedPoints(
  now = Date.now()
): Promise<OutdatedPoint[]> {
  try {
    const payload = await fetchPublicJson<unknown>(PATHS.points);
    const items = extractList(payload);

    return items.flatMap((item) => {
      if (!isRecord(item)) return [];
      const point = toCollectionPoint(item);
      if (!point || point.status !== 'approved') return [];

      const updatedAt =
        typeof item.updatedAt === 'string'
          ? item.updatedAt
          : isRecord(item.verification) &&
              typeof item.verification.updatedAt === 'string'
            ? item.verification.updatedAt
            : null;

      if (!updatedAt || !isOutdated(updatedAt, now)) return [];

      return [
        {
          id: point.id,
          slug: point.slug,
          name: point.name,
          address: point.address,
          neighborhood: point.neighborhood,
          materials: point.materials,
          schedule: Array.isArray(item.schedule)
            ? (item.schedule as OutdatedPoint['schedule'])
            : [],
          updatedAt,
          days:
            typeof item.days === 'number'
              ? item.days
              : daysSince(updatedAt, now),
        },
      ];
    });
  } catch {
    return [];
  }
}
