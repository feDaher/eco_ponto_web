'use client';

import React, { useState } from 'react';
import { Search, Users, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FilterState {
  searchTerm: string;
  role: string;
  status: string;
  polo: string;
  sort: 'recent' | 'active' | 'az';
}

interface UserManagementFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  onClearFilters?: () => void;
}

export default function UserManagementFilters({
  onFilterChange,
  onClearFilters,
}: UserManagementFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos os Perfis');
  const [selectedStatus, setSelectedStatus] = useState('Todos os Status');
  const [selectedPolo, setSelectedPolo] = useState('Manhuaçu');
  const [activeSort, setActiveSort] = useState<'recent' | 'active' | 'az'>('recent');

  const emitFilterChange = (updatedState: Partial<FilterState>) => {
    const currentState: FilterState = {
      searchTerm,
      role: selectedRole,
      status: selectedStatus,
      polo: selectedPolo,
      sort: activeSort,
      ...updatedState,
    };
    if (onFilterChange) onFilterChange(currentState);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    emitFilterChange({ searchTerm: value });
  };

  const handleSort = (sortOption: 'recent' | 'active' | 'az') => {
    setActiveSort(sortOption);
    emitFilterChange({ sort: sortOption });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setSelectedPolo('Manhuaçu');
    setActiveSort('recent');
    if (onClearFilters) onClearFilters();
    if (onFilterChange) {
      onFilterChange({
        searchTerm: '',
        role: 'all',
        status: 'all',
        polo: 'Manhuaçu',
        sort: 'recent',
      });
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
      <div className="flex flex-col items-center justify-between gap-2.5 lg:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar por Nome, E-mail ou CPF..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-700 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
          <Select
            value={selectedRole}
            onValueChange={(value) => {
              if (value === null) return;
              setSelectedRole(value);
              emitFilterChange({ role: value });
            }}
          >
            <SelectTrigger className="h-9 min-w-[170px] gap-2 rounded-xl border-slate-200/80 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-none transition hover:bg-slate-100 focus:ring-1 focus:ring-emerald-600 focus:ring-offset-0">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <SelectValue placeholder="Perfil: Todos os Perfis" />
              </div>
            </SelectTrigger>

            <SelectContent className="rounded-xl border-slate-200 bg-white text-xs shadow-lg">
              <SelectItem value="all" className="font-medium text-slate-700 focus:bg-slate-100">
                Perfil: Todos os Perfis
              </SelectItem>
              <SelectItem value="Guardião Digital" className="font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-900">
                Guardião Digital
              </SelectItem>
              <SelectItem value="Coletor" className="font-medium text-slate-700 focus:bg-indigo-50 focus:text-indigo-900">
                Coletor / Cooperativa
              </SelectItem>
              <SelectItem value="Fiscal Ambiental" className="font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-900">
                Fiscal Ambiental
              </SelectItem>
              <SelectItem value="Operador" className="font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-900">
                Operador de Triagem
              </SelectItem>
              <SelectItem value="Cidadão" className="font-medium text-slate-700 focus:bg-slate-100">
                Cidadão
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              if (value === null) return;
              setSelectedStatus(value);
              emitFilterChange({ status: value });
            }}
          >
            <SelectTrigger className="h-9 min-w-[150px] gap-2 rounded-xl border-slate-200/80 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-none transition hover:bg-slate-100 focus:ring-1 focus:ring-emerald-600 focus:ring-offset-0">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <SelectValue placeholder="Status: Todos" />
              </div>
            </SelectTrigger>

            <SelectContent className="rounded-xl border-slate-200 bg-white text-xs shadow-lg">
              <SelectItem value="all" className="font-medium text-slate-700 focus:bg-slate-100">
                Status: Todos
              </SelectItem>
              <SelectItem value="Ativo" className="font-medium text-slate-700 focus:bg-emerald-50 focus:text-emerald-800">
                Ativo
              </SelectItem>
              <SelectItem value="Pendente" className="font-medium text-slate-700 focus:bg-amber-50 focus:text-amber-800">
                Pendente
              </SelectItem>
              <SelectItem value="Bloqueado" className="font-medium text-slate-700 focus:bg-rose-50 focus:text-rose-800">
                Bloqueado
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex items-center rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
            <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="font-semibold text-slate-700">Polo: {selectedPolo}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 border-t border-slate-100 pt-2 text-xs sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            FILTROS ATIVOS:
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            Polo: {selectedPolo} - MG
            <X
              className="h-3 w-3 cursor-pointer text-emerald-700 hover:opacity-80"
              onClick={handleReset}
            />
          </span>
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              Status: {selectedStatus}
              <X
                className="h-3 w-3 cursor-pointer text-emerald-700 hover:opacity-80"
                onClick={() => {
                  setSelectedStatus('all');
                  emitFilterChange({ status: 'all' });
                }}
              />
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-semibold text-slate-500 underline hover:text-slate-800"
          >
            Limpar filtros
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-[11px]">Ordenar:</span>
          <button
            type="button"
            onClick={() => handleSort('recent')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${
              activeSort === 'recent'
                ? 'bg-slate-200 text-slate-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mais recentes
          </button>
          <button
            type="button"
            onClick={() => handleSort('active')}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              activeSort === 'active'
                ? 'bg-slate-200 text-slate-800'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Mais ativos
          </button>
          <button
            type="button"
            onClick={() => handleSort('az')}
            className={`rounded-lg px-2.5 py-1 font-medium transition ${
              activeSort === 'az'
                ? 'bg-slate-200 text-slate-800'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            A–Z
          </button>
        </div>
      </div>
    </div>
  );
}