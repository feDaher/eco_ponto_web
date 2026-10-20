import {
  Gauge,
  MapPinCheck,
  Scale,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { collectorStats } from '@/data/mockCollector';

type StatCardProps = {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

function StatCard({ label, icon: Icon, children }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between">
        <h3 className="text-[11px] font-bold tracking-wider text-brand-muted uppercase">
          {label}
        </h3>
        <span className="rounded-lg bg-brand-light p-1.5 text-brand">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      {children}
    </div>
  );
}

const kg = new Intl.NumberFormat('pt-BR');

export function CollectorStats() {
  const { monthlyKg, monthlyGrowth, storedKg, capacityKg, lastCheckIn } =
    collectorStats;
  const usage = Math.round((storedKg / capacityKg) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard label="Total recebido (mês)" icon={Scale}>
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-slate-800">
            {kg.format(monthlyKg)}{' '}
            <span className="text-base font-semibold text-brand-muted">kg</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand">
            <TrendingUp aria-hidden="true" className="size-3" />+{monthlyGrowth}
            % vs. mês anterior
          </p>
        </div>
      </StatCard>

      <StatCard label="Capacidade central" icon={Gauge}>
        <div>
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-800">
              {usage}%
            </span>
            <span className="text-xs font-medium text-brand-muted">
              {kg.format(storedKg)} / {kg.format(capacityKg)} kg
            </span>
          </p>
          <div
            role="progressbar"
            aria-label="Capacidade utilizada"
            aria-valuenow={usage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-2 rounded-full bg-brand"
              style={{ width: `${usage}%` }}
            />
          </div>
        </div>
      </StatCard>

      <StatCard label="Status no mapa" icon={MapPinCheck}>
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand"
            />
            Ativo e verificado
          </span>
          <p className="text-xs text-brand-muted">
            Presença confirmada hoje às {lastCheckIn}
          </p>
        </div>
      </StatCard>
    </div>
  );
}
