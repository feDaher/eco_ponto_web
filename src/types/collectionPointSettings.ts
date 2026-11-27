export type CollectionPointWeekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type CollectionPointHour = {
  id: string;
  weekday: CollectionPointWeekday;
  openTime: string;
  closeTime: string;
  isActive: boolean;
};

export type CooperativeDetails = {
  cooperativeName: string;
  cnpj: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  state: string;
  postalCode: string;
  email: string;
};

export type CollectionPointConfiguration = {
  id: string;
  name: string;
  description: string | null;
  city: string;
  address: string;
  latitude: string;
  longitude: string;
  whatsappContact: string | null;
  showWhatsappContact: boolean;
  hours: CollectionPointHour[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
  rejectionReason?: string | null;
  hoursConfirmedAt: string;
  isOutdated: boolean;
  wasteCategories: string[];
  cooperative?: CooperativeDetails;
};

export type CollectionPointCategory = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
};

export type CollectionPointSettingsInput = {
  name: string;
  description?: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  whatsappContact?: string;
  showWhatsappContact: boolean;
  wasteCategories: string[];
  operatingHours: {
    weekday: CollectionPointWeekday;
    openTime: string;
    closeTime: string;
  }[];
  cooperative: CooperativeDetails;
};
