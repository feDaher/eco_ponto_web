'use client';

import { useMemo, useState } from 'react';
import { Download, Search, X } from 'lucide-react';
import { FIELD_CLASS } from '@/components/point/fieldStyles';
import { Button } from '@/components/ui/Button';
import {
  DEFAULT_USER_FILTERS,
  ROLE_LABELS,
  SORT_LABELS,
  STATUS_LABELS,
  buildUsersReportHtml,
  filterUsers,
  type UserFilters,
  type UserSort,
} from '@/lib/users';
import { cn } from '@/lib/utils';
import type { ManagedUser, ManagedUserStatus, UserRole } from '@/types/user';
import { PAGE_SIZES, UserPagination } from './UserPagination';

const ROLE_BADGE: Record<UserRole, string> = {
  CITIZEN: 'bg-brand-light text-brand-dark',
  COLLECTOR: 'bg-surface-strong text-brand-dark',
  ADMIN: 'bg-slate-100 text-slate-700',
};

const STATUS_BADGE: Record<ManagedUserStatus, string> = {
  active: 'bg-brand-light text-brand-dark',
  pending:
    'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
  blocked: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
};

const STATUS_DOT: Record<ManagedUserStatus, string> = {
  active: 'bg-brand',
  pending: 'bg-amber-500',
  blocked: 'bg-red-500',
};

function initials(name: string) {
  return name
    .replace(/^(Dra?|Eng)\.\s+/, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part, index, parts) =>
      index === 0 || index === parts.length - 1 ? part[0] : ''
    )
    .join('')
    .toUpperCase();
}

type UserManagementProps = {
  users: ManagedUser[];
};

export function UserManagement({ users }: UserManagementProps) {
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_USER_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => filterUsers(users, filters), [users, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const hasActiveFilters =
    filters.query !== '' || filters.role !== 'all' || filters.status !== 'all';

  function updateFilters(patch: Partial<UserFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
    setPage(1);
  }

  function exportReport() {
    if (filtered.length === 0) {
      setMessage('Nenhum usuário para exportar com os filtros atuais.');
      return;
    }

    const report = window.open('', '_blank');
    if (!report) {
      setMessage('Permita pop-ups neste site para gerar o relatório.');
      return;
    }

    setMessage(null);
    report.document.write(buildUsersReportHtml(filtered, new Date()));
    report.document.close();
    report.focus();
    report.print();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar usuário</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={filters.query}
            onChange={(event) => updateFilters({ query: event.target.value })}
            placeholder="Buscar por nome, e-mail, documento ou cargo"
            className={cn(FIELD_CLASS, 'w-full pl-9')}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-3 lg:flex">
          <label className="lg:w-44">
            <span className="sr-only">Filtrar por perfil</span>
            <select
              value={filters.role}
              onChange={(event) =>
                updateFilters({
                  role: event.target.value as UserFilters['role'],
                })
              }
              className={cn(FIELD_CLASS, 'w-full')}
            >
              <option value="all">Todos os perfis</option>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="lg:w-44">
            <span className="sr-only">Filtrar por situação</span>
            <select
              value={filters.status}
              onChange={(event) =>
                updateFilters({
                  status: event.target.value as UserFilters['status'],
                })
              }
              className={cn(FIELD_CLASS, 'w-full')}
            >
              <option value="all">Todas as situações</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="lg:w-44">
            <span className="sr-only">Ordenar</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                updateFilters({ sort: event.target.value as UserSort })
              }
              className={cn(FIELD_CLASS, 'w-full')}
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {filtered.length === users.length
            ? `${users.length} usuários cadastrados`
            : `${filtered.length} de ${users.length} usuários`}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() =>
                updateFilters({ ...DEFAULT_USER_FILTERS, sort: filters.sort })
              }
              className="ml-3 inline-flex cursor-pointer items-center gap-1 font-semibold text-brand hover:underline"
            >
              <X aria-hidden="true" className="size-3.5" />
              Limpar filtros
            </button>
          )}
        </p>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={exportReport}
        >
          <Download aria-hidden="true" />
          Exportar PDF
        </Button>
      </div>

      {message && (
        <p
          role="status"
          className="rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
        >
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead className="bg-surface-alt text-[11px] tracking-wider text-slate-500 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">
                Usuário
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Perfil
              </th>
              <th scope="col" className="px-4 py-3 font-bold">
                Unidade
              </th>
              <th scope="col" className="px-4 py-3 text-right font-bold">
                Situação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((user) => (
              <tr key={user.id} className="align-top">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-xs font-bold text-brand-dark"
                    >
                      {initials(user.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold text-slate-900">
                        {user.name}
                        {user.level && (
                          <span className="rounded bg-brand-light px-1.5 py-0.5 text-[10px] font-bold text-brand-dark uppercase">
                            Nível {user.level}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="text-[11px] text-slate-400">
                        {user.identification}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      ROLE_BADGE[user.role]
                    )}
                  >
                    {ROLE_LABELS[user.role]}
                  </span>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {user.title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {user.roleDetail}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-700">{user.unit}</p>
                  <p className="text-xs text-slate-500">{user.unitDetail}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      STATUS_BADGE[user.status]
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-1.5 rounded-full',
                        STATUS_DOT[user.status]
                      )}
                    />
                    {STATUS_LABELS[user.status]}
                  </span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  Nenhum usuário encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserPagination
        page={currentPage}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
