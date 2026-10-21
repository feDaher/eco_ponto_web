import { mockPointDetails } from '@/data/mockPointDetails';
import { mockPoints } from '@/data/mockPoints';
import { isInBounds } from '@/lib/geo';
import { daysSince, isOutdated } from '@/lib/points';
import type {
  CollectionPoint,
  OutdatedPoint,
  PointDetails,
  PointFilters,
} from '@/types/api';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export async function getPoints({
  bounds,
  materials = [],
  query = '',
}: PointFilters = {}): Promise<CollectionPoint[]> {
  const q = normalize(query.trim());

  return mockPoints.filter(
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
}

export async function getPointBySlug(
  slug: string
): Promise<PointDetails | null> {
  const point = mockPoints.find(
    (p) => p.slug === slug && p.status === 'approved'
  );
  const details = point && mockPointDetails[point.id];

  return point && details ? { ...point, ...details } : null;
}

export async function getOutdatedPoints(
  now = Date.now()
): Promise<OutdatedPoint[]> {
  return mockPoints.flatMap((point) => {
    const details =
      point.status === 'approved' ? mockPointDetails[point.id] : undefined;
    if (!details || !isOutdated(details.verification.updatedAt, now)) {
      return [];
    }

    return [
      {
        id: point.id,
        slug: point.slug,
        name: point.name,
        address: point.address,
        neighborhood: point.neighborhood,
        materials: point.materials,
        schedule: details.schedule,
        updatedAt: details.verification.updatedAt,
        days: daysSince(details.verification.updatedAt, now),
      },
    ];
  });
}
