'use client';

import { AdvancedMarker, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import {
  GoogleMapsProvider,
  MAP_ID,
} from '@/components/map/GoogleMapsProvider';
import type { LatLng } from '@/types/api';

type PointLocationMapProps = {
  position: LatLng;
  title: string;
};

export function PointLocationMap({ position, title }: PointLocationMapProps) {
  return (
    <GoogleMapsProvider>
      <GoogleMap
        mapId={MAP_ID}
        defaultCenter={position}
        defaultZoom={16}
        gestureHandling="cooperative"
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        className="h-full w-full"
      >
        <AdvancedMarker position={position} title={title}>
          <div className="rounded-full bg-brand p-2 text-white shadow-lg ring-4 ring-white">
            <MapPin className="size-4" />
          </div>
        </AdvancedMarker>
      </GoogleMap>
    </GoogleMapsProvider>
  );
}
