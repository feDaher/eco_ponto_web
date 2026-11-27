import type { Material, PendingPointDTO, PointRequest } from '@/types/api';

const API_MATERIALS: Record<string, Material> = {
  BATTERIES: 'pilhas',
  ELECTRONICS: 'eletronicos',
  CELL_PHONES: 'eletronicos',
  COMPUTERS: 'eletronicos',
  PRINTERS: 'eletronicos',
  TELEVISIONS: 'eletronicos',
  PLASTIC: 'plastico',
  PAPER: 'papel',
  METALS: 'metal',
  GLASS: 'vidro',
  COOKING_OIL: 'oleo',
};

const WEEKDAY_SHORT: Record<string, string> = {
  MONDAY: 'Seg',
  TUESDAY: 'Ter',
  WEDNESDAY: 'Qua',
  THURSDAY: 'Qui',
  FRIDAY: 'Sex',
  SATURDAY: 'Sáb',
  SUNDAY: 'Dom',
};

function toMaterials(categories: string[]): Material[] {
  const materials = categories
    .map((code) => API_MATERIALS[code.trim().toUpperCase()])
    .filter((material): material is Material => Boolean(material));
  return [...new Set(materials)];
}

function toHours(hours: PendingPointDTO['hours']): string {
  return (hours ?? [])
    .filter((entry) => entry.isActive)
    .map(
      (entry) =>
        `${WEEKDAY_SHORT[entry.weekday] ?? entry.weekday} ${entry.openTime}–${entry.closeTime}`
    )
    .join(' · ');
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
    hours: toHours(point.hours),
    status: 'pending',
    protocol: point.id.slice(0, 8).toUpperCase(),
    requester: point.collector.name,
    contact: point.whatsappContact || point.collector.email,
    submittedAt: point.createdAt,
    attachments: [],
  };
}
