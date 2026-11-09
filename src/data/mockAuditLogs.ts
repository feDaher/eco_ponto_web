import type { AuditAction, AuditLogItem, AuditLogUser } from '@/types/audit';

const USERS = {
  marina: {
    id: 'usr-001',
    name: 'Marina Souza',
    email: 'marina.souza@exemplo.gov.br',
    role: 'ADMIN',
  },
  carlos: {
    id: 'usr-014',
    name: 'Carlos Pereira',
    email: 'carlos.pereira@exemplo.com',
    role: 'CITIZEN',
  },
  ricardo: {
    id: 'usr-003',
    name: 'Ricardo Alves',
    email: 'ricardo.alves@exemplo.gov.br',
    role: 'ADMIN',
  },
  joana: {
    id: 'usr-027',
    name: 'Joana Martins',
    email: 'joana.martins@exemplo.com',
    role: 'COLLECTOR',
  },
} satisfies Record<string, AuditLogUser>;

type UserKey = keyof typeof USERS;

interface Template {
  user: UserKey | null;
  action: AuditAction;
  method: string;
  route: string;
  resourceId: string | null;
  statusCode: number;
}

const TEMPLATES: Template[] = [
  {
    user: 'marina',
    action: 'RESOURCE_CHANGED',
    method: 'PATCH',
    route: '/admin/collection-points/18/schedule',
    resourceId: '18',
    statusCode: 200,
  },
  {
    user: 'carlos',
    action: 'ACCESS_DENIED',
    method: 'GET',
    route: '/admin/users',
    resourceId: null,
    statusCode: 403,
  },
  {
    user: null,
    action: 'ACCESS_DENIED',
    method: 'GET',
    route: '/admin/audit-logs',
    resourceId: null,
    statusCode: 403,
  },
  {
    user: 'marina',
    action: 'RESOURCE_CHANGED',
    method: 'POST',
    route: '/admin/waste-categories',
    resourceId: '8',
    statusCode: 201,
  },
  {
    user: 'ricardo',
    action: 'RESOURCE_CHANGED',
    method: 'PATCH',
    route: '/admin/waste-categories/3',
    resourceId: '3',
    statusCode: 200,
  },
  {
    user: 'joana',
    action: 'ACCESS_DENIED',
    method: 'PATCH',
    route: '/admin/collection-points/7',
    resourceId: '7',
    statusCode: 403,
  },
  {
    user: 'marina',
    action: 'RESOURCE_CHANGED',
    method: 'PATCH',
    route: '/admin/users/52/role',
    resourceId: '52',
    statusCode: 200,
  },
  {
    user: null,
    action: 'RESOURCE_CHANGED',
    method: 'PATCH',
    route: '/admin/collection-points/11/schedule',
    resourceId: '11',
    statusCode: 200,
  },
];

function buildLogs(): AuditLogItem[] {
  const total = 48;
  let time = Date.parse('2026-11-05T21:12:08-03:00');
  const items: AuditLogItem[] = [];

  for (let i = 0; i < total; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];
    items.push({
      id: `log-${String(total - i).padStart(3, '0')}`,
      createdAt: new Date(time).toISOString(),
      action: template.action,
      method: template.method,
      route: template.route,
      resourceId: template.resourceId,
      statusCode: template.statusCode,
      user: template.user ? USERS[template.user] : null,
    });
    time -= (25 + ((i * 53) % 170)) * 60_000 + (i % 5) * 7_000;
  }

  return items;
}

export const mockAuditLogs: AuditLogItem[] = buildLogs();
