'use client';

import { useEffect, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
  List,
  Loader2,
  LocateFixed,
  Map as MapIcon,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { boundsCenter, DEFAULT_CENTER, distanceKm } from '@/lib/geo';
import { MATERIAL_IDS, MATERIALS } from '@/lib/materials';
import { getPoints } from '@/services/api';
import { FilterChip } from './FilterChip';
import { PlaceSearch, type PlaceResult } from './PlaceSearch';
import { PointCard } from './PointCard';
import { POINTS_MAP_ID, PointsMap } from './PointsMap';
import { useUserLocation } from './useUserLocation';
import type { CollectionPoint, MapBounds, Material } from '@/types/api';

function sameBounds(a: MapBounds, b: MapBounds) {
  const eps = 1e-6;
  return (
    Math.abs(a.north - b.north) < eps &&
    Math.abs(a.south - b.south) < eps &&
    Math.abs(a.east - b.east) < eps &&
    Math.abs(a.west - b.west) < eps
  );
}

export function PointsExplorer() {
  const map = useMap(POINTS_MAP_ID);

  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [searchBounds, setSearchBounds] = useState<MapBounds | null>(null);
  const [areaLabel, setAreaLabel] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const {
    location: userLocation,
    isLocating,
    error: locationError,
    locate,
  } = useUserLocation();
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const requestRef = useRef(0);
  const autoSearchRef = useRef(false);

  function search(bounds: MapBounds | null, mats: Material[]) {
    const requestId = ++requestRef.current;
    setIsLoading(true);
    setLoadError(false);
    getPoints({ bounds: bounds ?? undefined, materials: mats })
      .then((result) => {
        if (requestId === requestRef.current) setPoints(result);
      })
      .catch(() => {
        if (requestId === requestRef.current) setLoadError(true);
      })
      .finally(() => {
        if (requestId === requestRef.current) setIsLoading(false);
      });
  }

  useEffect(() => {
    getPoints()
      .then((result) => {
        if (requestRef.current === 0) setPoints(result);
      })
      .catch(() => {
        if (requestRef.current === 0) setLoadError(true);
      })
      .finally(() => {
        if (requestRef.current === 0) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    document
      .getElementById(`point-card-${selectedId}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  function handleIdle(bounds: MapBounds) {
    setMapBounds(bounds);
    if (!searchBounds || autoSearchRef.current) {
      autoSearchRef.current = false;
      setSearchBounds(bounds);
      search(bounds, materials);
    }
  }

  function searchThisArea() {
    if (!mapBounds) return;
    setSearchBounds(mapBounds);
    setAreaLabel(null);
    search(mapBounds, materials);
  }

  function toggleMaterial(material: Material | 'all') {
    const next =
      material === 'all'
        ? []
        : materials.includes(material)
          ? materials.filter((m) => m !== material)
          : [...materials, material];
    setMaterials(next);
    search(searchBounds, next);
  }

  function handlePlaceSelect(place: PlaceResult) {
    if (!map) return;
    autoSearchRef.current = true;
    setAreaLabel(place.label);
    setSelectedId(null);
    if (place.viewport) {
      map.fitBounds(place.viewport);
    } else {
      map.panTo(place.location);
      map.setZoom(16);
    }
  }

  function focusPoint(point: CollectionPoint) {
    setSelectedId(point.id);
    if (!map) return;
    map.panTo(point);
    if ((map.getZoom() ?? 0) < 16) {
      autoSearchRef.current = true;
      map.setZoom(16);
    }
  }

  function handlePointSelect(point: CollectionPoint) {
    setAreaLabel(null);
    setMobileView('map');
    focusPoint(point);
  }

  async function locateUser() {
    const location = await locate();
    if (!location) return;
    setAreaLabel('Perto de você');
    if (map) {
      autoSearchRef.current = true;
      map.panTo(location);
      map.setZoom(15);
    }
  }

  const origin =
    userLocation ??
    (searchBounds ? boundsCenter(searchBounds) : DEFAULT_CENTER);
  const sortedPoints = points
    .map((point) => ({ point, distance: distanceKm(origin, point) }))
    .sort((a, b) => a.distance - b.distance);

  const showSearchHere =
    mapBounds !== null &&
    searchBounds !== null &&
    !sameBounds(mapBounds, searchBounds);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1 sm:max-w-xl">
          <PlaceSearch
            biasCenter={mapBounds ? boundsCenter(mapBounds) : DEFAULT_CENTER}
            onPlaceSelect={handlePlaceSelect}
            onPointSelect={handlePointSelect}
          />
        </div>
        <button
          type="button"
          onClick={locateUser}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-surface-alt disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
          Usar minha localização
        </button>
      </div>
      {locationError && (
        <p role="alert" className="-mt-2 text-xs text-red-600">
          {locationError}
        </p>
      )}

      <div
        role="group"
        aria-label="Filtrar por material"
        className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
      >
        <FilterChip
          label="Todos"
          icon={SlidersHorizontal}
          isSelected={materials.length === 0}
          onClick={() => toggleMaterial('all')}
        />
        {MATERIAL_IDS.map((id) => (
          <FilterChip
            key={id}
            label={MATERIALS[id].label}
            icon={MATERIALS[id].icon}
            isSelected={materials.includes(id)}
            onClick={() => toggleMaterial(id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section
          aria-label="Pontos de coleta encontrados"
          className={cn(
            'space-y-3 lg:col-span-5 lg:block',
            mobileView === 'map' && 'hidden'
          )}
        >
          <p aria-live="polite" className="text-sm text-slate-600">
            {isLoading ? (
              'Buscando pontos...'
            ) : (
              <>
                <strong className="text-slate-900">
                  {points.length} {points.length === 1 ? 'ponto' : 'pontos'}
                </strong>{' '}
                {areaLabel ? (
                  <>
                    em <strong className="text-slate-900">{areaLabel}</strong>
                  </>
                ) : (
                  'nesta área do mapa'
                )}
              </>
            )}
          </p>

          {loadError && (
            <div
              role="alert"
              className="flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            >
              Não foi possível carregar os pontos de coleta.
              <button
                type="button"
                onClick={() => search(searchBounds, materials)}
                className="shrink-0 font-semibold underline"
              >
                Tentar de novo
              </button>
            </div>
          )}

          {isLoading && points.length === 0 ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="h-32 animate-pulse rounded-2xl bg-surface-alt"
                />
              ))}
            </ul>
          ) : points.length === 0 && !loadError ? (
            <div className="rounded-2xl bg-surface-alt p-6 text-center text-sm text-slate-600">
              Nenhum ponto de coleta aqui.
              <br />
              Afaste o zoom do mapa ou remova algum filtro.
            </div>
          ) : (
            <ul className={cn('space-y-3', isLoading && 'opacity-60')}>
              {sortedPoints.map(({ point, distance }) => (
                <PointCard
                  key={point.id}
                  point={point}
                  distance={distance}
                  isActive={point.id === selectedId || point.id === hoveredId}
                  onHover={setHoveredId}
                  onClick={() => {
                    setMobileView('map');
                    focusPoint(point);
                  }}
                />
              ))}
            </ul>
          )}
        </section>

        <section
          aria-label="Mapa dos pontos de coleta"
          className={cn(
            'relative h-[70dvh] lg:sticky lg:top-24 lg:col-span-7 lg:block lg:h-[calc(100dvh-8rem)]',
            mobileView === 'list' && 'hidden'
          )}
        >
          <PointsMap
            points={points}
            selectedId={selectedId}
            hoveredId={hoveredId}
            userLocation={userLocation}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            onIdle={handleIdle}
            className="h-full border border-slate-100 shadow-sm"
          />

          {showSearchHere && (
            <button
              type="button"
              onClick={searchThisArea}
              className="absolute top-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-colors hover:bg-surface-alt"
            >
              <RefreshCw className="h-4 w-4" />
              Buscar nesta área
            </button>
          )}
        </section>
      </div>

      <button
        type="button"
        onClick={() => setMobileView((v) => (v === 'list' ? 'map' : 'list'))}
        className="fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl lg:hidden"
      >
        {mobileView === 'list' ? (
          <>
            <MapIcon className="h-4 w-4" /> Mostrar mapa
          </>
        ) : (
          <>
            <List className="h-4 w-4" /> Mostrar lista
          </>
        )}
      </button>
    </div>
  );
}
