export type AuditAction = 'ACCESS_DENIED' | 'RESOURCE_CHANGED';

export type AuditLogUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuditLogItem = {
  id: string;
  createdAt: string;
  action: AuditAction;
  method: string;
  route: string;
  resourceId: string | null;
  statusCode: number;
  user: AuditLogUser | null;
};

export type AuditLogsQuery = {
  action?: AuditAction;
  userId?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
};

export type AuditLogsResponse = {
  items: AuditLogItem[];
  nextCursor: string | null;
};
