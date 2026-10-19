import { mockPoints } from '@/data/mockPoints';
import { isInBounds } from '@/lib/geo';
import type { CollectionPoint, PointFilters } from '@/types/api';

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
