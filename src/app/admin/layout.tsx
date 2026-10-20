import type { ReactNode } from 'react';
import { Bell, ChevronDown } from 'lucide-react';

import { EcoPontoIcon } from '@/components/icons/EcoPontoIcon';
import { DashboardIcon } from '@/components/icons/DashboardIcon';
import { LixeiraIcon } from '@/components/icons/LixeiraIcon';
import { HistoricoIcon } from '@/components/icons/HistoricoIcon';
import { EditarIcon } from '@/components/icons/EditarIcon';
import { UsuariosIcon } from '@/components/icons/UsuariosIcon';
import { RelatoriosIcon } from '@/components/icons/RelatoriosIcon';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* ==================== SIDEBAR ==================== */}
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[288px] flex-col bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Logo EcoPonto */}
          <div className="flex items-center gap-2 px-2 py-1">
            <EcoPontoIcon className="h-6 w-6" />

            <div>
              <p className="text-base font-semibold leading-tight text-[#36654A]">
                EcoPonto
              </p>

              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#414943]">
                Painel Admin
              </p>
            </div>
          </div>

          {/* Título da seção */}
          <p className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-[#717972]">
            Painel institucional
          </p>

          {/* Menu */}
          <nav className="flex flex-col gap-1">
            {/* Visão Geral */}
            <a
              href="/admin"
              className="flex items-center gap-2 rounded-xl bg-[#4F7F62] px-4 py-2 text-[13px] font-semibold text-[#F6FFF5] transition hover:bg-[#426C53]"
            >
              <DashboardIcon className="h-4 w-4" />
              <span>Visão Geral</span>
            </a>

            {/* Pontos de Coleta */}
            <a
              href="/admin/points"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-[#414943] transition hover:bg-gray-50"
            >
              <LixeiraIcon className="h-4 w-4" />
              <span>Pontos de Coleta</span>
            </a>

            {/* Categorias e Horários */}
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-[#414943] transition hover:bg-gray-50"
            >
              <HistoricoIcon className="h-4 w-4" />
              <span>Categorias e Horários</span>
            </a>

            {/* Moderação de Avaliações */}
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-[#414943] transition hover:bg-gray-50"
            >
              <EditarIcon className="h-4 w-4" />
              <span>Moderação de Avaliações</span>
            </a>

            {/* Usuários */}
            <a
              href="/admin/users"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-[#414943] transition hover:bg-gray-50"
            >
              <UsuariosIcon className="h-4 w-4" />
              <span>Usuários</span>
            </a>

            {/* Relatórios */}
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold text-[#414943] transition hover:bg-gray-50"
            >
              <RelatoriosIcon className="h-4 w-4" />
              <span>Relatórios</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* ==================== HEADER ==================== */}
      <header className="fixed left-[288px] right-0 top-0 z-10 flex h-16 items-center justify-between bg-[#F8F9FF]/85 px-6 shadow-sm backdrop-blur-md">
        {/* Identificação do sistema */}
        <div className="flex items-center gap-4 rounded-full bg-white px-4 py-1 shadow-sm">
          <EcoPontoIcon className="h-3.5 w-3.5" />

          <span className="text-xs font-semibold text-[#121C2A]">
            EcoPonto Admin
          </span>

          <ChevronDown className="h-3 w-3 text-[#717972]" />
        </div>

        {/* Área direita */}
        <div className="flex items-center gap-4">
          {/* Notificações */}
          <button
            type="button"
            aria-label="Notificações"
            className="relative rounded-full p-2 transition hover:bg-white"
          >
            <Bell className="h-[18px] w-[18px] text-[#414943]" />

            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-[#BA1A1A] ring-2 ring-[#F8F9FF]" />
          </button>

          {/* Divisor */}
          <div className="h-6 w-px bg-[#C0C9C0]" />

          {/* Usuário */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-bold text-[#121C2A]">Admin User</p>

              <p className="text-[11px] font-semibold text-[#414943]">
                Administrador
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#36654A]">
              <UsuariosIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      {/* ==================== CONTEÚDO ==================== */}
      <main className="min-h-screen w-full pl-[288px] pt-16">
        <div className="mx-auto max-w-[992px] px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
