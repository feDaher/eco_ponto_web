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

type SidebarItem = {
  label: string;
  section: string;
  icon: LucideIcon;
};

const sidebarItems: SidebarItem[] = [
  {
    label: 'Visão geral',
    section: COLLECTOR_SECTIONS.overview,
    icon: LayoutDashboard,
  },
  {
    label: 'Registrar recebimento',
    section: COLLECTOR_SECTIONS.receipt,
    icon: ClipboardPlus,
  },
  {
    label: 'Histórico e MTRs',
    section: COLLECTOR_SECTIONS.history,
    icon: History,
  },
  {
    label: 'Meu ponto de coleta',
    section: COLLECTOR_SECTIONS.point,
    icon: MapPin,
  },
  {
    label: 'Horários de funcionamento',
    section: COLLECTOR_SECTIONS.hours,
    icon: Clock,
  },
  {
    label: 'Materiais e capacidade',
    section: COLLECTOR_SECTIONS.categories,
    icon: Boxes,
  },
];

export function CollectorSidebar() {
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
          {sidebarItems.map(({ label, section, icon: Icon }) => (
            <li key={section} className="shrink-0">
              <a
                href={`#${section}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium whitespace-nowrap text-slate-600 transition-colors hover:bg-surface-alt hover:text-brand focus-visible:outline-2 focus-visible:outline-brand lg:border-transparent lg:bg-transparent"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
