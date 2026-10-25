export type Region = 'Manhuaçu – MG' | 'Viçosa – MG' | 'Ponte Nova – MG';
export type PointStatus = 'pending' | 'approved' | 'rejected' | 'removed';
export type PointCategory =
  | 'Ponto comunitário / escolar'
  | 'Descarte especializado'
  | 'Varejo / urna interna';
export type Decision = 'Aprovado' | 'Reprovado' | 'Removido';
export type ModerationTab = 'pending' | 'history' | 'approved';
export type ActionType = 'reject' | 'remove';

export interface Attachment {
  name: string;
  description: string;
  kind: 'Documento' | 'Registro fotográfico';
}

export interface CollectionPoint {
  id: string;
  protocol: string;
  name: string;
  requester: string;
  category: PointCategory;
  region: Region;
  sentAt: string;
  address: string;
  acceptedItems: string[];
  collectionHours: string;
  structure: string;
  capacity: string;
  contact: string;
  responsible: string;
  cnpj: string;
  wasteTypes: string[];
  photoCaption: string;
  attachments: Attachment[];
  status: PointStatus;
}

export interface AuditEntry {
  id: string;
  protocol: string;
  establishment: string;
  region: Region;
  decision: Decision;
  analyst: string;
  date: string;
  time: string;
  reason?: string;
}

export interface RegionMetrics {
  approved: number;
  rejected: number;
  previousMonthApprovalRate: number;
}

export interface ActionDialogState {
  type: ActionType;
  point: CollectionPoint;
  reason: string;
  customReason: string;
  notifyRequester: boolean;
}
