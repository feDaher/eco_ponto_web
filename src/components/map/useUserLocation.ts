'use client';

import { useCallback, useState } from 'react';
import type { LatLng } from '@/types/api';

export function useUserLocation() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(
    () =>
      new Promise<LatLng | null>((resolve) => {
        if (!('geolocation' in navigator)) {
          setError('Seu navegador não permite obter a localização.');
          resolve(null);
          return;
        }
        setIsLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const position = { lat: coords.latitude, lng: coords.longitude };
            setLocation(position);
            setIsLocating(false);
            resolve(position);
          },
          () => {
            setIsLocating(false);
            setError(
              'Não foi possível obter sua localização. Verifique a permissão do navegador.'
            );
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }),
    []
  );

  return { location, isLocating, error, locate };
}
