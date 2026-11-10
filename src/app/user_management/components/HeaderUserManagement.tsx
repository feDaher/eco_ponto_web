'use client';

import { useState } from 'react';
import { Building2, ChevronDown, Bell, User } from 'lucide-react';

interface HeaderUserManagementProps {
  poloName?: string;
  regionName?: string;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export default function HeaderUserManagement({
  poloName = 'Polo Regional Manhuaçu - MG',
  regionName = 'Zona da Mata Mineira',
  userName = 'Gestão Municipal',
  userRole = 'Admin Geral - Manhuaçu',
  userInitials = 'GM',
}: HeaderUserManagementProps) {
  const [hasNotification, setHasNotification] = useState(true);

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shrink-0 z-10">
      {/* Seletor de Polo / Região */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-200/70 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 transition"
        >
          <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
          <span>{poloName}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        <span className="text-xs font-semibold text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          {regionName}
        </span>
      </div>

      {/* Ações e Perfil do Usuário */}
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button
          type="button"
          onClick={() => setHasNotification(false)}
          className="relative cursor-pointer p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
          aria-label="Notificações"
        >
          <Bell className="w-4 h-4" />
          {hasNotification && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Perfil do Administrador */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">{userName}</div>
            <div className="text-[10px] text-slate-500 font-medium">
              {userRole}
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}