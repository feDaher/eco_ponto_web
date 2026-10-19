import type { LatLng, MapBounds } from '@/types/api';

export type PlaceSuggestion = {
  placeId: string;
  title: string;
  subtitle: string;
};

export type PlaceResult = {
  location: LatLng;
  viewport?: MapBounds;
  label: string;
};

type ApiLatLng = { latitude: number; longitude: number };

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const SUGGEST_TIMEOUT_MS = 4000;
const DETAILS_TIMEOUT_MS = 6000;

export function createSessionToken() {
  return crypto.randomUUID();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLatLng(
  value: unknown
): value is Record<string, unknown> & ApiLatLng {
  return (
    isRecord(value) &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  );
}

function isSuggestion(value: unknown): value is PlaceSuggestion {
  return (
    isRecord(value) &&
    typeof value.placeId === 'string' &&
    typeof value.title === 'string' &&
    typeof value.subtitle === 'string'
  );
}

async function request(
  path: string,
  params: Record<string, string | undefined>,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<unknown> {
  if (!API_URL) return null;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }

  const timeout = AbortSignal.timeout(timeoutMs);
  const response = await fetch(`${API_URL}${path}?${query}`, {
    headers: { Accept: 'application/json' },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) return null;
  return response.json();
}

export async function suggestPlaces(
  input: string,
  sessionToken: string,
  near?: LatLng,
  signal?: AbortSignal
): Promise<PlaceSuggestion[]> {
  try {
    const data = await request(
      '/places/autocomplete',
      {
        input,
        sessionToken,
        latitude: near?.lat.toFixed(6),
        longitude: near?.lng.toFixed(6),
      },
      SUGGEST_TIMEOUT_MS,
      signal
    );
    return Array.isArray(data) ? data.filter(isSuggestion) : [];
  } catch {
    return [];
  }
}

export async function getPlace(
  suggestion: PlaceSuggestion,
  sessionToken: string
): Promise<PlaceResult | null> {
  try {
    const data = await request(
      `/places/${encodeURIComponent(suggestion.placeId)}`,
      { sessionToken },
      DETAILS_TIMEOUT_MS
    );
    if (!isLatLng(data)) return null;

    const viewport = isRecord(data.viewport) ? data.viewport : null;
    const southWest = viewport?.southWest;
    const northEast = viewport?.northEast;

    return {
      location: { lat: data.latitude, lng: data.longitude },
      viewport:
        isLatLng(southWest) && isLatLng(northEast)
          ? {
              north: northEast.latitude,
              south: southWest.latitude,
              east: northEast.longitude,
              west: southWest.longitude,
            }
          : undefined,
      label:
        typeof data.label === 'string' && data.label
          ? data.label
          : suggestion.title,
    };
  } catch {
    return null;
  }
}
