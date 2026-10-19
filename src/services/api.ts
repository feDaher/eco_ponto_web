import { mockPointDetails } from '@/data/mockPointDetails';
import { mockPoints } from '@/data/mockPoints';
import { isInBounds } from '@/lib/geo';
import type { CollectionPoint, PointDetails, PointFilters } from '@/types/api';

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
