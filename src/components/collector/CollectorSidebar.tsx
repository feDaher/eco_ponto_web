import Link from 'next/link';
import {
  Boxes,
  ClipboardPlus,
  Clock,
  History,
  LayoutDashboard,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import { collectorProfile } from '@/data/mockCollector';
import { cn } from '@/lib/utils';

const COLLECTOR_HOME = '/collector';
const COLLECTOR_MATERIALS = '/collector/materials';

type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const sidebarItems: SidebarItem[] = [
  {
    label: 'Visão geral',
    href: `${COLLECTOR_HOME}#${COLLECTOR_SECTIONS.overview}`,
    icon: LayoutDashboard,
  },
  {
    label: 'Registrar recebimento',
    href: `${COLLECTOR_HOME}#${COLLECTOR_SECTIONS.receipt}`,
    icon: ClipboardPlus,
  },
  {
    label: 'Histórico e MTRs',
    href: `${COLLECTOR_HOME}#${COLLECTOR_SECTIONS.history}`,
    icon: History,
  },
  {
    label: 'Meu ponto de coleta',
    href: `${COLLECTOR_HOME}#${COLLECTOR_SECTIONS.point}`,
    icon: MapPin,
  },
  {
    label: 'Horários de funcionamento',
    href: `${COLLECTOR_HOME}#${COLLECTOR_SECTIONS.hours}`,
    icon: Clock,
  },
  {
    label: 'Materiais e capacidade',
    href: COLLECTOR_MATERIALS,
    icon: Boxes,
  },
];

export function CollectorSidebar({
  activePage = 'overview',
}: {
  activePage?: 'overview' | 'materials';
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:w-64 lg:shrink-0 lg:self-start">
      <div className="hidden rounded-2xl border border-slate-200/70 bg-surface-alt p-4 lg:block">
        <p className="text-[10px] font-bold tracking-wider text-brand-muted uppercase">
          Parceiro coletor
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {collectorProfile.shortName}
        </p>
        <p className="text-xs text-slate-500">CNPJ: {collectorProfile.cnpj}</p>
      </div>

      <nav aria-label="Painel do coletor" className="lg:mt-4">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {sidebarItems.map(({ label, href, icon: Icon }) => {
            const active =
              activePage === 'materials'
                ? label === 'Materiais e capacidade'
                : label === 'Visão geral';

            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand',
                    active
                      ? 'bg-brand-light font-bold text-brand-dark'
                      : 'text-slate-600 hover:bg-surface-alt hover:text-brand'
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
