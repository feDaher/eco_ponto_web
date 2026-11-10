'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {Recycle,LayoutDashboard,MapPin,Clock,MessageSquareCheck,BarChart3,Users} from 'lucide-react';

interface SidebarProps {
  activeRoute?: string;
}

export default function UserManagementSidebar({ activeRoute }: SidebarProps) {
  const pathname = usePathname();
  const currentRoute = activeRoute || pathname;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Pontos de Coleta', href: '/pontos-de-coleta', icon: MapPin },
    { label: 'Categorias e Horários', href: '/categorias-horarios', icon: Clock },
    { label: 'Moderação de Avaliações', href: '/moderacao', icon: MessageSquareCheck },
    { label: 'Relatórios e Exportação', href: '/relatorios', icon: BarChart3 },
    { label: 'Gestão de Usuários', href: '/gestao-usuarios', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
            <Recycle className="w-5 h-5 text-[#2d6a4f]" />
          </div>
          <div>
            <h1 className="font-bold text-[#2d6a4f] text-base leading-none">
              EcoPonto
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              GESTÃO PÚBLICA
            </p>
          </div>
        </div>

        <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          PAINEL INSTITUCIONAL
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.href || (item.href === '/gestao-usuarios' && !activeRoute && pathname === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 font-semibold rounded-xl text-xs transition ${
                  isActive
                    ? 'bg-[#4f7f62] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 text-[11px] text-slate-400 border-t border-slate-100">
        © 2026 EcoPonto Gestão Pública
      </div>
    </aside>
  );
}