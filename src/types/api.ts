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
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  cep: string;
  materials: Material[];
  hours: string;
  status: PointStatus;
};

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type OpeningHours = {
  weekdays: Weekday[];
  opens: string;
  closes: string;
};

export type AcceptedItem = {
  name: string;
  material: Material;
  description: string;
};

export type QuantityUnit = 'kg' | 'unidade' | 'litros';

export type PointCapacity = {
  unit: QuantityUnit;
  individualLimit?: number;
  individualNote?: string;
  businessMinimum?: number;
  businessNote?: string;
};

export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
  neighborhood?: string;
};

export type PointVerification = {
  verified: boolean;
  monitored: boolean;
  lastVerifiedAt?: string;
  updatedAt: string;
};

export type PointAdditionalInfo = {
  parking?: string[];
  safeDisposal?: string[];
  receipts?: string[];
};

export type WasteDestination = {
  description: string;
  recycledTons?: number;
  landfillPercentage?: number;
  familiesBenefited?: number;
  partnerCooperatives?: number;
  reportUrl?: string;
};

export type PointDetails = CollectionPoint & {
  description: string;
  responsible: string;
  imageUrl?: string;
  verification: PointVerification;
  whatsapp?: {
    authorized: boolean;
    phone: string;
  };
  schedule: OpeningHours[];
  closedOnHolidays: boolean;
  acceptedItems: AcceptedItem[];
  capacity: PointCapacity;
  rules: string[];
  reviews: Review[];
  coverage?: {
    radiusKm?: number;
    description?: string;
  };
  additionalInfo?: PointAdditionalInfo;
  destination?: WasteDestination;
};

export type PointFilters = {
  bounds?: MapBounds;
  materials?: Material[];
  query?: string;
};
