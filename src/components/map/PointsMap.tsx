'use client';

import { useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  useMap,
} from '@vis.gl/react-google-maps';
import { MarkerClusterer, type Marker } from '@googlemaps/markerclusterer';
import { ExternalLink, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { DEFAULT_CENTER, DEFAULT_ZOOM, getDirectionsUrl } from '@/lib/geo';
import type { CollectionPoint, LatLng, MapBounds } from '@/types/api';

export const POINTS_MAP_ID = 'points-map';

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

type PointsMapProps = {
  points: CollectionPoint[];
  selectedId: string | null;
  hoveredId: string | null;
  userLocation: LatLng | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onIdle?: (bounds: MapBounds) => void;
  gestureHandling?: 'greedy' | 'cooperative';
  className?: string;
};

export function PointsMap({
  points,
  selectedId,
  hoveredId,
  userLocation,
  onSelect,
  onHover,
  onIdle,
  gestureHandling = 'greedy',
  className,
}: PointsMapProps) {
  const selectedPoint = points.find((p) => p.id === selectedId);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)}>
      <GoogleMap
        id={POINTS_MAP_ID}
        mapId={MAP_ID}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling={gestureHandling}
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        onIdle={(e) => {
          const bounds = e.map.getBounds();
          if (bounds) onIdle?.(bounds.toJSON());
        }}
        onClick={() => onSelect(null)}
        className="h-full w-full"
      >
        <ClusteredMarkers
          points={points}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />

        {userLocation && (
          <AdvancedMarker position={userLocation} title="Você está aqui">
            <span className="block h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.25)]" />
          </AdvancedMarker>
        )}

        {selectedPoint && (
          <InfoWindow
            position={selectedPoint}
            pixelOffset={[0, -44]}
            headerContent={
              <span className="text-sm font-bold text-slate-900">
                {selectedPoint.name}
              </span>
            }
            onCloseClick={() => onSelect(null)}
          >
            <div className="max-w-56 space-y-2 text-xs text-slate-600">
              <p>
                {selectedPoint.address} - {selectedPoint.neighborhood}
              </p>
              <p className="font-medium text-brand">{selectedPoint.hours}</p>
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href={ROUTES.point(selectedPoint.id)}
                  className="font-semibold text-brand hover:underline"
                >
                  Ver detalhes
                </Link>
                <a
                  href={getDirectionsUrl(selectedPoint)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                >
                  Traçar rota <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

type ClusteredMarkersProps = Pick<
  PointsMapProps,
  'points' | 'selectedId' | 'hoveredId' | 'onSelect' | 'onHover'
>;

function ClusteredMarkers({
  points,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: ClusteredMarkersProps) {
  const map = useMap();
  const markersRef = useRef(new Map<string, Marker>());
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    const clusterer = new MarkerClusterer({
      map,
      markers: [...markersRef.current.values()],
    });
    clustererRef.current = clusterer;

    return () => {
      clusterer.clearMarkers();
      clusterer.setMap(null);
      clustererRef.current = null;
    };
  }, [map]);

  const setMarkerRef = useCallback((marker: Marker | null, id: string) => {
    const markers = markersRef.current;
    const previous = markers.get(id);
    if (previous === marker) return;

    if (previous) {
      markers.delete(id);
      clustererRef.current?.removeMarker(previous);
    }
    if (marker) {
      markers.set(id, marker);
      clustererRef.current?.addMarker(marker);
    }
  }, []);

  return points.map((point) => (
    <PointMarker
      key={point.id}
      point={point}
      isActive={point.id === selectedId || point.id === hoveredId}
      onRef={setMarkerRef}
      onSelect={onSelect}
      onHover={onHover}
    />
  ));
}

type PointMarkerProps = {
  point: CollectionPoint;
  isActive: boolean;
  onRef: (marker: Marker | null, id: string) => void;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

function PointMarker({
  point,
  isActive,
  onRef,
  onSelect,
  onHover,
}: PointMarkerProps) {
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement | null) =>
      onRef(marker, point.id),
    [onRef, point.id]
  );

  return (
    <AdvancedMarker
      position={point}
      title={point.name}
      ref={ref}
      zIndex={isActive ? 10 : 1}
      onClick={() => onSelect(point.id)}
      onMouseEnter={() => onHover(point.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={cn(
          'rounded-full p-2 text-white shadow-lg ring-4 transition-transform',
          isActive
            ? 'scale-125 bg-brand-dark ring-brand-pale'
            : 'bg-brand ring-white'
        )}
      >
        <MapPin className="h-4 w-4" />
      </div>
    </AdvancedMarker>
  );
}
