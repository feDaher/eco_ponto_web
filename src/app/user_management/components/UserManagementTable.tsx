'use client';

import React, { useState } from 'react';
import { UserItem } from '../mockdata/userData';

interface UserManagementTableProps {
  users: UserItem[];
  currentPage?: number;
  pageSize?: number;
}

export default function UserManagementTable({
  users,
  currentPage = 1,
  pageSize = 6,
}: UserManagementTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const startIndex = (currentPage - 1) * pageSize;
  const currentTableData = users.slice(startIndex, startIndex + pageSize);

  const toggleSelectAll = () => {
    if (selectedUsers.length === currentTableData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentTableData.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uId) => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th className="w-10 px-4 py-3 text-center">
              <input
                type="checkbox"
                checked={
                  currentTableData.length > 0 &&
                  selectedUsers.length === currentTableData.length
                }
                onChange={toggleSelectAll}
                className="cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th className="px-4 py-3">USUÁRIO &amp; IDENTIFICAÇÃO</th>
            <th className="px-4 py-3">PERFIL / CARGO</th>
            <th className="px-4 py-3">POLO / UNIDADE</th>
            <th className="px-4 py-3 text-right">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {currentTableData.length > 0 ? (
            currentTableData.map((user) => {
              const isSelected = selectedUsers.includes(user.id);
              return (
                <tr
                  key={user.id}
                  className={`transition hover:bg-slate-50/70 ${
                    isSelected ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectUser(user.id)}
                      className="cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${user.avatarBg}`}
                        >
                          {user.initials}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white ${user.iconBadgeBg}`}
                        >
                          {user.iconBadge}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">
                            {user.name}
                          </span>
                          {user.levelBadge && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-800">
                              {user.levelBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.email}
                        </div>
                        <div className="mt-0.5 text-[10px] font-medium text-slate-400">
                          {user.subDetail}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${user.roleBadgeStyle}`}
                      >
                        {user.roleIcon}
                        {user.roleName}
                      </span>
                      <div className="text-[11px] text-slate-500">
                        {user.roleSubtext}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        {user.unitIcon}
                        <span>{user.unitName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {user.unitSubtext}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${user.statusStyle}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${user.statusDot}`}
                      />
                      {user.statusText}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-400">
                Nenhum usuário encontrado para os filtros selecionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}