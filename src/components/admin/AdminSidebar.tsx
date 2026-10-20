'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPinned,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const adminNav: AdminNavItem[] = [
  { label: 'Visão geral', href: ROUTES.admin, icon: LayoutDashboard },
  { label: 'Pontos de coleta', href: ROUTES.adminPoints, icon: MapPinned },
  { label: 'Usuários', href: ROUTES.adminUsers, icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:self-start">
      <div className="hidden rounded-2xl border border-slate-200/70 bg-surface-alt p-4 lg:block">
        <p className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">
          Painel institucional
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          Prefeitura de Manhuaçu
        </p>
        <p className="text-xs text-slate-500">Administrador</p>
      </div>

      <nav aria-label="Painel administrativo" className="lg:mt-4">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {adminNav.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand',
                    isActive
                      ? 'border-brand-medium bg-brand-medium text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-surface-alt hover:text-brand lg:border-transparent lg:bg-transparent'
                  )}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
