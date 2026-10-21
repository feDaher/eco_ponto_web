import { MATERIAL_IDS, MATERIALS } from '@/lib/materials';
import { getPoints } from '@/services/api';
import type { WasteCategory } from '@/types/api';

export async function getWasteCategories(): Promise<WasteCategory[]> {
  return MATERIAL_IDS.map((id) => ({
    id,
    name: MATERIALS[id].label,
    active: true,
  }));
}

export async function getActivePointCounts(): Promise<Record<string, number>> {
  const points = await getPoints();

  return points.reduce<Record<string, number>>((counts, point) => {
    for (const material of point.materials) {
      counts[material] = (counts[material] ?? 0) + 1;
    }
    return counts;
  }, {});
}
