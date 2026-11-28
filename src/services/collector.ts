import type { OpeningHours, PointStatus, Weekday } from '@/types/api';
import type {
  CategoryUnderReview,
  CollectorOverviewData,
  CollectorPoint,
  CollectorPointStats,
  CollectorReceipt,
  ReceiptStatus,
} from '@/types/collector';
import type { User, UserRole } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const TIMEOUT_MS = 10000;

const ROLES: UserRole[] = ['CITIZEN', 'COLLECTOR', 'ADMIN'];

const WEEKDAY_MAP: Record<string, Weekday> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const MATERIAL_LABELS: Record<string, string> = {
  pilhas: 'Pilhas e baterias',
  eletronicos: 'Eletrônicos',
  plastico: 'Plástico',
  papel: 'Papel e papelão',
  vidro: 'Vidro',
  metal: 'Metal',
  oleo: 'Óleo de cozinha',
};

export class CollectorApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CollectorApiError';
    this.status = status;
  }
}

const MESSAGES: Record<number, string> = {
  401: 'Sua sessão expirou. Entre novamente para continuar.',
  403: 'Seu perfil não tem permissão para acessar o painel do coletor.',
  404: 'Dados do coletor não encontrados.',
  429: 'Muitas requisições em pouco tempo. Aguarde e tente novamente.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function pickValidText(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (lower === 'undefined' || lower === 'null') continue;
    return trimmed;
  }
  return null;
}

function toUser(value: unknown): User | null {
  const raw = isRecord(value) && isRecord(value.user) ? value.user : value;

  if (
    !isRecord(raw) ||
    typeof raw.id !== 'string' ||
    typeof raw.email !== 'string' ||
    !ROLES.includes(raw.role as UserRole)
  ) {
    return null;
  }

  return {
    id: raw.id,
    name: pickValidText(typeof raw.name === 'string' ? raw.name : null) ?? '',
    email: raw.email,
    phone: typeof raw.phone === 'string' ? raw.phone : '',
    city: typeof raw.city === 'string' ? raw.city : '',
    role: raw.role as UserRole,
  };
}

function toOpeningHours(value: unknown): OpeningHours[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];

    if (
      typeof entry.weekday === 'string' &&
      typeof entry.openTime === 'string' &&
      typeof entry.closeTime === 'string'
    ) {
      if (entry.isActive === false) return [];

      const weekday = WEEKDAY_MAP[entry.weekday.toUpperCase()];
      if (weekday === undefined) return [];

      return [
        {
          weekdays: [weekday],
          opens: entry.openTime,
          closes: entry.closeTime,
        },
      ];
    }

    if (
      Array.isArray(entry.weekdays) &&
      typeof entry.opens === 'string' &&
      typeof entry.closes === 'string'
    ) {
      const weekdays = entry.weekdays.filter(
        (day): day is Weekday =>
          typeof day === 'number' &&
          Number.isInteger(day) &&
          day >= 0 &&
          day <= 6
      );
      if (weekdays.length === 0) return [];
      return [{ weekdays, opens: entry.opens, closes: entry.closes }];
    }

    return [];
  });
}

function toCategoryUnderReview(value: unknown): CategoryUnderReview | null {
  if (!isRecord(value)) return null;

  const label =
    typeof value.label === 'string'
      ? value.label
      : typeof value.name === 'string'
        ? value.name
        : null;

  if (!label) return null;

  return {
    id: typeof value.id === 'string' ? value.id : undefined,
    label,
    phase: typeof value.phase === 'string' ? value.phase : undefined,
    description:
      typeof value.description === 'string' ? value.description : undefined,
  };
}

