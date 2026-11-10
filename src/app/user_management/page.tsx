'use client';

import { useState } from 'react';
import UserManagementSidebar from './components/UserManagementSidebar';
import HeaderUserManagement from './components/HeaderUserManagement';
import UserManagementStats from './components/UserManagementStats';
import UserManagementFilters, { FilterState } from './components/UserManagementFilters';
import UserManagementTable from './components/UserManagementTable';
import UserManagementPagination from './components/UserManagementPagination';
import { usersData } from './mockdata/userData';

export default function HomePageUserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    role: 'all',
    status: 'all',
    polo: 'Manhuaçu',
    sort: 'recent',
  });

  const filteredUsers = usersData
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.subDetail.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesRole =
        filters.role === 'all' ||
        user.roleName.toLowerCase().includes(filters.role.toLowerCase());

      const matchesStatus =
        filters.status === 'all' ||
        user.statusText.toLowerCase() === filters.status.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sort === 'az') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sort === 'active') {
        return a.statusText === 'Ativo' ? -1 : 1;
      }
      return b.id - a.id; 
    });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen overflow-hidden bg-[#f4f6f8] font-sans text-slate-800 selection:bg-emerald-100">
      <UserManagementSidebar activeRoute="/gestao-usuarios" />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderUserManagement />

        <main className="mx-auto flex-1 w-full max-w-[1400px] overflow-y-auto p-6 space-y-5">
          <UserManagementStats 
            users={filteredUsers}
            totalBaseCount={usersData.length}
            
          />

          <UserManagementFilters onFilterChange={handleFilterChange} />

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <UserManagementTable
              users={filteredUsers}
              currentPage={currentPage}
              pageSize={pageSize}
            />

            <UserManagementPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={filteredUsers.length}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}