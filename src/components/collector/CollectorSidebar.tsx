'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  ClipboardPlus,
  Cog,
  History,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { COLLECTOR_SECTIONS, ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useCollector } from './collectorContext';

type SidebarItem = {
  label: string;
  href: string;
  page: string;
  icon: LucideIcon;
};

function section(id: string) {
  return `${ROUTES.collector}#${id}`;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Visão geral',
    href: section(COLLECTOR_SECTIONS.overview),
    page: ROUTES.collector,
    icon: LayoutDashboard,
  },
  {
    label: 'Registrar recebimento',
    href: section(COLLECTOR_SECTIONS.receipt),
    page: '',
    icon: ClipboardPlus,
  },
  {
    label: 'Histórico e MTRs',
    href: section(COLLECTOR_SECTIONS.history),
    page: '',
    icon: History,
  },
  {
    label: 'Materiais e capacidade',
    href: ROUTES.collectorMaterials,
    page: ROUTES.collectorMaterials,
    icon: Boxes,
  },
  {
    label: 'Configurações',
    href: ROUTES.collectorSettings,
    page: ROUTES.collectorSettings,
    icon: Cog,
  },
];

export function CollectorSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { selectedPoint } = useCollector();
  const cooperative = selectedPoint?.cooperative;

  return (
    <aside className="lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:self-start">
      <div className="hidden rounded-2xl border border-slate-200/70 bg-surface-alt p-4 lg:block">
        <p className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">
          Parceiro coletor
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
          {cooperative?.name ?? user?.name}
        </p>
        {cooperative ? (
          <p className="text-xs text-slate-500">CNPJ: {cooperative.cnpj}</p>
        ) : (
          user?.city && <p className="text-xs text-slate-500">{user.city}</p>
        )}
      </div>

      <nav aria-label="Painel do coletor" className="lg:mt-4">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {sidebarItems.map(({ label, href, page, icon: Icon }) => {
            const active = page === pathname;

            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand',
                    active
                      ? 'border-transparent bg-brand-light font-semibold text-brand-dark'
                      : 'border-slate-200 bg-card font-medium text-slate-600 hover:bg-surface-alt hover:text-brand lg:border-transparent lg:bg-transparent'
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