function toPointStatus(value: unknown): PointStatus {
  if (typeof value !== 'string') return 'pending';

  switch (value.toUpperCase()) {
    case 'APPROVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'INACTIVE':
    case 'REMOVED':
      return 'removed';
    case 'PENDING':
    default:
      return 'pending';
  }
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toPointStats(
  value: Record<string, unknown>
): CollectorPointStats | null {
  const source = isRecord(value.stats) ? value.stats : value;

  const monthlyKg = toFiniteNumber(
    source.monthlyKg ?? source.receivedMonthlyKg ?? source.totalReceivedKg
  );
  const monthlyGrowth = toFiniteNumber(
    source.monthlyGrowth ?? source.growthPercentage
  );
  const storedKg = toFiniteNumber(
    source.storedKg ?? source.currentLoadKg ?? source.occupiedKg
  );
  const capacityKg = toFiniteNumber(
    source.capacityKg ?? source.maxCapacityKg ?? source.totalCapacityKg
  );
  const lastCheckIn =
    typeof source.lastCheckIn === 'string' ? source.lastCheckIn : null;

  if (
    monthlyKg === null &&
    storedKg === null &&
    capacityKg === null &&
    !lastCheckIn
  ) {
    return null;
  }

  return {
    monthlyKg: monthlyKg ?? 0,
    monthlyGrowth,
    storedKg: storedKg ?? 0,
    capacityKg: capacityKg ?? 0,
    lastCheckIn,
  };
}

function toCollectorPoint(value: unknown): CollectorPoint | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string'
  ) {
    return null;
  }

  const rawCategories = Array.isArray(value.wasteCategories)
    ? value.wasteCategories
    : Array.isArray(value.materials)
      ? value.materials
      : [];

  const materials = rawCategories.flatMap((item) => {
    if (typeof item === 'string') return [item];
    if (isRecord(item) && typeof item.name === 'string') return [item.name];
    return [];
  });

  const rawHours = Array.isArray(value.hours) ? value.hours : value.schedule;

  return {
    id: value.id,
    slug: typeof value.slug === 'string' ? value.slug : value.id,
    name: value.name,
    address: typeof value.address === 'string' ? value.address : '',
    neighborhood:
      typeof value.neighborhood === 'string' ? value.neighborhood : '',
    city: typeof value.city === 'string' ? value.city : '',
    cep: typeof value.cep === 'string' ? value.cep : '',
    status: toPointStatus(value.status),
    materials,
    schedule: toOpeningHours(rawHours),
    cnpj: typeof value.cnpj === 'string' ? value.cnpj : null,
    unit: typeof value.unit === 'string' ? value.unit : null,
    protocol: typeof value.protocol === 'string' ? value.protocol : null,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
    stats: toPointStats(value),
    categoryUnderReview: toCategoryUnderReview(value.categoryUnderReview),
  };
}

function extractPointsArray(body: unknown): unknown[] | null {
  if (Array.isArray(body)) return body;
  if (!isRecord(body)) return null;
  if (Array.isArray(body.points)) return body.points;
  if (Array.isArray(body.collectionPoints)) return body.collectionPoints;
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.results)) return body.results;
  if (Array.isArray(body.data)) return body.data;
  if (isRecord(body.data)) {
    if (Array.isArray(body.data.points)) return body.data.points;
    if (Array.isArray(body.data.collectionPoints)) {
      return body.data.collectionPoints;
    }
    if (Array.isArray(body.data.items)) return body.data.items;
  }
  if (typeof body.id === 'string' && typeof body.name === 'string') {
    return [body];
  }
  if (
    isRecord(body.data) &&
    typeof body.data.id === 'string' &&
    typeof body.data.name === 'string'
  ) {
    return [body.data];
  }
  return null;
}

function toReceiptStatus(value: unknown): ReceiptStatus {
  if (typeof value !== 'string') return 'awaiting';
  const normalized = value.trim().toUpperCase();
  if (
    normalized === 'SORTED' ||
    normalized === 'TRIADO' ||
    normalized === 'COMPLETED'
  ) {
    return 'sorted';
  }
  return 'awaiting';
}

