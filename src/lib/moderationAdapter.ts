import type { Material, PendingPointDTO, PointRequest } from '@/types/api';
import { MATERIAL_IDS } from '@/lib/materials';

function normalizeMaterial(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function toMaterials(categories: string[]): Material[] {
  return MATERIAL_IDS.filter((material) =>
    categories.some((category) => normalizeMaterial(category) === material)
  );
}

export function toPointRequest(point: PendingPointDTO): PointRequest {
  return {
    id: point.id,
    slug: point.id,
    name: point.name,
    address: point.address,
    city: point.city,
    neighborhood: '',
    cep: '',
    lat: Number(point.latitude),
    lng: Number(point.longitude),
    materials: toMaterials(point.wasteCategories),
    hours: '',
    status: 'pending',
    protocol: point.id,
    requester: point.collector.name,
    contact: point.collector.email,
    submittedAt: point.createdAt,
    attachments: [],
  };
}
