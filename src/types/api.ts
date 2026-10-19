export type Material =
  'pilhas' | 'eletronicos' | 'plastico' | 'papel' | 'vidro' | 'metal' | 'oleo';

export type PointStatus = 'pending' | 'approved' | 'rejected';

export type LatLng = {
  lat: number;
  lng: number;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type CollectionPoint = LatLng & {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  cep: string;
  materials: Material[];
  hours: string;
  status: PointStatus;
};

export type PointFilters = {
  bounds?: MapBounds;
  materials?: Material[];
  query?: string;
};
