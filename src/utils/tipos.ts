export type WasteCategory =
  'Plástico' | 'Eletrônico' | 'Papel' | 'Vidro' | 'Metal';

export interface CollectionSchedule {
  day: string;
  isOpen: boolean;
  startTime?: string;
  endTime?: string;
  note?: string;
}

export interface AcceptedItem {
  name: string;
  category: WasteCategory;
  description: string;
  icon?: string;
}

export interface AdditionalPointInfo {
  parking?: string[];
  safeDisposal?: string[];
  receipts?: string[];
}

export interface Review {
  id: number;
  user: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;
  userLocation?: string;
}

export interface WasteDestination {
  description: string;

  recycledMaterialTons?: number;

  rejectedWastePercentage?: number;

  familiesBenefited?: number;

  partnerCooperatives?: number;

  reportUrl?: string;
}

export interface CollectionPoint {
  id: number;

  slug: string;

  name: string;

  description: string;

  responsiblePerson: string;

  mainImage: string;

  status: {
    verified: boolean;

    monitored: boolean;

    lastVerification: string;

    lastUpdated: string;
  };

  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    timeZone?: string;
    coverage?: {
      radiusKm?: number;
      description?: string;
    };

    latitude: number;
    longitude: number;
  };

  contact: {
    whatsapp: {
      authorized: boolean;
      phoneNumber?: string;
    };
  };

  schedules: CollectionSchedule[];

  categories: WasteCategory[];

  acceptedItems: AcceptedItem[];

  capacity: {
    individualLimit?: number;
    businessMinimumQuantity?: number;
    businessNote?: string;
    unit: 'kg' | 'unidade' | 'litros';
  };

  rules: string[];

  reviews: Review[];

  additionalInfo?: AdditionalPointInfo;

  destination?: WasteDestination;
}
