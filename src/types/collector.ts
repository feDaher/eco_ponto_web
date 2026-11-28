import type { OpeningHours, PointStatus } from '@/types/api';
import type { CollectionPointWeekday } from '@/types/collectionPointSettings';

export type CollectorHour = {
  id: string;
  weekday: CollectionPointWeekday;
  openTime: string;
  closeTime: string;
};

export type CollectorCategory = {
  categoryId: string;
  code: string;
  label: string;
  approvalStatus: 'PENDING' | 'APPROVED';
  isAccepting: boolean;
};

export type CollectorPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  status: PointStatus;
  hours: CollectorHour[];
  schedule: OpeningHours[];
  categories: CollectorCategory[];
  isOutdated: boolean;
  hoursConfirmedAt: string | null;
  cooperative: {
    name: string;
    cnpj: string;
    neighborhood: string;
    postalCode: string;
  } | null;
};

export type WeeklyHour = {
  weekday: CollectionPointWeekday;
  openTime: string;
  closeTime: string;
};
