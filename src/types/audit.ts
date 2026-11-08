export type AuditAction = 'ACCESS_DENIED' | 'RESOURCE_CHANGED';

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  ACCESS_DENIED: 'Acesso negado',
  RESOURCE_CHANGED: 'Alteração',
};

export interface AuditLogUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface AuditLogItem {
  id: string;
  createdAt: string;
  action: AuditAction;
  method: string;
  route: string;
  resourceId: string | null;
  statusCode: number;
  user: AuditLogUser | null;
}

export interface AuditLogsQuery {
  action?: AuditAction;
  userId?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
}

export interface AuditLogsResponse {
  items: AuditLogItem[];
  nextCursor: string | null;
}

export class AuditApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuditApiError';
    this.status = status;
  }
}
