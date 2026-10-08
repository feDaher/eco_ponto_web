'use client';

import { useCallback, useMemo } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import type { LatLng, MapBounds } from '@/types/api';

export type GeocodeResult = {
  location: LatLng;
  viewport?: MapBounds;
  formattedAddress: string;
};

export function useGeocoder() {
  const geocodingLib = useMapsLibrary('geocoding');
  const geocoder = useMemo(
    () => (geocodingLib ? new geocodingLib.Geocoder() : null),
    [geocodingLib]
  );

  const geocode = useCallback(
    async (address: string): Promise<GeocodeResult | null> => {
      if (!geocoder || !address.trim()) return null;

      try {
        const { results } = await geocoder.geocode({
          address,
          region: 'br',
          componentRestrictions: { country: 'BR' },
        });
        const [first] = results;
        if (!first) return null;

        return {
          location: first.geometry.location.toJSON(),
          viewport: first.geometry.viewport?.toJSON(),
          formattedAddress: first.formatted_address,
        };
      } catch {
        return null;
      }
    },
    [geocoder]
  );

  return { geocode };
}
