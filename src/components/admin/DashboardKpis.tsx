import { MapPinned, Recycle, ShieldCheck, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import type { DashboardStats } from '@/types/api';

const number = new Intl.NumberFormat('pt-BR');
const growth = new Intl.NumberFormat('pt-BR', {
  signDisplay: 'always',
  maximumFractionDigits: 1,
});

type KpiValueProps = {
  value: string;
  unit: string;
  badge: string;
  note: string;
};

function KpiValue({ value, unit, badge, note }: KpiValueProps) {
  return (
    <div>
      <p className="flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold tracking-tight text-slate-800">
          {value}
        </span>
        <span className="text-xs font-medium text-brand-muted">{unit}</span>
      </p>
      <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span className="rounded-full bg-brand-light px-2 py-0.5 font-bold text-brand-dark">
          {badge}
        </span>
        {note}
      </p>
    </div>
  );
}

type DashboardKpisProps = {
  stats: DashboardStats;
};

export function DashboardKpis({ stats }: DashboardKpisProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Pontos ativos" icon={MapPinned}>
        <KpiValue
          value={number.format(stats.activePoints)}
          unit="pontos homologados"
          badge={`${growth.format(stats.activePointsGrowth)}%`}
          note="vs. mês anterior"
        />
      </StatCard>
      <StatCard label="Total coletado" icon={Recycle}>
        <KpiValue
          value={number.format(stats.collectedKg)}
          unit="kg"
          badge={`${growth.format(stats.collectedGrowth)}%`}
          note="vs. mês anterior"
        />
      </StatCard>
      <StatCard label="Usuários cadastrados" icon={Users}>
        <KpiValue
          value={number.format(stats.registeredUsers)}
          unit="cidadãos e empresas"
          badge={`+${number.format(stats.newUsers)} novos`}
          note="neste mês"
        />
      </StatCard>
      <StatCard label="Rastreabilidade" icon={ShieldCheck}>
        <KpiValue
          value={`${number.format(stats.traceability)}%`}
          unit="do volume"
          badge="Aterro zero"
          note="destinação registrada"
        />
      </StatCard>
    </div>
  );
}
