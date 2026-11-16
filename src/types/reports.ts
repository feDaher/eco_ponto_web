export type DisposalStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type ExportScope = 'general' | 'category' | 'geospatial' | 'manifests';
export type ExportFormat = 'csv' | 'pdf' | 'geojson' | 'kml';

export interface ReportFiltersState {
  from: string;
  to: string;
  categoryId?: string;
  region?: string;
  status?: DisposalStatus | '';
  search?: string;
}

export interface ReportSummary {
  filter: Omit<ReportFiltersState, 'status'> & { status?: DisposalStatus };
  totals: {
    disposals: number;
    weightKg: number;
    points: number;
  };
  comparison: {
    previousFrom: string;
    previousTo: string;
    weightKg: number;
    variationPercent: number | null;
  };
  co2: {
    avoidedKg: number;
    treesSaved: number;
  };
  activePoints: {
    total: number;
  };
}

export interface CategoryRow {
  categoryId: string;
  name: string;
  displayName: string;
  destinador: string | null;
  disposals: number;
  weightKg: number;
  percentage: number;
}

export interface PointRow {
  collectionPointId: string;
  name: string;
  address: string;
  neighborhood: string | null;
  city: string;
  latitude: number;
  longitude: number;
  weightKg: number;
  percentage: number;
}

export interface ManifestRow {
  protocol: string;
  disposedAt: string;
  collectionPointName: string;
  categoryName: string;
  categoryDisplayName: string;
  weightKg: number;
  pointsEarned: number;
  destinador: string | null;
  status: DisposalStatus;
}

export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  categories: { id: string; name: string; displayName: string }[];
  regions: string[];
  statuses: { value: DisposalStatus; label: string }[];
}