async function getJson(token: string, path: string): Promise<unknown> {
  if (!API_URL) {
    throw new CollectorApiError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new CollectorApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  if (!response.ok) {
    throw new CollectorApiError(
      MESSAGES[response.status] ??
        'Não foi possível carregar os dados do coletor. Tente novamente.',
      response.status
    );
  }

  return response.json().catch(() => null);
}

export async function getCollectorMe(token: string): Promise<User> {
  const body = await getJson(token, '/auth/me');
  const user = toUser(body);

  if (!user) {
    throw new CollectorApiError('Resposta inesperada ao carregar o perfil.');
  }

  return user;
}

export async function getMyCollectionPoints(
  token: string
): Promise<CollectorPoint[]> {
  const body = await getJson(token, '/collection-points/mine');
  const list = extractPointsArray(body);

  if (!list) {
    throw new CollectorApiError('Resposta inesperada ao carregar os pontos.');
  }

  return list.flatMap((item) => {
    const point = toCollectorPoint(item);
    return point ? [point] : [];
  });
}

export async function getCollectorOverview(
  token: string
): Promise<CollectorOverviewData> {
  const [user, points] = await Promise.all([
    getCollectorMe(token),
    getMyCollectionPoints(token),
  ]);

  return { user, points };
}

export function formatCollectorShortName(name: string): string {
  const normalized = name.trim().replace(/^Cooperativa\s+/i, 'Coop. ');
  if (normalized.length <= 28) return normalized;
  return `${normalized.slice(0, 25).trimEnd()}...`;
}

export function formatMaterialLabel(material: string): string {
  const key = material.trim().toLowerCase();
  return MATERIAL_LABELS[key] ?? material;
}

export function toCollectorReceipts(value: unknown): CollectorReceipt[] {
  const list = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.receipts)
      ? value.receipts
      : isRecord(value) && Array.isArray(value.items)
        ? value.items
        : [];

  return list
    .map((item, index): CollectorReceipt | null => {
      if (!isRecord(item)) return null;

      const id =
        typeof item.id === 'string' || typeof item.id === 'number'
          ? String(item.id)
          : `receipt-${index}`;

      const rawTime =
        typeof item.time === 'string'
          ? item.time
          : typeof item.createdAt === 'string'
            ? new Date(item.createdAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '--:--';

      const donor =
        pickValidText(
          typeof item.donor === 'string' ? item.donor : null,
          isRecord(item.donor) && typeof item.donor.name === 'string'
            ? item.donor.name
            : null
        ) ?? 'Doador não identificado';

      const donorType =
        pickValidText(
          typeof item.donorType === 'string' ? item.donorType : null,
          isRecord(item.donor) && typeof item.donor.type === 'string'
            ? item.donor.type
            : null
        ) ?? 'Cidadão';

      const description =
        pickValidText(
          typeof item.description === 'string' ? item.description : null,
          typeof item.material === 'string' ? item.material : null,
          typeof item.notes === 'string' ? item.notes : null
        ) ?? 'Recebimento registrado';

      const weightKg =
        toFiniteNumber(item.weightKg ?? item.weight ?? item.kg ?? 0) ?? 0;

      return {
        id,
        pointId: typeof item.pointId === 'string' ? item.pointId : undefined,
        time: rawTime,
        donor,
        donorType,
        description,
        weightKg,
        status: toReceiptStatus(item.status),
      };
    })
    .filter((entry): entry is CollectorReceipt => entry !== null);
}

export type CreateCollectorPointPayload = {
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  cep: string;
  materials: string[];
  schedule?: OpeningHours[];
  collectorName?: string | null;
  cnpj?: string | null;
  unit?: string | null;
};

export async function createCollectorPoint(
  token: string,
  payload: CreateCollectorPointPayload
): Promise<CollectorPoint> {
  if (!API_URL) {
    throw new CollectorApiError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/collection-points`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch {
    throw new CollectorApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : (MESSAGES[response.status] ??
          'Não foi possível criar o ponto de coleta.');

    throw new CollectorApiError(message, response.status);
  }

  const candidate =
    isRecord(body) && isRecord(body.point)
      ? body.point
      : isRecord(body) && isRecord(body.data)
        ? body.data
        : body;

  const point = toCollectorPoint(candidate);
  if (!point) {
    throw new CollectorApiError(
      'Resposta inesperada ao criar o ponto de coleta.'
    );
  }

  return point;
}

const WEEKDAY_TO_NAME: Record<Weekday, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

function toBackendHoursPayload(schedule: OpeningHours[]) {
  const entries: Array<{
    weekday: string;
    openTime: string;
    closeTime: string;
    isActive: boolean;
  }> = [];

  for (const block of schedule) {
    for (const day of block.weekdays) {
      const weekdayName = WEEKDAY_TO_NAME[day];
      if (!weekdayName) continue;
      entries.push({
        weekday: weekdayName,
        openTime: block.opens,
        closeTime: block.closes,
        isActive: true,
      });
    }
  }

  return entries;
}

export async function updateCollectorPointSchedule(
  token: string,
  pointId: string,
  schedule: OpeningHours[]
): Promise<CollectorPoint> {
  if (!API_URL) {
    throw new CollectorApiError('API não configurada (NEXT_PUBLIC_API_URL).');
  }

  let response: Response;
  try {
    response = await fetch(
      `${API_URL}/collection-points/${encodeURIComponent(pointId)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          hours: toBackendHoursPayload(schedule),
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: 'no-store',
      }
    );
  } catch {
    throw new CollectorApiError(
      'Não foi possível conectar ao servidor. Tente novamente.'
    );
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : (MESSAGES[response.status] ??
          'Não foi possível salvar os horários de operação.');

    throw new CollectorApiError(message, response.status);
  }

  const candidate =
    isRecord(body) && isRecord(body.point)
      ? body.point
      : isRecord(body) && isRecord(body.data)
        ? body.data
        : body;

  const point = toCollectorPoint(candidate);
  if (!point) {
    throw new CollectorApiError(
      'Resposta inesperada ao atualizar os horários.'
    );
  }

  return point;
}
