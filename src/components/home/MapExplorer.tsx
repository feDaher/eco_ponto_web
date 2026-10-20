'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMap } from '@vis.gl/react-google-maps';
import {
  Battery,
  Droplet,
  Loader2,
  LocateFixed,
  Map as MapIcon,
  Navigation,
  Recycle,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { DEFAULT_CENTER, distanceKm } from '@/lib/geo';
import { getPoints } from '@/services/api';
import { FilterChip } from '@/components/map/FilterChip';
import { GoogleMapsProvider } from '@/components/map/GoogleMapsProvider';
import { PlaceSearch, type PlaceResult } from '@/components/map/PlaceSearch';
import { PointCard } from '@/components/map/PointCard';
import { POINTS_MAP_ID, PointsMap } from '@/components/map/PointsMap';
import { useUserLocation } from '@/components/map/useUserLocation';
import type { CollectionPoint, LatLng, Material } from '@/types/api';

type Category = {
  id: 'all' | 'electronics' | 'recyclables' | 'oil';
  label: string;
  icon: LucideIcon;
  materials: Material[];
};

type SearchedPlace = Pick<PlaceResult, 'label' | 'location'>;

const ALL_CATEGORY: Category = {
  id: 'all',
  label: 'Todos os itens',
  icon: SlidersHorizontal,
  materials: [],
};

const categories: Category[] = [
  ALL_CATEGORY,
  {
    id: 'electronics',
    label: 'Pilhas & Eletrônicos',
    icon: Battery,
    materials: ['pilhas', 'eletronicos'],
  },
  {
    id: 'recyclables',
    label: 'Recicláveis',
    icon: Recycle,
    materials: ['plastico', 'papel', 'vidro', 'metal'],
  },
  { id: 'oil', label: 'Óleo de cozinha', icon: Droplet, materials: ['oleo'] },
];

const HIGHLIGHTS_COUNT = 3;

export function MapExplorer() {
  return (
    <GoogleMapsProvider>
      <MapPreview />
    </GoogleMapsProvider>
  );
}

function MapPreview() {
  const map = useMap(POINTS_MAP_ID);
  const userLocation = useUserLocation();

  const [allPoints, setAllPoints] = useState<CollectionPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [category, setCategory] = useState<Category>(ALL_CATEGORY);
  const [searched, setSearched] = useState<SearchedPlace | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    getPoints()
      .then(setAllPoints)
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const points =
    category.materials.length === 0
      ? allPoints
      : allPoints.filter((p) =>
          p.materials.some((m) => category.materials.includes(m))
        );

  const origin = searched?.location ?? userLocation.location;
  const highlights = points
    .map((point) => ({
      point,
      distance: distanceKm(origin ?? DEFAULT_CENTER, point),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, HIGHLIGHTS_COUNT);

  function moveTo(location: LatLng, zoom: number) {
    map?.panTo(location);
    map?.setZoom(zoom);
  }

  function handlePlaceSelect(place: PlaceResult) {
    setSearched({ label: place.label, location: place.location });
    setSelectedId(null);
    if (place.viewport) map?.fitBounds(place.viewport);
    else moveTo(place.location, 15);
  }

  function focusPoint(point: CollectionPoint) {
    setSelectedId(point.id);
    moveTo(point, 16);
  }

  async function handleLocate() {
    const location = await userLocation.locate();
    if (!location) return;
    setSearched(null);
    moveTo(location, 15);
  }

  return (
    <>
      <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex-1 lg:max-w-md">
          <PlaceSearch
            biasCenter={DEFAULT_CENTER}
            onPlaceSelect={handlePlaceSelect}
            onPointSelect={focusPoint}
          />
        </div>

        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:pb-0"
        >
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              isSelected={cat.id === category.id}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm lg:grid-cols-12 lg:p-6">
        <div className="relative h-[380px] lg:col-span-8 lg:h-[480px]">
          <PointsMap
            points={points}
            selectedId={selectedId}
            hoveredId={hoveredId}
            userLocation={userLocation.location}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            gestureHandling="cooperative"
            className="h-full border border-slate-100"
          />

          <div className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            {isLoading
              ? 'Carregando pontos...'
              : `${points.length} ${points.length === 1 ? 'ponto ativo' : 'pontos ativos'}`}
          </div>

          <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-1">
            {searched || userLocation.location ? (
              <div
                aria-live="polite"
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-100 bg-white/95 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md"
              >
                <Navigation className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="truncate">
                  {searched ? (
                    <>
                      Perto de: <strong>{searched.label}</strong>
                    </>
                  ) : (
                    <strong>Perto de você</strong>
                  )}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLocate}
                disabled={userLocation.isLocating}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand shadow-md transition-colors hover:bg-surface-alt disabled:opacity-60"
              >
                {userLocation.isLocating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="h-3.5 w-3.5" />
                )}
                Usar minha localização
              </button>
            )}
            {userLocation.error && (
              <p
                role="alert"
                className="rounded-lg bg-white/95 px-3 py-1 text-[11px] text-red-600 shadow-sm"
              >
                {userLocation.error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:col-span-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {origin ? 'Mais Próximos' : 'Destaques'}
              </h3>
              <Link
                href={ROUTES.map}
                className="text-xs font-medium text-slate-500 hover:text-brand"
              >
                Ver todos
              </Link>
            </div>

            {isLoading ? (
              <ul className="space-y-3">
                {[0, 1].map((i) => (
                  <li
                    key={i}
                    className="h-36 animate-pulse rounded-2xl bg-surface-alt"
                  />
                ))}
              </ul>
            ) : loadError ? (
              <p
                role="alert"
                className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700"
              >
                Não foi possível carregar os pontos de coleta.
              </p>
            ) : highlights.length === 0 ? (
              <p className="rounded-2xl bg-surface-alt p-4 text-center text-sm text-slate-500">
                Nenhum ponto encontrado para esta categoria.
              </p>
            ) : (
              <ul className="space-y-3">
                {highlights.map(({ point, distance }) => (
                  <PointCard
                    key={point.id}
                    point={point}
                    distance={origin ? distance : undefined}
                    isActive={point.id === selectedId || point.id === hoveredId}
                    variant="muted"
                    onHover={setHoveredId}
                    onClick={() => focusPoint(point)}
                  />
                ))}
              </ul>
            )}
          </div>

          <Link
            href={ROUTES.map}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-surface-strong px-4 py-3 text-xs font-semibold text-brand transition-colors hover:bg-slate-200 sm:text-sm"
          >
            <MapIcon className="h-4 w-4" />
            Abrir navegação completa
          </Link>
        </div>
      </div>
    </>
  );
}
