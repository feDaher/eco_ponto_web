import type { LatLng, MapBounds } from '@/types/api';

export const DEFAULT_CENTER: LatLng = { lat: -20.2577, lng: -42.0336 };
export const DEFAULT_ZOOM = 14;

export function distanceKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number) {
  return km < 1
    ? `${Math.round(km * 1000)} m`
    : `${km.toFixed(1).replace('.', ',')} km`;
}

export function isInBounds({ lat, lng }: LatLng, bounds: MapBounds) {
  const inLat = lat <= bounds.north && lat >= bounds.south;
  const inLng =
    bounds.west <= bounds.east
      ? lng >= bounds.west && lng <= bounds.east
      : lng >= bounds.west || lng <= bounds.east;
  return inLat && inLng;
}

export function boundsCenter(b: MapBounds): LatLng {
  return { lat: (b.north + b.south) / 2, lng: (b.east + b.west) / 2 };
}

export function getDirectionsUrl({ lat, lng }: LatLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
