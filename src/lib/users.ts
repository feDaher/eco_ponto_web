import type { ManagedUser, ManagedUserStatus, UserRole } from '@/types/user';

export type UserSort = 'recent' | 'status' | 'name';

export type UserFilters = {
  query: string;
  role: UserRole | 'all';
  status: ManagedUserStatus | 'all';
  sort: UserSort;
};

export const DEFAULT_USER_FILTERS: UserFilters = {
  query: '',
  role: 'all',
  status: 'all',
  sort: 'recent',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  CITIZEN: 'Cidadão',
  COLLECTOR: 'Coletor',
  ADMIN: 'Administrador',
};

export const STATUS_LABELS: Record<ManagedUserStatus, string> = {
  active: 'Ativo',
  pending: 'Pendente',
  blocked: 'Bloqueado',
};

export const SORT_LABELS: Record<UserSort, string> = {
  recent: 'Mais recentes',
  status: 'Ativos primeiro',
  name: 'A–Z',
};

const STATUS_WEIGHT: Record<ManagedUserStatus, number> = {
  active: 0,
  pending: 1,
  blocked: 2,
};

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function filterUsers(users: ManagedUser[], filters: UserFilters) {
  const query = normalize(filters.query.trim());

  return users
    .filter((user) => {
      const matchesQuery =
        !query ||
        [user.name, user.email, user.identification, user.title].some((field) =>
          normalize(field).includes(query)
        );
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesStatus =
        filters.status === 'all' || user.status === filters.status;

      return matchesQuery && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      if (filters.sort === 'status') {
        const byStatus = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
        if (byStatus !== 0) return byStatus;
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
}

export function getPageNumbers(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  return sorted.flatMap<number | 'gap'>((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? ['gap', page] : [page]
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildUsersReportHtml(users: ManagedUser[], generatedAt: Date) {
  const rows = users
    .map((user) =>
      [
        user.name,
        user.email,
        `${ROLE_LABELS[user.role]} · ${user.title}`,
        user.unit,
        STATUS_LABELS[user.status],
      ]
        .map((cell) => `<td>${escapeHtml(cell)}</td>`)
        .join('')
    )
    .map((cells) => `<tr>${cells}</tr>`)
    .join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Relatório de usuários | EcoPonto Digital</title>
<style>
body { font-family: Arial, sans-serif; font-size: 12px; margin: 24px; color: #1e293b; }
h1 { font-size: 18px; color: #1b5e3f; margin: 0 0 4px; }
p { font-size: 11px; color: #64748b; margin: 0 0 16px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
th { background: #f8fafc; font-size: 10px; text-transform: uppercase; color: #475569; }
</style>
</head>
<body>
<h1>Relatório de usuários</h1>
<p>Gerado em ${escapeHtml(generatedAt.toLocaleString('pt-BR'))} · ${users.length} registros</p>
<table>
<thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Unidade</th><th>Situação</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body>
</html>`;
}
