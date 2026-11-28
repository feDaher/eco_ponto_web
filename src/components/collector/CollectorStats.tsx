import {
  Gauge,
  MapPinCheck,
  Scale,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import type { CollectorPoint } from '@/types/collector';
import type { PointStatus } from '@/types/api';

type CollectorStatsProps = {
  point?: CollectorPoint | null;
};

const kg = new Intl.NumberFormat('pt-BR');

const MAP_STATUS_CONFIG: Record<
  PointStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    fallbackSubtext: string;
  }
> = {
  approved: {
    label: 'Ativo e verificado',
    badgeClass: 'bg-brand-light text-brand-dark',
    dotClass: 'bg-brand',
    fallbackSubtext: 'Visível para cidadãos na busca do mapa',
  },
  pending: {
    label: 'Em análise',
    badgeClass: 'bg-amber-50 text-amber-800',
    dotClass: 'bg-amber-500',
    fallbackSubtext: 'Oculto no mapa até a aprovação',
  },
  rejected: {
    label: 'Cadastro recusado',
    badgeClass: 'bg-red-50 text-red-800',
    dotClass: 'bg-red-500',
    fallbackSubtext: 'Revise os dados do ponto para nova análise',
  },
  removed: {
    label: 'Inativo no mapa',
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-400',
    fallbackSubtext: 'Ponto temporariamente indisponível',
  },
};

function formatLastUpdate(isoDate: string): string | null {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export function CollectorStats({ point = null }: CollectorStatsProps) {
  const monthlyKg = point?.stats?.monthlyKg ?? 0;
  const monthlyGrowth = point?.stats?.monthlyGrowth ?? null;
  const storedKg = point?.stats?.storedKg ?? 0;
  const capacityKg = point?.stats?.capacityKg ?? 0;

  const rawUsage =
    capacityKg > 0 ? Math.round((storedKg / capacityKg) * 100) : 0;
  const usage = Math.min(100, Math.max(0, rawUsage));

  const statusMeta = point ? MAP_STATUS_CONFIG[point.status] : null;
  const formattedUpdate = point?.updatedAt
    ? formatLastUpdate(point.updatedAt)
    : null;

  const mapSubtext = !point
    ? 'Cadastre um ponto para aparecer no mapa'
    : point.stats?.lastCheckIn
      ? `Presença confirmada às ${point.stats.lastCheckIn}`
      : formattedUpdate
        ? `Atualizado em ${formattedUpdate}`
        : statusMeta?.fallbackSubtext;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard label="Total recebido (mês)" icon={Scale}>
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-slate-800">
            {kg.format(monthlyKg)}{' '}
            <span className="text-base font-semibold text-brand-muted">kg</span>
          </p>

          {monthlyGrowth !== null ? (
            <p
              className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${
                monthlyGrowth >= 0 ? 'text-brand' : 'text-red-600'
              }`}
            >
              {monthlyGrowth >= 0 ? (
                <TrendingUp aria-hidden="true" className="size-3" />
              ) : (
                <TrendingDown aria-hidden="true" className="size-3" />
              )}
              {monthlyGrowth > 0 ? `+${monthlyGrowth}` : monthlyGrowth}% vs. mês
              anterior
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-brand-muted">
              {point
                ? 'Sem comparativo com o mês anterior'
                : 'Nenhum ponto vinculado'}
            </p>
          )}
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
              className="h-2 rounded-full bg-brand transition-all"
              style={{ width: `${usage}%` }}
            />
          </div>
        </div>
      </StatCard>

      <StatCard label="Status no mapa" icon={MapPinCheck}>
        <div className="space-y-1">
          {statusMeta ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.badgeClass}`}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${statusMeta.dotClass}`}
              />
              {statusMeta.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-slate-400"
              />
              Sem ponto vinculado
            </span>
          )}
          <p className="text-xs text-brand-muted">{mapSubtext}</p>
        </div>
      </StatCard>
    </div>
  );
}
