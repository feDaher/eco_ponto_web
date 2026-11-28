import type { OpeningHours, PointStatus } from '@/types/api';
import type { User } from '@/types/user';

export type CategoryUnderReview = {
  id?: string;
  label: string;
  phase?: string;
  description?: string;
};

export type CollectorPointStats = {
  monthlyKg: number;
  monthlyGrowth: number | null;
  storedKg: number;
  capacityKg: number;
  lastCheckIn?: string | null;
};

export type CollectorPoint = {
  id: string;
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  cep: string;
  status: PointStatus;
  materials: string[];
  schedule: OpeningHours[];
  collectorName?: string | null;
  cnpj?: string | null;
  unit?: string | null;
  protocol?: string | null;
  updatedAt?: string | null;
  stats?: CollectorPointStats | null;
  categoryUnderReview?: CategoryUnderReview | null;
};

export type CollectorMaterial = {
  id: string;
  code?: string;
  name: string;
  description?: string;
  accepting: boolean;
  storedKg: number;
  capacityKg: number;
};

export type CollectorOverviewData = {
  user: User;
  points: CollectorPoint[];
};

export type ReceiptStatus = 'sorted' | 'awaiting';

export type CollectorReceipt = {
  id: string;
  pointId?: string;
  time: string;
  donor: string;
  donorType: string;
  description: string;
  weightKg: number;
  status: ReceiptStatus;
};
